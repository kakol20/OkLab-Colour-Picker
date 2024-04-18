const ColourPicker = (function () {
  function GetIndex(x, y) {
    return Math.floor((x + y * width) * 4);
  };

  let chosenColour;

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
      outlineCol: 0,
      sliderMode: 'l',
      chosen: 0,
      chosenPos: 0,

      draw() {
        let min, max;
        if (this.sliderMode === 'a') {
          min = -0.3;
          max = 0.3;
        } else if (this.sliderMode === 'b') {
          min = -0.4;
          max = 0.2;
        } else {
          min = 0;
          max = 1;
        }

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
          t = map(yT, 0, 1, min, max);

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
        stroke(this.outlineCol.p5Color);
        rect(this.pos.x, this.pos.y, this.size.w, this.size.h);

        // draw picker
        ellipseMode(CENTER);
        fill(chosenColour.p5Color);
        stroke(this.outlineCol.p5Color);
        circle(35, this.chosenPos, 15);
      }
    }
  })();

  return {
    setup() {
      slider.size.h = height - 80;
      slider.outlineCol = OkLab.sRGBtoOkLab(new sRGB(28 / 255, 28 / 255, 28 / 255));
      slider.outlineCol.l *= 2;

      chosenColour = OkLab.sRGBtoOkLab(new sRGB(1, 0, 0));
      console.log(chosenColour);

      slider.sliderMode = 'l';
    },

    draw() {
      if (slider.sliderMode === 'a') {
        const min = -0.3;
        const max = 0.3;

        slider.chosen = chosenColour.a;
        slider.chosenPos = map(chosenColour.a, min, max, height - 70, 10);

        box.chosen.x = chosenColour.b;
        box.chosen.y = chosenColour.l;
      } else if (slider.sliderMode === 'b') {
        const min = -0.4;
        const max = 0.2;

        slider.chosen = chosenColour.b;
        slider.chosenPos = map(chosenColour.b, min, max, height - 70, 10);

        box.chosen.x = chosenColour.a;
        box.chosen.y = chosenColour.l;
      } else {
        const min = 0;
        const max = 1;

        slider.chosen = chosenColour.l;
        slider.chosenPos = map(chosenColour.l, min, max, height - 70, 10);

        box.chosen.x = chosenColour.a;
        box.chosen.y = chosenColour.b;
      }
      slider.chosenPos = Math.round(slider.chosenPos);

      slider.draw();
    }
  }
})();