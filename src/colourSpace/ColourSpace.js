function lerp(a, b, t) {
  return ((b - a) * t) + a;
}

class sRGB {
  constructor(r = 0, g = 0, b = 0) {
    this.red = r;
    this.green = g;
    this.blue = b;
  }

  get p5Color() {
    const red = Math.min(Math.max(Math.round(this.red * 255), 0), 255);
    const green = Math.min(Math.max(Math.round(this.green * 255), 0), 255);
    const blue = Math.min(Math.max(Math.round(this.blue * 255), 0), 255);
    return color(red, green, blue);
  }

  get isOutsideRGB() {
    const max = 255;
    const min = 0;

    let red = Math.round(this.red * 255);
    let green = Math.round(this.green * 255);
    let blue = Math.round(this.blue * 255);

    return red > max || red < min ||
      green > max || green < min ||
      blue > max || blue < min;
  }

  clamp() {
    this.red = Math.max(Math.min(this.red, 1), 0);
    this.green = Math.max(Math.min(this.green, 1), 0);
    this.blue = Math.max(Math.min(this.blue, 1), 0);
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
    return out.p5Color;
  }

  get isOutsideRGB() {
    let rgb = OkLab.OkLabtosRGB(this.copy());
    return rgb.isOutsideRGB;
  }

  static white = new OkLab(1, 0, 0);
  static black = new OkLab(0, 0, 0);

  static alphaOver(fg, bg, a) {
    return new OkLab((fg.l * a) + (bg.l * (1 - a)), (fg.a * a) + (bg.a * (1 - a)), (fg.b * a) + (bg.b * (1 - a)))
  }

  static lerp(a, b, t) {
    return new OkLab(lerp(a.l, b.l, t), lerp(a.a, b.a, t), lerp(a.b, b.b, t))
  }

  dynamicLightness(l) {
    if (this.l > l) {
      this.a = lerp()
    } else {

    }
    this.l = l;
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
    let lab = OkLab.sRGBtoOkLab(rgb);
    this.l = lab.l;
    this.a = lab.a;
    this.b = lab.b;
  }

  static #LinearRGBtoXYZ = new Matrix([
    0.4124564, 0.3575761, 0.1804375,
    0.2126729, 0.7151522, 0.0721750,
    0.0193339, 0.1191920, 0.9503041
  ], 3, 3);
  static #XYZtoLinearRGB = OkLab.#LinearRGBtoXYZ.copy();

  static #XYZtoLinearLMS = new Matrix([
    0.8189330101, 0.3618667424, -0.1288597137,
    0.0329845436, 0.9293118715, 0.0361456387,
    0.0482003018, 0.2643662691, 0.6338517070
  ], 3, 3);
  static #LinearLMStoXYZ = OkLab.#XYZtoLinearLMS.copy();

  static #LMStoLab = new Matrix([
    0.2104542553, 0.7936177850, -0.0040720468,
    1.9779984951, -2.4285922050, 0.4505937099,
    0.0259040371, 0.7827717662, -0.8086757660
  ], 3, 3);
  static #LabtoLMS = OkLab.#LMStoLab.copy();

  static #LinearRGBtoLinearLMS = OkLab.#XYZtoLinearLMS.copy();
  static #LinearLMStoLinearRGB = OkLab.#LinearRGBtoLinearLMS.copy();

  static initialise() {
    // XYZtoLinearLMS * (LinearRGBtoXYZ * lrgb)
    OkLab.#LinearRGBtoLinearLMS.mult(OkLab.#LinearRGBtoXYZ);

    OkLab.#XYZtoLinearRGB.invert3x3();
    OkLab.#LinearLMStoXYZ.invert3x3();
    OkLab.#LabtoLMS.invert3x3();

    console.log('XYZtoLinearRGB', OkLab.#XYZtoLinearRGB);
    console.log('LinearLMStoXYZ', OkLab.#LinearLMStoXYZ);
    console.log('LabtoLMS', OkLab.#LabtoLMS);

    OkLab.#LinearLMStoLinearRGB = OkLab.#LinearRGBtoLinearLMS.copy();
    OkLab.#LinearLMStoLinearRGB.invert3x3();
  }

  static sRGBtoOkLab(srgb) {
    let val = new Matrix([srgb.red, srgb.green, srgb.blue], 1, 3);

    // to Linear RGB
    for (let i = 0; i < 3; i++) {
      if (val.mat[i] <= 0.04045) {
        val.mat[i] /= 12.92;
      } else {
        val.mat[i] = Math.pow((val.mat[i] + 0.055) / 1.055, 2.4);
      }
    }
    // val.pow(2.2);

    // to CIE XYZ
    let temp = val.copy();
    val = this.#LinearRGBtoXYZ.copy();
    val.mult(temp);

    // to Linear LMS
    temp = val.copy();
    val = this.#XYZtoLinearLMS.copy();
    val.mult(temp);

    // to Linear LMS
    // let temp = val.copy();
    // val = this.#LinearRGBtoLinearLMS.copy();
    // val.mult(temp);

    // to LMS
    val.cbrt();

    // to OkLab
    temp = val.copy();
    val = this.#LMStoLab.copy();
    val.mult(temp);

    return new OkLab(val.mat[0], val.mat[1], val.mat[2]);
  }

  static OkLabtosRGB(lab) {
    let val = new Matrix([lab.l, lab.a, lab.b], 1, 3);

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

    // to Linear RGB
    // temp = val.copy();
    // val = this.#LinearLMStoLinearRGB.copy();
    // val.mult(temp);

    // to sRGB
    const exp = 1. / 2.4;
    for (let i = 0; i < 3; i++) {
      if (val.mat[i] <= 0.0031308) {
        val.mat[i] *= 12.92;
      } else {
        let absroot = Math.pow(Math.abs(val.mat[i]), exp);
        if (val.mat[i] < 0.) absroot *= -1;
        val.mat[i] = absroot;

        val.mat[i] = (1.055 * val.mat[i]) - 0.055;
      }
    }
    // val.nroot(2.2);

    return new sRGB(val.mat[0], val.mat[1], val.mat[2]);
  }
}