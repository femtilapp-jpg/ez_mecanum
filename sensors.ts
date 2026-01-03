enum LinjeSensor {
    //% block="venstre"
    Venstre,
    //% block="midt"
    Midt,
    //% block="høyre"
    Hoyre
}

enum LinjeTilstand {
    //% block="på linje"
    PaLinje,
    //% block="ikke på linje"
    IkkePaLinje
}

enum LinjeMønster {
    //% block="ingen"
    Ingen,
    //% block="kun venstre"
    KunVenstre,
    //% block="kun midt"
    KunMidt,
    //% block="kun høyre"
    KunHoyre,
    //% block="venstre+midt"
    VenstreMidt,
    //% block="midt+høyre"
    MidtHoyre,
    //% block="alle"
    Alle
}

namespace keyestudioPro {

    function ltPin(sensor: LinjeSensor): LT {
        if (sensor == LinjeSensor.Venstre) return LT.Left
        if (sensor == LinjeSensor.Midt) return LT.Center
        return LT.Right
    }

    /**
     * Les avstand i cm fra ultralydsensor.
     */
    //% block="avstand (cm)"
    //% group="Sensorer"
    export function avstandCm(): number {
        return mecanumRobotV2.ultra()
    }

    /**
     * Sjekk om avstanden er nærmere enn en grense (cm).
     */
    //% block="avstand er nærmere enn %cm cm"
    //% cm.min=1 cm.max=400 cm.defl=15
    //% group="Sensorer"
    export function avstandNærmereEnn(cm: number): boolean {
        return mecanumRobotV2.ultra() < cm
    }

    /**
     * Les råverdi fra linjesensor (0 eller 1).
     * På noen kit betyr 0 linje og 1 ikke linje, på andre motsatt.
     */
    //% block="linjesensor %sensor verdi"
    //% group="Sensorer"
    export function linjeVerdi(sensor: LinjeSensor): number {
        return mecanumRobotV2.LineTracking(ltPin(sensor))
    }

    /**
     * Sjekk om linjesensoren er på linje eller ikke.
     * Hvis logikken på ditt kit er motsatt, bytter vi dette i Avansert senere.
     */
    //% block="linjesensor %sensor er %tilstand"
    //% group="Sensorer"
    export function linjeEr(sensor: LinjeSensor, tilstand: LinjeTilstand): boolean {
        const v = mecanumRobotV2.LineTracking(ltPin(sensor))

        // Standard antakelse som ofte brukes i Keyestudio eksempler:
        // 0 betyr linje, 1 betyr ikke linje
        const erPaLinje = (v == 0)

        if (tilstand == LinjeTilstand.PaLinje) return erPaLinje
        return !erPaLinje
    }

    /**
     * Les alle tre linjesensorene som et mønster.
     */
    //% block="linjemønster"
    //% group="Sensorer"
    export function linjeMønster(): LinjeMønster {
        const l = mecanumRobotV2.LineTracking(LT.Left) == 0
        const c = mecanumRobotV2.LineTracking(LT.Center) == 0
        const r = mecanumRobotV2.LineTracking(LT.Right) == 0

        if (!l && !c && !r) return LinjeMønster.Ingen
        if (l && !c && !r) return LinjeMønster.KunVenstre
        if (!l && c && !r) return LinjeMønster.KunMidt
        if (!l && !c && r) return LinjeMønster.KunHoyre
        if (l && c && !r) return LinjeMønster.VenstreMidt
        if (!l && c && r) return LinjeMønster.MidtHoyre
        return LinjeMønster.Alle
    }
}