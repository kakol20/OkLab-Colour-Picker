class sRGB {
  constructor(r = 0, g = 0, b = 0) {
    this.red = r;
    this.green = g;
    this.blue = b;
  }

  get p5Color() {
    return color(this.red * 255, this.green * 255, this.blue * 255);
  }
  
  get isOutsideRGB() {
    const max = 1;
    const min = 0;

    return this.red > max || this.red < min || 
      this.green > max || this.green < min || 
      this.blue > max || this.blue < min;
  }

  clamp() {
    this.red = this.red > 1 ? 1 : this.red;
    this.green = this.green > 1 ? 1 : this.green;
    this.blue = this.blue > 1 ? 1 : this.blue;

    this.red = this.red < 0 ? 0 : this.red;
    this.green = this.green < 0 ? 0 : this.green;
    this.blue = this.blue < 0 ? 0 : this.blue;
  }

  scalar(s) {
    this.red *= s;
    this.green *= s;
    this.blue *= s;
  }

  copy() {
    return new sRGB(this.red, this.green, this.blue);
  }
}

class OkLab {
  constructor(l = 0, a = 0, b = 0) {
    this.l = l;
    this.a = a;
    this.b = b;
  }

  get p5Color() {
    let out = OkLab.OkLabtosRGB(this.copy());
    out.clamp();
    return out.p5Color;
  }

  get isOutsideRGB() {
    let rgb = OkLab.OkLabtosRGB(this.copy());
    return rgb.isOutsideRGB;
  }

  scalar(s) {
    this.l *= s;
    this.a *= s;
    this.b *= s;
  }

  copy() {
    return new OkLab(this.l, this.a, this.b);
  }

  rgbClamp() {
    let rgb = OkLab.OkLabtosRGB(this.copy());
    rgb.clamp();
    // console.log(rgb);
    let lab = OkLab.sRGBtoOkLab(rgb.copy());
    this.l = lab.l;
    this.a = lab.a;
    this.b = lab.b;
  }

  static #LinearRGBtoXYZ = new Matrix([
    [0.4124564, 0.2126729, 0.0193339],
    [0.3575761, 0.7151522, 0.1191920],
    [0.1804375, 0.0721750, 0.9503041]
  ]);
  static #XYZtoLinearRGB = OkLab.#LinearRGBtoXYZ.copy();

  static #XYZtoLinearLMS = new Matrix([
    [0.8189330101, 0.0329845436, 0.0482003018],
    [0.3618667424, 0.9293118715, 0.2643662691],
    [-0.1288597137, 0.0361456387, 0.6338517070]
  ]);
  static #LinearLMStoXYZ = OkLab.#XYZtoLinearLMS.copy();

  static #LMStoLab = new Matrix([
    [0.2104542553, 1.9779984951, 0.0259040371],
    [0.7936177850, -2.4285922050, 0.7827717662],
    [-0.0040720468, 0.4505937099, -0.8086757660]
  ]);
  static #LabtoLMS = OkLab.#LMStoLab.copy();

  static initialise() {
    OkLab.#XYZtoLinearRGB.invert3x3();
    OkLab.#LinearLMStoXYZ.invert3x3();
    OkLab.#LabtoLMS.invert3x3();
  }

  static sRGBtoOkLab(srgb) {
    let val = new Matrix([[srgb.red, srgb.green, srgb.blue]]);

    // to Linear RGB
    // for (let i = 0; i < 3; i++) {
    //   if (val.mat[0][i] <= 0.04045) {
    //     val.mat[0][i] /= 12.92;
    //   } else {
    //     val.mat[0][i] = Math.pow((val.mat[0][i] + 0.055) / 1.055, 2.4);
    //   }
    // }
    val.pow(2.2);

    // to CIE XYZ
    let temp = val.copy();
    val = this.#LinearRGBtoXYZ.copy();
    val.mult(temp);

    // to Linear LMS
    temp = val.copy();
    val = this.#XYZtoLinearLMS.copy();
    val.mult(temp);

    // to LMS
    val.cbrt();

    // to OkLab
    temp = val.copy();
    val = this.#LMStoLab.copy();
    val.mult(temp);

    return new OkLab(val.mat[0][0], val.mat[0][1], val.mat[0][2]);
  }

  static OkLabtosRGB(lab) {
    let val = new Matrix([[lab.l, lab.a, lab.b]]);

    // to LMS
    let temp = val.copy();
    val = this.#LabtoLMS.copy();
    val.mult(temp);

    // to Linear LMS
    val.pow(3);

    // to CIE XYZ
    temp = val.copy();
    val = this.#LinearLMStoXYZ.copy();
    val.mult(temp);

    // to Linear RGB
    temp = val.copy();
    val = this.#XYZtoLinearRGB.copy();
    val.mult(temp);

    // to sRGB
    // const exp = 1. / 2.4;
    // for (let i = 0; i < 3; i++) {
    //   if (val.mat[0][i] <= 0.0031308) {
    //     val.mat[0][i] *= 12.92;
    //   } else {
    //     let absroot = Math.pow(Math.abs(val.mat[0][i]), exp);
    //     if (val.mat[0][i] < 0.) absroot *= -1;
    //     val.mat[0][i] = absroot;

    //     val.mat[0][i] = (1.055 * val.mat[0][i]) - 0.055;
    //   }
    // }
    val.nroot(2.2);

    return new sRGB(val.mat[0][0], val.mat[0][1], val.mat[0][2]);
  }
}