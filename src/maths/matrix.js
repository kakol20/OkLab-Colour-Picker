const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);
class Matrix {
  constructor(mat = [0], cols = 1, rows = 1) {
    this.mat = clone(mat);
    this.cols = cols;
    this.rows = rows;

    if (this.cols * this.rows != this.mat.length) console.log('Invalid matrix at constructor');
  }

  copy() {
    return new Matrix(this.mat, this.cols, this.rows);
  }

  #getIndex(c, r, w) {
    return c + r * w;
  }

  mult(rhs) {
    if (this.cols != rhs.rows) return false; // Invalid multiplication

    const newCols = rhs.cols;
    const newRows = this.rows;

    let newMat = Array(newCols * newRows);
    for (let i = 0; i < newCols; i++) {
      for (let j = 0; j < newCols; j++) {
        let total = 0;
        const newMatI = this.#getIndex(i, j, newCols);

        for (let k = 0; k < rhs.rows; k++) {
          const curMatI = this.#getIndex(k, j, this.cols);
          const rhsMatI = this.#getIndex(i, k, rhs.cols);

          total += this.mat[curMatI] * rhs.mat[rhsMatI];
        }

        newMat[newMatI] = total;
      }
    }
    this.mat = clone(newMat);
    this.cols = newCols;
    this.rows = newRows;
    return true;
  }

  scalar(s) {
    for (let i = 0; i < this.mat.length; i++) {
      this.mat[i] *= s;
    }
  }
  pow(p) {
    for (let i = 0; i < this.mat.length; i++) {
      this.mat[i] = Math.pow(this.mat[i], p);
    }
  }
  cbrt() {
    for (let i = 0; i < this.mat.length; i++) {
      this.mat[i] = Math.cbrt(this.mat[i]);
    }
  }
  nroot(n) {
    const exp = 1 / n;
    for (let i = 0; i < this.mat.length; i++) {
      if (n % 1 === 0) {
        this.mat[i] = Math.pow(this.mat[i], exp);
      } else {
        let absroot = Math.pow(Math.abs(this.mat[i]), exp);

        if (this.mat[i] < 0) absroot *= -1;

        this.mat[i] = absroot;
      }
    }
  }

  determinant3x3() {
    if (this.cols === 3 && this.rows === 3) {
      const mat00 = this.#getIndex(0, 0, 3);
      const mat11 = this.#getIndex(1, 1, 3);
      const mat22 = this.#getIndex(2, 2, 3);

      const mat10 = this.#getIndex(1, 0, 3);
      const mat21 = this.#getIndex(2, 1, 3);
      const mat02 = this.#getIndex(0, 2, 3);

      const mat20 = this.#getIndex(2, 0, 3);
      const mat01 = this.#getIndex(0, 1, 3);
      const mat12 = this.#getIndex(1, 2, 3);

      return (this.mat[mat00] * this.mat[mat11] * this.mat[mat22]) +
        (this.mat[mat10] * this.mat[mat21] * this.mat[mat02]) +
        (this.mat[mat20] * this.mat[mat01] * this.mat[mat12]) -

        (this.mat[mat00] * this.mat[mat21] * this.mat[mat12]) -
        (this.mat[mat10] * this.mat[mat01] * this.mat[mat22]) -
        (this.mat[mat20] * this.mat[mat11] * this.mat[mat02]);
    }
    return NaN;
  }

  transpose() {
    let newMat = Array(this.rows * this.cols);

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const newMatI = this.#getIndex(j, i, this.rows);
        const matI = this.#getIndex(i, j, this.cols);

        newMat[newMatI] = this.mat[matI];
      }
    }

    this.mat = clone(newMat);
    const temp = this.cols;
    this.cols = this.rows;
    this.rows = temp;
  }

  determinant2x2() {
    if (this.cols === 2 && this.rows === 2) {
      return (this.mat[this.#getIndex(0, 0, 2)] * this.mat[this.#getIndex(1, 1, 2)]) - 
        (this.mat[this.#getIndex(1, 0, 2)] * this.mat[this.#getIndex(0, 1, 2)]);
    }
      
    return NaN;
  }

  cofactor3x3() {
    if (this.rows === 3 && this.cols === 3) {
      let newMat = clone(this.mat);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const colMax = i <= 1 ? 2 : 1;
          const colMin = i >= 1 ? 0 : 1;

          const rowMax = j <= 1 ? 2 : 1;
          const rowMin = j >= 1 ? 0 : 1;

          const newMatI = this.#getIndex(i, j, 3);

          let detArr = [
            this.mat[this.#getIndex(colMin, rowMin, 2)], this.mat[this.#getIndex(colMax, rowMin, 2)],
            this.mat[this.#getIndex(colMin, rowMax, 2)], this.mat[this.#getIndex(colMax, rowMax, 2)]
          ];

          let detMat = new Matrix(detArr, 2, 2);
          newMat[newMatI] = detMat.determinant2x2() * Math.pow(-1, i + j + 2);
        }
      }
      this.mat = clone(newMat);
      return true;
    }
    return false;
  }

  invert3x3() {
    if (this.cols === 3 && this.rows === 3) {
      let adjoint = new Matrix(this.mat);
      adjoint.cofactor3x3();
      adjoint.transpose();

      const determinant = this.determinant3x3();

      if (determinant === 0) return false;

      adjoint.scalar(1 / determinant);
      this.mat = clone(adjoint.mat);
      return true;
    }
    return false;
  }
}