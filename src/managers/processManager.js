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

  const checkerCol1 = new sRGB(28 / 255, 28 / 255, 28 / 255);
  let temp = checkerCol1.copy();
  temp.scalar(1 / 2);

  const checkerCol2 = temp.copy();

  // testing

  let temp1 = new Matrix([
    [1, 0, 2],
    [2, 1, 3],
    [1, 0, 4]
  ]);
  let rhs1 = new Matrix([
    [2, 6, 1],
    [5, 7, 8]
  ]);
  let result1 = temp1.copy();
  result1.mult(rhs1);

  console.log(temp1);
  console.log('times');
  console.log(rhs1);
  console.log('equals');
  console.log(result1);
  console.log('-----');

  let temp2 = temp1.copy();
  temp2.invert3x3();
  let result2 = temp2.copy();
  result2.mult(result1);

  console.log(temp2);
  console.log('times');
  console.log(result1);
  console.log('equals');
  console.log(result2);
  console.log('-----');

  return {
    changeState(s) {
      state = s;

      if (debugStates) console.log('State Change: ' + s);
    },

    setup() {

    },

    draw(dt) {
      background(0);
      drawChecker(10);
    }
  }
})()