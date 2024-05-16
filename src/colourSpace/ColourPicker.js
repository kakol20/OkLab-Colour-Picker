const ColourPicker = (function () {
  function GetIndex(x, y) {
    return Math.floor((x + y * width) * 4);
  };

  let chosenColour;
  let sliderMin, sliderMax;
  let outlineCol;

  let touching = false;
  let touched = 'nothing';

  const referenceSize = 40;

  const aValue = {
    min: -0.24,
    max: 0.28
  };
  const bValue = {
    min: -0.32,
    max: 0.2
  };

  const box = (function () {
    return {
      chosen: {
        x: 0,
        y: 0,
      },
      size: {
        w: referenceSize, h: referenceSize
      },
      pos: {
        x: referenceSize + 20, y: 10
      },

      min: {
        x: 0,
        y: 0
      },
      max: {
        x: 0,
        y: 0,
      },

      drawOther() {
        // draw outline
        rectMode(CORNER);
        noFill();
        stroke(outlineCol.p5Color);
        rect(this.pos.x, this.pos.y, this.size.w, this.size.h);

        // draw picker
        const min = {
          x: this.pos.x,
          y: this.pos.y
        };
        const max = {
          x: min.x + this.size.w,
          y: min.y + this.size.h,
        }

        let x, y;
        if (slider.sliderMode === 'a') {
          x = map(this.chosen.x, bValue.min, bValue.max, min.x, max.x);
          y = map(this.chosen.y, 0, 1, max.y, min.y);
        } else if (slider.sliderMode === 'b') {
          x = map(this.chosen.x, aValue.min, aValue.max, min.x, max.x);
          y = map(this.chosen.y, 0, 1, max.y, min.y);
        } else {
          x = map(this.chosen.x, aValue.min, aValue.max, min.x, max.x);
          y = map(this.chosen.y, bValue.min, bValue.max, max.y, min.y);
        }
        ellipseMode(CENTER);
        fill(chosenColour.p5Color);
        stroke(outlineCol.p5Color);
        circle(x, y, 15);
      },

      draw(x, y) {
        // draw colours
        const index = GetIndex(x, y);
        let l, a, b;

        if (slider.sliderMode === 'a') {
          a = slider.chosen;

          b = map(x, this.min.x, this.max.x, bValue.min, bValue.max);
          l = map(y, this.max.y, this.min.y, 0, 1);
        } else if (slider.sliderMode === 'b') {
          b = slider.chosen;

          a = map(x, this.min.x, this.max.x, aValue.min, aValue.max);
          l = map(y, this.max.y, this.min.y, 0, 1);
        } else {
          l = slider.chosen;

          a = map(x, this.min.x, this.max.x, aValue.min, aValue.max);
          b = map(y, this.max.y, this.min.y, bValue.min, bValue.max);
        }

        let fg = new OkLab(l, a, b);
        let bg = OkLab.sRGBtoOkLab(new sRGB(pixels[index + 0] / 255, pixels[index + 1] / 255, pixels[index + 2] / 255));

        let alpha = fg.isOutsideRGB ? 0.5 : 1;

        // let srgb = OkLab.OkLabtosRGB(OkLab.alphaOver(fg, bg, alpha));
        let srgb = OkLab.OkLabtosRGB(OkLab.lerp(bg, fg, alpha));
        srgb.clamp();
        pixels[index + 0] = srgb.red * 255;
        pixels[index + 1] = srgb.green * 255;
        pixels[index + 2] = srgb.blue * 255;
      }
    }
  })();

  const slider = (function () {
    return {
      size: {
        w: referenceSize, h: referenceSize
      },
      pos: {
        x: 10, y: 10
      },
      sliderMode: 'l',
      chosen: 0,
      chosenPos: 0,

      drawOther() {
        // draw outline
        rectMode(CORNER);
        noFill();
        stroke(outlineCol.p5Color);
        rect(this.pos.x, this.pos.y, this.size.w, this.size.h);

        // draw picker
        ellipseMode(CENTER);
        fill(chosenColour.p5Color);
        stroke(outlineCol.p5Color);
        circle(10 + (referenceSize / 2), this.chosenPos, 15);
      },

      draw(x, y) {
        // draw slider
        let yT = map(y, height - (referenceSize + 20), 10, 0, 1);

        let t = 0;
        if (this.sliderMode === 'a') {
          t = chosenColour.a;
        } else if (this.sliderMode === 'b') {
          t = chosenColour.b;
        } else {
          t = chosenColour.l;
        }
        t = map(yT, 0, 1, sliderMin, sliderMax);

        let yCol;
        if (this.sliderMode === 'a') {
          yCol = new OkLab(box.chosen.y, t, box.chosen.x);
        } else if (this.sliderMode === 'b') {
          yCol = new OkLab(box.chosen.y, box.chosen.x, t);
        } else {
          yCol = new OkLab(t, box.chosen.x, box.chosen.y);
        }

        const index = GetIndex(x, y);

        let srgb = OkLab.OkLabtosRGB(yCol);
        srgb.clamp();
        pixels[index + 0] = srgb.red * 255;
        pixels[index + 1] = srgb.green * 255;
        pixels[index + 2] = srgb.blue * 255;
      }
    }
  })();

  return {
    consoleLog() {
      console.log('chosenColour', chosenColour);
      console.log('chosenColour.isOutsideRGB', chosenColour.isOutsideRGB);
    },
    setup() {
      loop();
      outlineCol = OkLab.sRGBtoOkLab(new sRGB(28 / 255, 28 / 255, 28 / 255));
      outlineCol.l *= 2;

      slider.size.h = height - (referenceSize + 30);

      box.size.w = slider.size.h;
      box.size.h = slider.size.h;

      box.min = {
        x: box.pos.x,
        y: box.pos.y
      };
      box.max = {
        x: box.min.x + box.size.w,
        y: box.min.y + box.size.h
      };

      const black = new OkLab(0, 0, 0);

      chosenColour = OkLab.sRGBtoOkLab(new sRGB(0.5, 0.5, 0.5));
      // chosenColour = new OkLab(0.5, 0, 0);
      // chosenColour.l = 0.5;
      chosenColour.rgbClamp();

      let srgb = OkLab.OkLabtosRGB(chosenColour);

      console.log('Starting Colour', chosenColour);
      console.log('Starting Colour RGB', srgb);

      slider.sliderMode = 'l';

      if (slider.sliderMode === 'a') {
        sliderMin = -0.24;
        sliderMax = 0.28;

        slider.chosen = chosenColour.a;
        slider.chosenPos = map(chosenColour.a, sliderMin, sliderMax, height - 70, 10);

        box.chosen.x = chosenColour.b;
        box.chosen.y = chosenColour.l;
      } else if (slider.sliderMode === 'b') {
        sliderMin = -0.32;
        sliderMax = 0.2;

        slider.chosen = chosenColour.b;
        slider.chosenPos = map(chosenColour.b, sliderMin, sliderMax, height - (referenceSize + 20), 10);
      } else {
        sliderMin = 0;
        sliderMax = 1;

        slider.chosen = chosenColour.l;
        slider.chosenPos = map(chosenColour.l, sliderMin, sliderMax, height - (referenceSize + 20), 10);

        box.chosen.x = chosenColour.a;
        box.chosen.y = chosenColour.b;
      }
    },

    draw() {
      if (slider.sliderMode === 'a') {
        slider.chosen = chosenColour.a;
        slider.chosenPos = map(chosenColour.a, sliderMin, sliderMax, height - (referenceSize + 20), 10);

        box.chosen.x = chosenColour.b;
        box.chosen.y = chosenColour.l;
      } else if (slider.sliderMode === 'b') {
        slider.chosen = chosenColour.b;
        slider.chosenPos = map(chosenColour.b, sliderMin, sliderMax, height - (referenceSize + 20), 10);

        box.chosen.x = chosenColour.a;
        box.chosen.y = chosenColour.l;
      } else {
        slider.chosen = chosenColour.l;
        slider.chosenPos = map(chosenColour.l, sliderMin, sliderMax, height - (referenceSize + 20), 10);

        box.chosen.x = chosenColour.a;
        box.chosen.y = chosenColour.b;
      }

      loadPixels();
      for (let x = 10; x < referenceSize + 10; x++) {
        for (let y = 10; y < height - referenceSize - 20; y++) {
          slider.draw(x, y);
        }
      }
      for (let x = box.min.x; x < box.max.x; x++) {
        for (let y = box.min.y; y < box.max.y; y++) {
          box.draw(x, y);
        }
      }
      updatePixels();

      // slider.draw();
      // box.draw();

      slider.drawOther();
      box.drawOther();

      // draw circle showing selected circle
      ellipseMode(CORNER);
      stroke(outlineCol.p5Color)
      fill(chosenColour.p5Color);
      circle(10, height - (referenceSize + 10), referenceSize);
    },

    touchStarted() {
      let x = mouseX;
      let y = mouseY;

      if (x >= 10 && x < (referenceSize + 10) && y >= 10 && y <= height - (referenceSize + 20)) {
        touching = true;
        console.log('Touch inside slider');
        touched = 'slider';

        y = Math.max(Math.min(y, height - (referenceSize + 20)), 10);

        if (slider.sliderMode === 'a') {
          sliderMin = aValue.min;
          sliderMax = aValue.max;
          chosenColour.a = map(y, height - (referenceSize + 20), 10, sliderMin, sliderMax);
        } else if (slider.sliderMode === 'b') {
          sliderMin = bValue.min;
          sliderMax = bValue.max;
          chosenColour.b = map(y, height - (referenceSize + 20), 10, sliderMin, sliderMax);
        } else {
          sliderMin = 0;
          sliderMax = 1;
          chosenColour.l = map(y, height - (referenceSize + 20), 10, sliderMin, sliderMax);
        }

        chosenColour.rgbClamp();
      }
      else if (x >= (referenceSize + 20) && x <= width - 10 && y >= 10 && y <= height - (referenceSize + 20)) {
        touching = true;
        console.log('Touch inside box');
        touched = 'box';
        x = Math.max(Math.min(x, width - 10), 10);
        y = Math.max(Math.min(y, height - (referenceSize + 20)), 10);

        if (slider.sliderMode === 'a') {
          chosenColour.b = map(x, (referenceSize + 20), width - 10, bValue.min, bValue.max);
          chosenColour.l = map(y, height - (referenceSize + 20), 10, 0, 1);
        } else if (slider.sliderMode === 'b') {
          chosenColour.a = map(x, (referenceSize + 20), width - 10, aValue.min, aValue.max);
          chosenColour.l = map(y, height - (referenceSize + 20), 10, 0, 1);
        } else {
          chosenColour.a = map(x, (referenceSize + 20), width - 10, aValue.min, aValue.max);
          chosenColour.b = map(y, height - (referenceSize + 20), 10, bValue.min, bValue.max);
        }

        chosenColour.rgbClamp();
      }
    },
    touchMoved() {
      let x = mouseX;
      let y = mouseY;
      if (touching) {
        if (touched === 'slider') {
          y = Math.max(Math.min(y, height - (referenceSize + 20)), 10);
          if (slider.sliderMode === 'a') {
            chosenColour.a = map(y, height - (referenceSize + 20), 10, sliderMin, sliderMax);
          } else if (slider.sliderMode === 'b') {
            chosenColour.b = map(y, height - (referenceSize + 20), 10, sliderMin, sliderMax);
          } else {
            chosenColour.l = map(y, height - (referenceSize + 20), 10, sliderMin, sliderMax);
          }

          chosenColour.rgbClamp();
        } else if (touched === 'box') {
          x = Math.max(Math.min(x, width - 10), 10);
          y = Math.max(Math.min(y, height - (referenceSize + 20)), 10);

          if (slider.sliderMode === 'a') {
            chosenColour.b = map(x, (referenceSize + 20), width - 10, bValue.min, bValue.max);
            chosenColour.l = map(y, height - (referenceSize + 20), 10, 0, 1);
          } else if (slider.sliderMode === 'b') {
            chosenColour.a = map(x, (referenceSize + 20), width - 10, aValue.min, aValue.max);
            chosenColour.l = map(y, height - (referenceSize + 20), 10, 0, 1);
          } else {
            chosenColour.a = map(x, (referenceSize + 20), width - 10, aValue.min, aValue.max);
            chosenColour.b = map(y, height - (referenceSize + 20), 10, bValue.min, bValue.max);
          }

          chosenColour.rgbClamp();
        }
      }

    },
    touchEnded() {
      touching = false;
      touched = 'nothing';
    }
  }
})();