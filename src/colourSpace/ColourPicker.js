const ColourPicker = (function () {
  function GetIndex(x, y) {
    return Math.floor((x + y * width) * 4);
  };

  let chosenColour;
  let sliderMin, sliderMax;
  let outlineCol;

  let touching = false;
  let touched = 'nothing';

  const box = (function () {
    return {
      chosen: {
        x: 0,
        y: 0,
      }
    }
  })();

  const slider = (function () {
    return {
      size: {
        w: 50, h: 50
      },
      pos: {
        x: 10, y: 10
      },
      sliderMode: 'l',
      chosen: 0,
      chosenPos: 0,

      draw() {
        // draw slider
        loadPixels();
        for (let y = 10; y < height - 70; y++) {
          let yT = map(y, height - 70, 10, 0, 1);

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
          yCol = OkLab.OkLabtosRGB(yCol);

          for (let x = 10; x < 60; x++) {
            const index = GetIndex(x, y);

            pixels[index + 0] = yCol.red * 255;
            pixels[index + 1] = yCol.green * 255;
            pixels[index + 2] = yCol.blue * 255;
          }
        }
        updatePixels();

        // draw outline
        rectMode(CORNER);
        noFill();
        stroke(outlineCol.p5Color);
        rect(this.pos.x, this.pos.y, this.size.w, this.size.h);

        // draw picker
        ellipseMode(CENTER);
        fill(chosenColour.p5Color);
        stroke(outlineCol.p5Color);
        circle(35, this.chosenPos, 15);
      }
    }
  })();

  return {
    setup() {
      outlineCol = OkLab.sRGBtoOkLab(new sRGB(28 / 255, 28 / 255, 28 / 255));
      outlineCol.l *= 2;

      slider.size.h = height - 80;

      chosenColour = OkLab.sRGBtoOkLab(new sRGB(0, 1, 0));
      console.log(chosenColour);

      slider.sliderMode = 'l';

      if (slider.sliderMode === 'a') {
        sliderMin = -0.24;
        sliderMax = 0.28;
      } else if (slider.sliderMode === 'b') {
        sliderMin = -0.32;
        sliderMax = 0.2;
      } else {
        sliderMin = 0;
        sliderMax = 1;
      }
    },

    draw() {
      // chosenColour.rgbClamp();
      if (slider.sliderMode === 'a') {
        slider.chosen = chosenColour.a;
        slider.chosenPos = map(chosenColour.a, sliderMin, sliderMax, height - 70, 10);

        box.chosen.x = chosenColour.b;
        box.chosen.y = chosenColour.l;
      } else if (slider.sliderMode === 'b') {
        slider.chosen = chosenColour.b;
        slider.chosenPos = map(chosenColour.b, sliderMin, sliderMax, height - 70, 10);

        box.chosen.x = chosenColour.a;
        box.chosen.y = chosenColour.l;
      } else {
        slider.chosen = chosenColour.l;
        slider.chosenPos = map(chosenColour.l, sliderMin, sliderMax, height - 70, 10);

        box.chosen.x = chosenColour.a;
        box.chosen.y = chosenColour.b;
      }
      slider.chosenPos = Math.round(slider.chosenPos);

      slider.draw();

      // draw circle showing selected circle
      ellipseMode(CORNER);
      stroke(outlineCol.p5Color)
      fill(chosenColour.p5Color);
      circle(10, height - 60, 50);
    },

    touchStarted() {
      touching = true;

      let x = mouseX;
      let y = mouseY;

      if (x >= 10 && x < 60 && y >= 10 && y <= height - 70) {
        console.log('Touch inside slider');
        touched = 'slider';

        y = Math.max(Math.min(y, height - 70), 10);

        if (slider.sliderMode === 'a') {
          sliderMin = -0.24;
          sliderMax = 0.28;
          chosenColour.a = map(y, height - 70, 10, sliderMin, sliderMax);
        } else if (slider.sliderMode === 'b') {
          sliderMin = -0.32;
          sliderMax = 0.2;
          chosenColour.b = map(y, height - 70, 10, sliderMin, sliderMax);
        } else {
          sliderMin = 0;
          sliderMax = 1;
          chosenColour.l = map(y, height - 70, 10, sliderMin, sliderMax);
        }
      }
    },
    touchMoved() {
      let x = mouseX;
      let y = mouseY;
      if (touching) {
        if (touched === 'slider') {
          y = Math.max(Math.min(y, height - 70), 10);
          if (slider.sliderMode === 'a') {
            chosenColour.a = map(y, height - 70, 10, sliderMin, sliderMax);
          } else if (slider.sliderMode === 'b') {
            chosenColour.b = map(y, height - 70, 10, sliderMin, sliderMax);
          } else {
            chosenColour.l = map(y, height - 70, 10, sliderMin, sliderMax);
          }
        }
      }

    },
    touchEnded() {
      touching = false;
      touched = 'nothing';
    }
  }
})();