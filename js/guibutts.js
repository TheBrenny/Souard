class SouardButt {
    constructor(text, x, y, w, h) {
        this.text = !text ? "placeholder" : text;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.isDown = false;
        this.enabled = true;

        this.onPressed((b) => {console.log("I'VE BEEN HIT!\t" + this.text);});
        this.onReleased((b) => {console.log("I'VE BEEN LOST!\t" + this.text);});
    }
    onPressed(f) {
        if(typeof f !== "function") {
            this.isDown = true;
            this._onPress(f);
        } 
        else this._onPress = f;
        
        return this;
    }
    onReleased(f) {
        if(typeof f !== "function") {
            this.isDown = false;
            this._onRelease(f);
        }
        else this._onRelease = f;

        return this;
    }
    doIHas(x,y) {
        if(!this.enabled) return false;
        if(typeof x === "object") {
            y = x.y;
            x = x.x;
        }

        return this.x < x && x < this.x + this.width && this.y < y && y < this.y + this.height;
    }
    draw() {
        push();

        if(this.isDown) {
            fill(0,240,20);
            noStroke();
            rect(this.x, this.y, this.width, this.height, 5);
        }

        stroke(255);
        fill(0,0,0,0);
        rect(this.x, this.y, this.width, this.height, 5);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(30);
        text(this.text, this.x + this.width / 2, this.y + this.height / 2);

        pop();
    }
}

class SouardSoundButt extends SouardButt {
    constructor(text, x, y, w, h, index) {
        super(text, x, y, w, h);
        this.maxAmp = 0.5;
        this.index = index;
        
        this.sound = new p5.Oscillator();
        this.sound.setType("sine");
        this.sound.freq(midiToFreq(60 + index));
        this.sound.amp(0);
        this.sound.start();
        this.amp = new p5.Amplitude();
        this.amp.setInput(this.sound);

        this.onPressed(() => {this.sound.amp(this.maxAmp, 0.05);});
        this.onReleased(() => {this.sound.amp(0, 0.05);});
    }

    setInstrument(inst) {
        this.sound.setType(inst);
    }

    draw() {
        push();

        if(SouardSoundButt.scale.includes(this.index % SouardSoundButt.scale[SouardSoundButt.scale.length - 1])) {
            fill(50);
            noStroke();
            rect(this.x, this.y, this.width, this.height, 5);
        }

        if(this.isDown) {
            fill(0, 240,20);
            noStroke();
            let ampHeight = clamp(map(this.amp.getLevel(), 0, this.maxAmp / 2, 0, this.height), 0, this.height);
            rect(this.x, this.y + this.height - ampHeight, this.width, ampHeight, 5, 15);
        }

        stroke(255);
        fill(0,0,0,0);
        rect(this.x, this.y, this.width, this.height, 5, 15);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(30);
        text(this.text, this.x + this.width / 2, this.y + this.height / 2);
        
        pop();
    }
}

SouardSoundButt.scale = [0, 2, 4, 5, 7, 9, 11, 12];

class SouardOctButt extends SouardButt {
    constructor(text, x, y, w, h, octShift) {
        super(text, x, y, w, h);
        this.octShift = octShift;
        this.toggled = false;

        this.onPressed((b) => {
            b.setOctave(this);
            this.toggled = true;
        });
        this.onReleased(() => {
            // intentionally blank so we don't spam console.
        });
        this.toggleOff = () => {
            this.toggled = false;
        };
    }

    draw() {
        push();

        ellipseMode(CORNER);
        if(this.toggled) {
            fill(0, 240,20);
            noStroke();
            ellipse(this.x, this.y, this.width, this.height);
        }

        stroke(255);
        fill(0,0,0,0);
        ellipse(this.x, this.y, this.width, this.height);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(30);
        text(this.text, this.x + this.width / 2, this.y + this.height / 2);

        pop();
    }
}

class SouardInstButt extends SouardButt {
    constructor(text, x, y, w, h, inst) {
        super(text, x, y, w, h);
        this.instrument = inst;
        this.toggled = false;

        this.onPressed((b) => {
            b.setInstrument(this);
            this.toggled = true;
        });
        this.onReleased(() => {
            // intentionally blank so we don't spam console.
        });
        this.toggleOff = () => {
            this.toggled = false;
        };
    }

    draw() {
        push();

        ellipseMode(CORNER);
        if(this.toggled) {
            fill(0,240,20);
            noStroke();
            ellipse(this.x, this.y, this.width, this.height);
        }

        stroke(255);
        fill(0,0,0,0);
        ellipse(this.x, this.y, this.width, this.height);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(30);
        text(this.text, this.x + this.width / 2, this.y + this.height / 2);

        pop();
    }
}

class PrototypeArea extends SouardButt {
    constructor(text, x, y, w, h) {

    }
}