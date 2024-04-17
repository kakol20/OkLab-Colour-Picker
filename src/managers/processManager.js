const ProcessManager = (function () {
  function drawChecker(size) {
    noStroke();
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

  const bgColsRGB = new sRGB(28 / 255, 28 / 255, 28 / 255)
  const checkerCol1 = OkLab.sRGBtoOkLab(bgColsRGB);
  let temp = checkerCol1.copy();
  temp.scalar(1 / 2);

  const checkerCol2 = temp.copy();

  return {
    changeState(s) {
      state = s;

      if (debugStates) console.log('State Change: ' + s);
    },

    setup() {
      OkLab.initialise();

    },

    draw(dt) {
      background(0);
      drawChecker(10);
    }
  }
})()