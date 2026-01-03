enum IRKnapp {
  // Piler og OK
  //% block="↑"
  Opp = 70,
  //% block="←"
  Venstre = 68,
  //% block="↓"
  Ned = 21,
  //% block="→"
  Hoyre = 67,
  //% block="OK"
  OK = 64,

  // Tall
  //% block="1"
  N1 = 22,
  //% block="2"
  N2 = 25,
  //% block="3"
  N3 = 13,
  //% block="4"
  N4 = 12,
  //% block="5"
  N5 = 24,
  //% block="6"
  N6 = 94,
  //% block="7"
  N7 = 8,
  //% block="8"
  N8 = 28,
  //% block="9"
  N9 = 90,
  //% block="0"
  N0 = 82,

  // Symbol
  //% block="*"
  Stjerne = 66,
  //% block="#"
  Firkant = 74
}

namespace keyestudioPro {
  let irStarted = false
  let last = 0

  // Vi bruker én event-kanal, og sender "knappen" som value
  const EV_IR = 3110

  /**
   * Start IR på valgt pin (legg i "Ved start")
   */
  //% block="start IR på pin %pin"
  //% group="IR"
  export function startIR(pin: DigitalPin): void {
    if (irStarted) return
    irStarted = true

    irRemote.connectInfrared(pin)

    control.inBackground(function () {
      while (true) {
        const v = irRemote.returnIrButton()
        if (v != 0 && v != last) {
          last = v
          control.raiseEvent(EV_IR, v)
        }
        basic.pause(20)
      }
    })
  }

  /**
   * Når en bestemt IR-knapp trykkes
   */
  //% block="når IR %knapp trykkes"
  //% group="IR"
  export function onIR(knapp: IRKnapp, handler: () => void): void {
    control.onEvent(EV_IR, knapp as number, handler)
  }

  /**
   * Siste IR-kode (debug)
   */
  //% block="siste IR kode"
  //% group="IR"
  export function sisteIrKode(): number {
    return last
  }
}
