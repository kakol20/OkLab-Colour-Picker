const DOMManager = (function () {
  let colorCountText;

  return {
    startColorPicker: 0, endColorPicker: 0, spaceSelect: 0,

    colorCount: 0, generatePaletteButton: 0,

    domHeight: 0,

    preload() {
      this.startColorPicker = createColorPicker('deeppink');
      this.startColorPicker.position(10, 10);
      this.startColorPicker.size(50, 50);

      this.endColorPicker = createColorPicker('royalblue');
      this.endColorPicker.position(70, 10);
      this.endColorPicker.size(50, 50);

      this.spaceSelect = createSelect();
      this.spaceSelect.position(10, 70);
      this.spaceSelect.option('sRGB');
      this.spaceSelect.option('Linear RGB');

      this.spaceSelect.selected('sRGB');
      this.spaceSelect.disable('Linear RGB');

      this.domHeight = 70 + this.spaceSelect.height + 10;

      colorCountText = createSpan(' Count: ');
      colorCountText.position(10, this.domHeight + 2);

      this.colorCount = createInput(5, 'number');
      this.colorCount.size(50, 20);
      this.colorCount.position(colorCountText.width + 20, this.domHeight);

      this.domHeight += this.colorCount.height + 10;

      this.generatePaletteButton = createButton('Generate');
      this.generatePaletteButton.position(10, this.domHeight);
      this.generatePaletteButton.mousePressed(ProcessManager.generatePalette);

      this.domHeight += this.generatePaletteButton.height + 10;
    },
  }
})()