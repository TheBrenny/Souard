class SoundBoard {
    constructor(width, height, keys, octaveKeys, instrumentKeys, sx, sy, w, h, gap) {
        let max = width * height;
        let octaveAmount = octaveKeys.length;
        let instrumentAmount = instrumentKeys.length;
        if(keys.length != max) console.warn(`Oh no! I have ${keys.length} keys, and are making ${max} buttons! Is this correct?!`);

        this.gwidth = width;
        this.gheight = height;
        this.keys = keys;
        this.octaveKeys = octaveKeys;
        this.octaveAmouont = octaveAmount;
        this.instrumentAmount = instrumentAmount;
        this.sx = sx;
        this.sy = sy;
        this.bwidth = w;
        this.bheight = h;
        this.btnGap = gap;

        this.octave = 0;
        let instruments = ["sine", "square", "triangle", "sawtooth"];
        this.instrument = "sine";
        this.btns = [];
        
        for(let y = 0; y < height; y++) {
            this.btns[y] = [];
            for(let x = 0; x < width; x++) {
                this.btns[y][x] = new SouardSoundButt((!!keys.length ? keys[0] : "?"), 0, 0, 0, 0, x + width * y);
                if(!!keys.length) keys = keys.slice(1);
            }
        }

        this.octaveBtns = [];
        for(let y = 0; y < octaveAmount; y++) {
            this.octaveBtns[y] = new SouardOctButt((!!octaveKeys.length ? octaveKeys[0] : "?"), 0, 0, 0, 0, (octaveAmount - y) - ceil(octaveAmount / 2)); // (7-y)-4 is the octave shift
            if(!!octaveKeys.length) octaveKeys = octaveKeys.slice(1);
        }
        this.octaveBtns[floor(octaveAmount / 2)].onPressed(this);

        this.instrumentButtons = [];
        for(let y = 0; y < instrumentAmount; y++) {
            this.instrumentButtons[y] = new SouardInstButt(!!instrumentKeys.length ? instrumentKeys[0] : "?", 0, 0, 0, 0, instruments[y]);
            if(!!instrumentKeys.length) instrumentKeys = instrumentKeys.slice(1);
        }
        this.instrumentButtons[0].onPressed(this);

        this.adjustBoardSize();
    }

    adjustBoardSize() {
        let oBtnSize = (this.bheight - this.btnGap * (this.octaveAmouont - 1)) / this.octaveAmouont; // seven octave buttons 0 with +/-3.
        let btnsize = (min(this.bwidth, this.bheight) - this.btnGap * (this.gwidth - 1)) / this.gwidth;
        let iBtnsSize = oBtnSize * this.instrumentButtons.length + this.btnGap * (this.instrumentButtons.length - 1);
        
        for(let y = 0; y < this.btns.length; y++) {
            for(let x = 0; x < this.btns[y].length; x++) {
                this.btns[y][x].x = this.sx + (x * (btnsize + this.btnGap));
                this.btns[y][x].y = this.sy + (y * (btnsize + this.btnGap));
                this.btns[y][x].width = this.btns[y][x].height = btnsize;
            }
        }
        
        let i = 0;
        for (i = 0; i < this.octaveBtns.length; i++) {
            this.octaveBtns[i].x = this.sx - oBtnSize - this.btnGap * 2;
            this.octaveBtns[i].y = this.sy + (i * (oBtnSize + this.btnGap));
            this.octaveBtns[i].width = this.octaveBtns[i].height = oBtnSize;
        }
        for (i = 0; i < this.instrumentButtons.length; i++) {
            this.instrumentButtons[i].x = this.sx + this.bwidth / 2 + (i * (oBtnSize + this.btnGap)) - iBtnsSize/2;
            this.instrumentButtons[i].y = this.sy - oBtnSize - this.btnGap;
            this.instrumentButtons[i].width = this.instrumentButtons[i].height = oBtnSize;
        }
    }

    getButton(mx,my) {
        if(typeof mx === "string") {
            mx = mx.toLowerCase();
            for(let y = 0; y < this.btns.length; y++) {
                for(let x = 0; x < this.btns[y].length; x++) {
                    if(this.btns[y][x].text == mx) return this.btns[y][x];
                }
            }
            for (let y = 0; y < this.octaveBtns.length; y++) {
                if(this.octaveBtns[y].text == mx) return this.octaveBtns[y];
            }
            for (let y = 0; y < this.instrumentButtons.length; y++) {
                if(this.instrumentButtons[y].text == mx) return this.instrumentButtons[y];
            }
        } else if(typeof mx === "number") {
            for(let y = 0; y < this.btns.length; y++) {
                for(let x = 0; x < this.btns[y].length; x++) {
                    if(this.btns[y][x].doIHas(mx,my)) return this.btns[y][x];
                }
            }
            for (let y = 0; y < this.octaveBtns.length; y++) {
                if(this.octaveBtns[y].doIHas(mx,my)) return this.octaveBtns[y];
            }
            for (let y = 0; y < this.instrumentButtons.length; y++) {
                if(this.instrumentButtons[y].doIHas(mx, my)) return this.instrumentButtons[y];
            }
        }
        
        return null;
    }

    draw() {
        //draw
        push();
        for(let y = 0; y < this.btns.length; y++) {
            for(let x = 0; x < this.btns[y].length; x++) {
                this.btns[y][x].draw();
            }
        }
        let i = 0;
        for (i = 0; i < this.octaveBtns.length; i++) {
            this.octaveBtns[i].draw();
        }
        for (i = 0; i < this.instrumentButtons.length; i++) {
            this.instrumentButtons[i].draw();
        }
        pop();
    }

    setOctave(octBtn) {
        for(let i = 0; i < this.octaveBtns.length; i++) {
            if(this.octaveBtns[i].toggled && this.octaveBtns[i] != octBtn) this.octaveBtns[i].toggleOff();
        }
        this.octave = octBtn.octShift;
        let btn;
        for(let y = 0; y < this.btns.length; y++) {
            for(let x = 0; x < this.btns[y].length; x++) {
                btn = this.btns[y][x];
                btn.sound.freq(midiToFreq(60 + btn.index + this.octave * 12));
                this.btns[y][x] = btn;
            }
        }
    }

    setInstrument(inst) {
        for(let i = 0; i < this.instrumentButtons.length; i++) {
            if(this.instrumentButtons[i].toggled && this.instrumentButtons[i] != inst) this.instrumentButtons[i].toggleOff();
        }
        this.instrument = inst.instrument;
        
        for(let y = 0; y < this.btns.length; y++) {
            for(let x = 0; x < this.btns[y].length; x++) {
                this.btns[y][x].setInstrument(this.instrument);
            }
        }
    }

    loopThroughTouches(touches) {
        let touchCount = touches.length;
        let hitCount = 0;
        for(let y = 0; y < this.btns.length; y++) {
            for(let x = 0; x < this.btns[y].length; x++) {
                if(touchCount && touchCount > hitCount) {
                    for(let i = 0; i < touchCount; i++) {
                        let hit = this.btns[y][x].doIHas(touches[i]);
                        if(hit) {
                            hitCount++;
                            this.btns[y][x].onPressed(this);
                            break;
                        } else {
                            this.btns[y][x].onReleased(this);
                        }
                    }
                } else {
                    this.btns[y][x].onReleased();
                }
            }
        }
        if(hitCount < touchCount) {
            let hit;
            for(let y = 0; y < this.octaveBtns.length; y++) {
                for (let i = 0; i < touches.length; i++) {
                    hit = this.octaveBtns[y].doIHas(touches[i]);
                    if(hit) {
                        this.octaveBtns[y].onPressed(this);
                        break;
                    }
                }
                if(hit) break;
            }
        }
    }
}