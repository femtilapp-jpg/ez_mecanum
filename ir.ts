//% color="#E63022" weight=50 icon="\uf1eb"
//% groups='["Fjernkontroll"]'
namespace keyestudioPro {

    /**
     * Knappekoder for IR-fjernkontroll (Keyestudio/NEC)
     * Denne ligger nå INNI namespace for å unngå feilmeldingen.
     */
    export enum IrButton {
        //% block="⬆ Opp"
        Up = 0x46,    // 70
        //% block="⬇ Ned"
        Down = 0x15,  // 21
        //% block="⬅ Venstre"
        Left = 0x44,  // 68
        //% block="➡ Høyre"
        Right = 0x43, // 67
        //% block="🆗 OK"
        Ok = 0x40,    // 64
        //% block="1"
        N1 = 0x16,    // 22
        //% block="2"
        N2 = 0x19,    // 25
        //% block="3"
        N3 = 0x0D,    // 13
        //% block="4"
        N4 = 0x0C,    // 12
        //% block="5"
        N5 = 0x18,    // 24
        //% block="6"
        N6 = 0x5E,    // 94
        //% block="7"
        N7 = 0x08,    // 8
        //% block="8"
        N8 = 0x1C,    // 28
        //% block="9"
        N9 = 0x5A,    // 90
        //% block="0"
        N0 = 0x52,    // 82
        //% block="*"
        Star = 0x42,  // 66
        //% block="#"
        Hash = 0x4A   // 74
    }

    let irState: {
        active: boolean,
        command: number
    } = { active: false, command: -1 };

    /**
     * Intern funksjon: Starter IR-lytting på pinne P8.
     * Denne kjører NEC-dekoding manuelt for å unngå bibliotek-konflikter.
     */
    function initIr() {
        if (irState.active) return;

        irState.active = true;
        let irPin = DigitalPin.P8; // Standard for Keyestudio

        pins.onPulsed(irPin, PulseValue.Low, () => {
            // Vi må ha en event handler for å aktivere pulsmåling
            // men selve dekodingen skjer i bakgrunnen
        });

        control.inBackground(() => {
            let lastState = 1;
            let lastTime = control.micros();
            let bits: number[] = [];
            let command = -1;

            while (true) {
                let currentState = pins.digitalReadPin(irPin);

                if (currentState != lastState) {
                    let now = control.micros();
                    let duration = now - lastTime;

                    // NEC Start-sekvens (ca 13.5ms totalt)
                    if (duration > 10000 && currentState == 1) {
                        bits = []; // Reset ved ny startpuls
                    }
                    // Data bits
                    else if (bits.length < 32 && currentState == 1) {
                        // 0 = kort puls + kort pause
                        // 1 = kort puls + lang pause (>1000us)
                        if (duration > 1000) {
                            bits.push(1);
                        } else {
                            bits.push(0);
                        }
                    }

                    // Når vi har 32 bits, har vi en hel kommando
                    if (bits.length == 32) {
                        let data = 0;
                        // Vi leser Command (bits 16-23)
                        for (let i = 0; i < 8; i++) {
                            if (bits[16 + i] == 1) {
                                data += (1 << i);
                            }
                        }

                        // Send hendelse hvis det er en ny knapp
                        if (data != command) {
                            control.raiseEvent(1001, data);
                            command = data;
                            // En liten pause for å hindre dobbelttrykk
                            basic.pause(200);
                            command = -1;
                        }
                        bits = [];
                    }

                    lastTime = now;
                    lastState = currentState;
                }
            }
        });
    }

    /**
     * Startblokk som kjører kode når en spesifikk knapp trykkes.
     */
    //% block="når IR knapp %button trykkes"
    //% group="Fjernkontroll"
    export function onIrButton(button: IrButton, action: () => void) {
        initIr();
        // Lytter etter vår egendefinerte event ID 1001
        control.onEvent(1001, button, action);
    }
}