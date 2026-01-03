enum LysSide {
    //% block="venstre"
    Venstre,
    //% block="høyre"
    Hoyre,
    //% block="begge"
    Begge
}

enum LysAvPa {
    //% block="av"
    Av,
    //% block="på"
    Pa
}

enum Farge {
    //% block="rød"
    Rod,
    //% block="grønn"
    Gronn,
    //% block="blå"
    Bla,
    //% block="gul"
    Gul,
    //% block="lilla"
    Lilla,
    //% block="cyan"
    Cyan,
    //% block="hvit"
    Hvit,
    //% block="oransje"
    Oransje
}

namespace keyestudioPro {
    let underlys: neopixel.Strip = null
    let underlysPin: DigitalPin = DigitalPin.P7
    let underlysAntall = 4

    function ensureUnderlys(): void {
        if (underlys) return
        underlys = neopixel.create(underlysPin, underlysAntall, NeoPixelMode.RGB)
    }

    function toNeoColor(f: Farge): number {
        switch (f) {
            case Farge.Rod: return neopixel.colors(NeoPixelColors.Red)
            case Farge.Gronn: return neopixel.colors(NeoPixelColors.Green)
            case Farge.Bla: return neopixel.colors(NeoPixelColors.Blue)
            case Farge.Gul: return neopixel.colors(NeoPixelColors.Yellow)
            case Farge.Lilla: return neopixel.colors(NeoPixelColors.Purple)
            case Farge.Cyan: return neopixel.colors(NeoPixelColors.BlueGreen)
            case Farge.Hvit: return neopixel.colors(NeoPixelColors.White)
            case Farge.Oransje: return neopixel.colors(NeoPixelColors.Orange)
        }
        return neopixel.colors(NeoPixelColors.White)
    }

    /**
     * Slå frontlys av eller på (venstre, høyre eller begge).
     */
    //% block="frontlys %side %avpa"
    //% group="Lys"
    export function frontlys(side: LysSide, avpa: LysAvPa): void {
        const state = (avpa == LysAvPa.Pa) ? LedState.ON : LedState.OFF

        if (side == LysSide.Venstre || side == LysSide.Begge) {
            mecanumRobotV2.setLed(LedCount.Left, state)
        }
        if (side == LysSide.Hoyre || side == LysSide.Begge) {
            mecanumRobotV2.setLed(LedCount.Right, state)
        }
    }

    /**
     * Sett pin og antall LED for underlys (NeoPixel).
     * Standard er P7 og 4 LED.
     */
    //% block="sett underlys pin %pin antall %antall"
    //% antall.min=1 antall.max=60 antall.defl=4
    //% group="Lys"
    export function settUnderlys(pin: DigitalPin, antall: number): void {
        underlysPin = pin
        underlysAntall = antall
        underlys = null
        ensureUnderlys()
    }

    /**
     * Underlys: sett farge.
     */
    //% block="underlys farge %farge"
    //% group="Lys"
    export function underlysFarge(farge: Farge): void {
        ensureUnderlys()
        underlys.showColor(toNeoColor(farge))
        underlys.show()
    }

    /**
     * Underlys: av (clear).
     */
    //% block="underlys av"
    //% group="Lys"
    export function underlysAv(): void {
        ensureUnderlys()
        underlys.clear()
        underlys.show()
    }

    /**
     * Underlys: sett lysstyrke 0-255.
     */
    //% block="underlys lysstyrke %styrke"
    //% styrke.min=0 styrke.max=255 styrke.defl=40
    //% group="Lys"
    export function underlysLysstyrke(styrke: number): void {
        ensureUnderlys()
        underlys.setBrightness(styrke)
        underlys.show()
    }
}