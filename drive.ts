enum KjorModus {
    //% block="↑ Fremover"
    Fram,
    //% block="↓ Bakover"
    Bak,

    //% block="← Sidelengs venstre"
    SideVenstre,
    //% block="→ Sidelengs høyre"
    SideHoyre,

    //% block="↖ Frem mot venstre"
    FramVenstre,
    //% block="↗ Frem mot høyre"
    FramHoyre,
    //% block="↙ Bak mot venstre"
    BakVenstre,
    //% block="↘ Bak mot høyre"
    BakHoyre,

    //% block="↺ Snu til venstre"
    SnuVenstre,
    //% block="↻ Snu til høyre"
    SnuHoyre,

    //% block="⤺ Kjør bue til venstre"
    BueVenstre,
    //% block="⤻ Kjør bue til høyre"
    BueHoyre
}

namespace keyestudioPro {

    // ---------- Start-oppsett ----------
    let wheelDiameterMm = 60

    // Kalibreringer (finjuster disse på gulvet)
    // cm per sekund når fart = 100
    let cmPerSecAt100 = 25

    // grader per sekund ved snu fart = 100
    let degPerSecAt100 = 180

    function clampSpeed(pct: number): number {
        if (pct < 0) return 0
        if (pct > 100) return 100
        return pct
    }

    function clampPositive(n: number): number {
        if (n < 0) return 0
        return n
    }

    /**
     * Sett hjuldiameter i mm (standard: 60 mm).
     */
    //% block="sett hjuldiameter %mm mm"
    //% mm.min=10 mm.max=200 mm.defl=60
    //% group="Start"
    export function settHjuldiameter(mm: number): void {
        wheelDiameterMm = clampPositive(mm)
    }

    /**
     * Sett kalibrering: cm per sekund ved fart 100.
     * Tips: kjør 100 cm på fart 100, mål tid, regn ut 100 / sekunder.
     */
    //% block="sett kalibrering %cmps cm per sekund ved fart 100"
    //% cmps.min=1 cmps.max=200 cmps.defl=25
    //% group="Start"
    export function settKalibreringCmPerSek(cmps: number): void {
        cmPerSecAt100 = clampPositive(cmps)
    }

    /**
     * Sett kalibrering: grader per sekund ved snu fart 100.
     * Tips: snu 360 grader på fart 100, mål tid, regn ut 360 / sekunder.
     */
    //% block="sett kalibrering %dps grader per sekund ved snu fart 100"
    //% dps.min=10 dps.max=1000 dps.defl=180
    //% group="Start"
    export function settKalibreringGraderPerSek(dps: number): void {
        degPerSecAt100 = clampPositive(dps)
    }

    // ---------- Interne motorfunksjoner ----------
    function motorsStop(): void {
        mecanumRobotV2.state()
    }

    function setAllForward(s: number) {
        mecanumRobotV2.Motor(LR.Upper_left, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Lower_right, MD.Forward, s)
    }

    function setAllBackward(s: number) {
        mecanumRobotV2.Motor(LR.Upper_left, MD.Back, s)
        mecanumRobotV2.Motor(LR.Lower_left, MD.Back, s)
        mecanumRobotV2.Motor(LR.Upper_right, MD.Back, s)
        mecanumRobotV2.Motor(LR.Lower_right, MD.Back, s)
    }

