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
    return new OkLab(MathsCustom.Lerp(a.l, b.l, t), MathsCustom.Lerp(a.a, b.a, t), MathsCustom.Lerp(a.b, b.b, t))
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
    // let rgb = OkLab.OkLabtosRGB(this.copy());
    // rgb.clamp();
    // // console.log(rgb);
    // let lab = OkLab.sRGBtoOkLab(rgb);
    // this.l = lab.l;
    // this.a = lab.a;
    // this.b = lab.b;

    let lch = OkLCh.OkLabtoOkLCh(this.copy());
    lch.fallback(0.005, 1000);

    let lab = OkLCh.OkLChtoOkLab(lch);
    this.l = lab.l;
    this.a = lab.a;
    this.b = lab.b;
  }

  static initialise() {
    // do nothing
  }

  static sRGBtoOkLab(srgb) {
    // let val = new Matrix([srgb.red, srgb.green, srgb.blue], 1, 3);

    // return new OkLab(val.mat[0], val.mat[1], val.mat[2]);
    let l1 = srgb.red;
    let a1 = srgb.green;
    let b1 = srgb.blue;

    // to Linear RGB
    l1 = Math.pow(l1, 2.224874);
    a1 = Math.pow(a1, 2.224874);
    b1 = Math.pow(b1, 2.224874);

    // to Linear LMS
    let l2 = 0.412242 * l1 + 0.536262 * a1 + 0.051428 * b1;
    let a2 = 0.211943 * l1 + 0.680702 * a1 + 0.107374 * b1;
    let b2 = 0.088359 * l1 + 0.281847 * a1 + 0.630130 * b1;

    // to LMS
    l1 = Math.cbrt(l2);
    a1 = Math.cbrt(a2);
    b1 = Math.cbrt(b2);

    // to OkLab
    l2 = 0.210454 * l1 + 0.793618 * a1 - 0.004072 * b1;
    a2 = 1.977998 * l1 - 2.428592 * a1 + 0.450594 * b1;
    b2 = 0.025904 * l1 + 0.782772 * a1 - 0.808676 * b1;

    return new OkLab(l2, a2, b2);
  }

  static OkLabtosRGB(lab) {
    // let val = new Matrix([lab.l, lab.a, lab.b], 1, 3);

    //return new sRGB(val.mat[0], val.mat[1], val.mat[2]);
    let r1 = lab.l;
    let g1 = lab.a;
    let b1 = lab.b;

    // to LMS
    let r2 = r1 + 0.396338 * g1 + 0.215804 * b1;
    let g2 = r1 - 0.105561 * g1 - 0.063854 * b1;
    let b2 = r1 - 0.089484 * g1 - 1.291486 * b1;

    // to Linear LMS
    r1 = r2 * r2 * r2;
    g1 = g2 * g2 * g2;
    b1 = b2 * b2 * b2;

    // to Linear RGB
    r2 = 4.076539 * r1 - 3.307097 * g1 + 0.230822 * b1;
    g2 = -1.268606 * r1 + 2.609748 * g1 - 0.341164 * b1;
    b2 = -0.004198 * r1 - 0.703568 * g1 + 1.707206 * b1;

    // to sRGB
    r2 = MathsCustom.NRoot(r2, 2.224874);
    g2 = MathsCustom.NRoot(g2, 2.224874);
    b2 = MathsCustom.NRoot(b2, 2.224874);

    return new sRGB(r2, g2, b2);
  }
}

class OkLCh {
  constructor(l = 0, c = 0, h = 0) {
    this.l = l;
    this.c = c;
    this.h = h;
  }

  get p5Color() {
    let out = OkLCh.OkLChtosRGB(this.copy());
    return out.p5Color;
  }

  copy() {
    return new OkLCh(this.l, this.c, this.h);
  }

  fallback(change = 0.001, maxIt = 100) {
    this.l = Math.min(Math.max(this.l, 0), 1);
    let current = OkLCh.OkLChtosRGB(this.copy());

    let iterations = 0;
    while (current.isOutsideRGB) {
      // this.c = this.c > 0.37 ? 0.37 : this.c;

      this.c -= change;
      this.c = Math.max(this.c, 0);

      current = OkLCh.OkLChtosRGB(this.copy());

      iterations++;

      if (iterations > maxIt) {
        current.clamp();
        let lch = OkLCh.sRGBtoOKLCh(current);
        this.l = lch.l;
        this.c = lch.c;
        this.h = lch.h;

        break;
      }
    }
  }

  static OkLabtoOkLCh(lab) {
    let l = lab.l;
    let c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
    let h = MathsCustom.UnsignedMod(Math.atan2(lab.b, lab.a), MathsCustom.TAU);

    return new OkLCh(l, c, h);
  }

  static OkLChtoOkLab(lch) {
    let l = lch.l;
    let a = lch.c * Math.cos(lch.h);
    let b = lch.c * Math.sin(lch.h);
    return new OkLab(l, a, b);
  }

  static sRGBtoOKLCh(srgb) {
    let lab = OkLab.sRGBtoOkLab(srgb);

    let l = lab.l;
    let c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
    let h = MathsCustom.UnsignedMod(Math.atan2(lab.b, lab.a), MathsCustom.TAU);

    return new OkLCh(l, c, h);
  }

  static OkLChtosRGB(lch) {
    let l = lch.l;
    let a = lch.c * Math.cos(lch.h);
    let b = lch.c * Math.sin(lch.h);

    return OkLab.OkLabtosRGB(new OkLab(l, a, b));
  }
}