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
      // ----- TEST -----
      if (false) {
        let mat = new Matrix([1, 2, 1, 0, 1, 0, 2, 3, 4], 3, 3);
        console.log("mult mat", mat);

        let invert = mat.copy();
        invert.invert3x3();
        console.log("inverted", invert);

        let rhs = new Matrix([2, 5, 6, 7, 1, 8], 2, 3);
        console.log("rhs", rhs);

        let rhsMult = mat.copy();
        rhsMult.mult(rhs);
        console.log("rhs multiplied", rhsMult);

        let rhsInvertMult = invert.copy();
        rhsInvertMult.mult(rhsMult);
        console.log("back multiplied", rhsInvertMult);
      }

      // ----- MAIN -----

      noLoop();
      OkLab.initialise();
      ColourPicker.setup();

      checkerCol1 = OkLab.sRGBtoOkLab(bgColsRGB.copy());
      let temp = checkerCol1.copy();
      temp.scalar(1 / 2);
      temp.rgbClamp();

      checkerCol2 = temp.copy();

      // console.log(OkLab.OkLabtosRGB(temp));
      console.log('First Background Col', checkerCol1);
      console.log('Second Background Col', checkerCol2);
    },

    draw(dt) {
      background(28);
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