    function spinLeft(s: number) {
        mecanumRobotV2.Motor(LR.Upper_left, MD.Back, s)
        mecanumRobotV2.Motor(LR.Lower_left, MD.Back, s)
        mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Lower_right, MD.Forward, s)
    }

    function spinRight(s: number) {
        mecanumRobotV2.Motor(LR.Upper_left, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Upper_right, MD.Back, s)
        mecanumRobotV2.Motor(LR.Lower_right, MD.Back, s)
    }

    function strafeLeft(s: number) {
        mecanumRobotV2.Motor(LR.Upper_left, MD.Back, s)
        mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Lower_right, MD.Back, s)
    }

    function strafeRight(s: number) {
        mecanumRobotV2.Motor(LR.Upper_left, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Lower_left, MD.Back, s)
        mecanumRobotV2.Motor(LR.Upper_right, MD.Back, s)
        mecanumRobotV2.Motor(LR.Lower_right, MD.Forward, s)
    }

    function diagFramVenstre(s: number) {
        mecanumRobotV2.Motor(LR.Upper_left, MD.Forward, 0)
        mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Lower_right, MD.Forward, 0)
    }

    function diagFramHoyre(s: number) {
        mecanumRobotV2.Motor(LR.Upper_left, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, 0)
        mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, 0)
        mecanumRobotV2.Motor(LR.Lower_right, MD.Forward, s)
    }

    function diagBakVenstre(s: number) {
        mecanumRobotV2.Motor(LR.Upper_left, MD.Back, s)
        mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, 0)
        mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, 0)
        mecanumRobotV2.Motor(LR.Lower_right, MD.Back, s)
    }

    function diagBakHoyre(s: number) {
        mecanumRobotV2.Motor(LR.Upper_left, MD.Back, 0)
        mecanumRobotV2.Motor(LR.Lower_left, MD.Back, s)
        mecanumRobotV2.Motor(LR.Upper_right, MD.Back, s)
        mecanumRobotV2.Motor(LR.Lower_right, MD.Back, 0)
    }

    function curveLeft(s: number) {
        const inner = Math.round(s * 0.5)
        mecanumRobotV2.Motor(LR.Upper_left, MD.Forward, inner)
        mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, inner)
        mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Lower_right, MD.Forward, s)
    }

    function curveRight(s: number) {
        const inner = Math.round(s * 0.5)
        mecanumRobotV2.Motor(LR.Upper_left, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, s)
        mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, inner)
        mecanumRobotV2.Motor(LR.Lower_right, MD.Forward, inner)
    }

    function applyMode(mode: KjorModus, fart: number): void {
        const s = clampSpeed(fart)

        switch (mode) {
            case KjorModus.Fram: setAllForward(s); break
            case KjorModus.Bak: setAllBackward(s); break

            case KjorModus.SideVenstre: strafeLeft(s); break
            case KjorModus.SideHoyre: strafeRight(s); break

            case KjorModus.FramVenstre: diagFramVenstre(s); break
            case KjorModus.FramHoyre: diagFramHoyre(s); break
            case KjorModus.BakVenstre: diagBakVenstre(s); break
            case KjorModus.BakHoyre: diagBakHoyre(s); break

            case KjorModus.SnuVenstre: spinLeft(s); break
            case KjorModus.SnuHoyre: spinRight(s); break

            case KjorModus.BueVenstre: curveLeft(s); break
            case KjorModus.BueHoyre: curveRight(s); break
        }
    }

    // ---------- Blokker ----------

    /**
     * Stopp alle motorer.
     */
    //% block="stopp"
    //% group="Kjøring"
    export function stopp(): void {
        motorsStop()
    }

    /**
     * Kjør i valgt retning.
     */
    //% block="kjør %modus med fart %fart \\%"
    //% fart.min=0 fart.max=100 fart.defl=60
    //% group="Kjøring"
    export function kjorModus(modus: KjorModus, fart: number): void {
        applyMode(modus, fart)
    }

    /**
     * Kjør i valgt retning i gitt tid.
     */
    //% block="kjør %modus med fart %fart \\% i %ms ms"
    //% fart.min=0 fart.max=100 fart.defl=60
    //% ms.min=10 ms.max=10000 ms.defl=500
    //% group="Kjøring"
    export function kjorModusTid(modus: KjorModus, fart: number, ms: number): void {
        applyMode(modus, fart)
        basic.pause(ms)
        motorsStop()
    }

    // ---------- Små "debug/info" blokker (valgfritt) ----------
    // Du kan la disse stå, eller fjerne dem senere.

    //% block="hjuldiameter mm"
    //% group="Avansert"
    export function hjuldiameterMm(): number {
        return wheelDiameterMm
    }

    //% block="kalibrering cm per sekund ved fart 100"
    //% group="Avansert"
    export function kalibreringCmPerSekAt100(): number {
        return cmPerSecAt100
    }

    //% block="kalibrering grader per sekund ved snu fart 100"
    //% group="Avansert"
    export function kalibreringGraderPerSekAt100(): number {
        return degPerSecAt100
    }
}