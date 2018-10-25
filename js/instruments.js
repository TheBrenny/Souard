// Don't get confused. This just holds all the info on an instrument. It's ADSR and such.

class Instrument {
    constructor(name) {
        this.name = name;
    }
}

class SineWaveInstrument extends Instrument {
    constructor(name) {
        super(name);
    }
}