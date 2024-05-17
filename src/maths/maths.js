const MathsCustom = (function () {
  return {
    UnsignedMod(numer, denom) {
      return ((numer % denom) + denom) % denom;
    },

    NRoot(v, n) {
      let out = v;
      const exp = 1 / n;
      if (n % 1 === 0) {
        out = Math.pow(out, exp);
      } else {
        let absroot = Math.pow(Math.abs(out), exp);
        if (out < 0) absroot *= -1;
        out = absroot;
      }
      return out;
    },

    Lerp(a, b, t) {
      return ((b - a) * t) + a;
    },

    TAU: Math.PI * 2,
  }
})();