const MainManager = (function () {
  return {
    canvas: 0,

    preload() {
      DOMManager.preload();
    },

    setup() {
      pixelDensity(1);

      const size = Math.max(Math.min(800, windowWidth, windowHeight), 200);

      this.canvas = createCanvas(size, size);
      this.canvas.position(0, 0);

      ProcessManager.setup();
    },

    draw(dt) {
      ProcessManager.draw(dt);
    }
  }
})();