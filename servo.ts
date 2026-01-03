namespace keyestudioPro {

    const SERVO_MIDT = 90
    const SERVO_VENSTRE = 160
    const SERVO_HOYRE = 20

    /**
     * Sett hodet (ultralyd-servo) til midtposisjon.
     * Brukes i "Ved start".
     */
    //% block="hode se rett frem"
    //% group="Servo"
    export function hodeMidt(): void {
        mecanumRobotV2.setServo(SERVO_MIDT)
        basic.pause(300)
    }

    /**
     * Se til venstre med hodet.
     */
    //% block="hode se til venstre"
    //% group="Servo"
    export function hodeVenstre(): void {
        mecanumRobotV2.setServo(SERVO_VENSTRE)
        basic.pause(300)
    }

    /**
     * Se til høyre med hodet.
     */
    //% block="hode se til høyre"
    //% group="Servo"
    export function hodeHoyre(): void {
        mecanumRobotV2.setServo(SERVO_HOYRE)
        basic.pause(300)
    }

    /**
     * Se i valgt retning.
     */
    //% block="hode se %retning"
    //% group="Servo"
    export function hodeSe(retning: HodeRetning): void {
        if (retning == HodeRetning.Venstre) {
            hodeVenstre()
        } else if (retning == HodeRetning.Hoyre) {
            hodeHoyre()
        } else {
            hodeMidt()
        }
    }
}

/**
 * Retning for hode
 */
enum HodeRetning {
    //% block="venstre"
    Venstre,
    //% block="rett frem"
    Midt,
    //% block="høyre"
    Hoyre
}