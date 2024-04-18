const ProcessManager = (function () {
  function drawChecker(size) {
    noStroke();
    rectMode(CORNER);
    for (let i = 0; i < Math.ceil(width / size); i++) {
      for (let j = 0; j < Math.ceil(height / size); j++) {
        if (j % 2 === 0) {
          if (i % 2 === 0) {
            fill(checkerCol1.p5Color);
          } else {
            fill(checkerCol2.p5Color);
          }
        } else {
          if (i % 2 === 0) {
            fill(checkerCol2.p5Color);
          } else {
            fill(checkerCol1.p5Color);
          }
        }
        rect(i * size, j * size, size, size);
      }
    }
  }

  let state = 'nothing';

  const maxFPS = 60;

  const debugStates = true;

  const bgColsRGB = new sRGB(28 / 255, 28 / 255, 28 / 255);

  let checkerCol1, checkerCol2;

  return {
    changeState(s) {
      state = s;

      if (debugStates) console.log('State Change: ' + s);
    },

    setup() {
      OkLab.initialise();
      ColourPicker.setup();

      checkerCol1 = OkLab.sRGBtoOkLab(bgColsRGB.copy());
      let temp = checkerCol1.copy();
      temp.scalar(1 / 2);
      temp.rgbClamp();

      checkerCol2 = temp.copy();

      // console.log(OkLab.OkLabtosRGB(temp));
      // console.log(checkerCol1);
      // console.log(checkerCol2);
    },

    draw(dt) {
      background(checkerCol1.p5Color);
      drawChecker(10);

      ColourPicker.draw();
    },

    touchStarted() {
      ColourPicker.touchStarted();
    },
    touchMoved() {
      ColourPicker.touchMoved();
    },
    touchEnded() {
      ColourPicker.touchEnded();
    }
  }
})()