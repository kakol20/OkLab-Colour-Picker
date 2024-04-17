class sRGB {
  #red;
  #green;
  #blue;
  constructor(r = 0, g = 0, b = 0) {
    this.#red = r;
    this.#green = g;
    this.#blue = b;
  }

  get p5Color() {
    return color(this.#red * 255, this.#green * 255, this.#blue * 255);
  }

  get red() { return this.#red; }
  get green() { return this.#green; }
  get blue() { return this.#blue; }

  set red(x) { this.#red = x; }
  set green(x) { this.#green = x; }
  set blue(x) { this.#blue = x; }

  clamp() {
    this.#red = this.#red > 1 ? 1 : this.#red;
    this.#green = this.#green > 1 ? 1 : this.#green;
    this.#blue = this.#blue > 1 ? 1 : this.#blue;

    this.#red = this.#red < 0 ? 0 : this.#red;
    this.#green = this.#green < 0 ? 0 : this.#green;
    this.#blue = this.#blue < 0 ? 0 : this.#blue;
  }

  scalar(s) {
    this.#red *= s;
    this.#green *= s;
    this.#blue *= s;
  }

  copy() {
    return new sRGB(this.#red, this.#green, this.#blue);
  }
}