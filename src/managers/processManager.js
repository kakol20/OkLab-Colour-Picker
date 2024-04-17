const ProcessManager = (function () {
  let state = 'nothing';

  const maxFPS = 60;

  const debugStates = true;

  return {
    changeState(s) {
      state = s;

      if (debugStates) console.log('State Change: ' + s);
    },

    setup() {

    },

    generatePalette() {
      // console.log('Button pressed');

      console.log('Start Color');
      console.log(DOMManager.startColorPicker.color());

      console.log('End Color');
      console.log(DOMManager.endColorPicker.color());
    },

    draw(dt) {
      switch (state) {
        default:
          // do nothing
          break;
      }
    }
  }
})()