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
      },
      size: {
        w: 50, h: 50
      },
      pos: {
        x: 70, y: 10
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
          x = map(this.chosen.x, -0.32, 0.2, min.x, max.x);
          y = map(this.chosen.y, 0, 1, max.y, min.y);
        } else if (slider.sliderMode === 'b') {
          x = map(this.chosen.x, -0.24, 0.28, min.x, max.x);
          y = map(this.chosen.y, 0, 1, max.y, min.y);
        } else {
          x = map(this.chosen.x, -0.24, 0.28, min.x, max.x);
          y = map(this.chosen.y, -0.32, 0.2, max.y, min.y);
        }
        ellipseMode(CENTER);
        fill(chosenColour.p5Color);
        stroke(outlineCol.p5Color);
        circle(x, y, 15);
      },

      draw(x, y) {
        // draw colours
        const min = {
          x: this.pos.x,
          y: this.pos.y
        };
        const max = {
          x: min.x + this.size.w,
          y: min.y + this.size.h,
        }
        if (x >= min.x && x < max.x && y >= min.y && y < max.y) {
          const index = GetIndex(x, y);
          let l, a, b;

          if (slider.sliderMode === 'a') {
            a = slider.chosen;

            b = map(x, min.x, max.x, -0.32, 0.2);
            l = map(y, max.y, min.y, 0, 1);
          } else if (slider.sliderMode === 'b') {
            b = slider.chosen;

            a = map(x, min.x, max.x, -0.24, 0.28);
            l = map(y, max.y, min.y, 0, 1);
          } else {
            l = slider.chosen;

            a = map(x, min.x, max.x, -0.24, 0.28);
            b = map(y, max.y, min.y, -0.32, 0.2);
          }

          let srgb = OkLab.OkLabtosRGB(new OkLab(l, a, b));
          // if (srgb.isOutsideRGB) {
          //   pixels[index + 3] = 28;
          // } else {
          //   pixels[index + 3] = 255;
          // }
          srgb.clamp();
          pixels[index + 0] = srgb.red * 255;
          pixels[index + 1] = srgb.green * 255;
          pixels[index + 2] = srgb.blue * 255;
        }
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
        circle(35, this.chosenPos, 15);
      },

      draw(x, y) {
        // draw slider
        if (x >= 10 && x < 60 && y >= 10 && y < height - 70) {
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

          const index = GetIndex(x, y);

          // if (yCol.isOutsideRGB) {
          //   pixels[index + 3] = 28;
          // } else {
          //   pixels[index + 3] = 255;
          // }
          yCol.clamp();

          pixels[index + 0] = yCol.red * 255;
          pixels[index + 1] = yCol.green * 255;
          pixels[index + 2] = yCol.blue * 255;
        }
      }
    }
  })();

  return {
    setup() {
      loop();
      outlineCol = OkLab.sRGBtoOkLab(new sRGB(28 / 255, 28 / 255, 28 / 255));
      outlineCol.l *= 2;

      slider.size.h = height - 80;

      box.size.w = slider.size.h;
      box.size.h = slider.size.h;

      chosenColour = OkLab.sRGBtoOkLab(new sRGB(1, 0, 0));
      // chosenColour.l = 0.5;
      chosenColour.rgbClamp();
      console.log(chosenColour);

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

        chosenColour.b = map(y, height - 70, 10, sliderMin, sliderMax);

        slider.chosen = chosenColour.b;
        slider.chosenPos = map(chosenColour.b, sliderMin, sliderMax, height - 70, 10);
      } else {
        sliderMin = 0;
        sliderMax = 1;

        slider.chosen = chosenColour.l;
        slider.chosenPos = map(chosenColour.l, sliderMin, sliderMax, height - 70, 10);

        box.chosen.x = chosenColour.a;
        box.chosen.y = chosenColour.b;
      }
    },

    draw() {
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

      loadPixels();
      for (let x = 10; x < width - 10; x++) {
        for (let y = 0; y < height - 10; y++) {
          slider.draw(x, y);
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
      circle(10, height - 60, 50);
    },

    touchStarted() {
      let x = mouseX;
      let y = mouseY;

      if (x >= 10 && x < 60 && y >= 10 && y <= height - 70) {
        touching = true;
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

        chosenColour.rgbClamp();
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