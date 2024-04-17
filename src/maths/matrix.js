class Matrix {
  constructor(mat = [[0]]) {
    this.mat = JSON.parse(JSON.stringify(mat));

    this.cols = mat.length;
    this.rows = mat[0].length;

    for (let i = 1; i < this.cols; i++) {
      if (this.mat[0].length != this.mat[i].length) {
        alert('Invalid matrix at constructor');
      }
    }
  }

  fromSize(cols, rows) {
    this.cols = cols;
    this.rows = rows;

    this.mat = [];
    for (let i = 0; i < this.cols; i++) {
      let jGrid = [];
      for (let j = 0 ; j < this.rows; j++) {
        jGrid.push(0);
      }
      this.mat.push(jGrid);
    }
  }

  copy() {
    return new Matrix(this.mat);
  }

  mult(rhs) {
    if (this.cols != rhs.rows) return false; // Invalid multiplication

    const newCols = rhs.cols;
    const newRows = this.rows;

    let newMat = [];
    for (let i = 0; i < newCols; i++) {
      let jGrid = [];
      for (let j = 0; j < newRows; j++) {
        let total = 0;
        for (let k = 0; k < rhs.rows; k++) {
          total += this.mat[k][j] * rhs.mat[i][k];
        }
        jGrid.push(total);
      }
      newMat.push(jGrid);
    }

    this.mat = JSON.parse(JSON.stringify(newMat));
    this.cols = newCols;
    this.rows = newRows;
    return true;
  }

  scalar(s) {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.mat[i][j] *= s;
      }
    }
  }

  invert3x3() {
    if (this.cols === 3 && this.rows === 3) {
      let adjoint = new Matrix(this.mat);
      adjoint.cofactor3x3();
      adjoint.transpose();

      const determinant = this.determinant3x3();

      if (determinant === 0) return false;

      adjoint.scalar(1. / determinant);

      this.mat = JSON.parse(JSON.stringify(adjoint.mat));
    
      return true;
    }
    return false;
  }

  cofactor3x3() {
    if (this.cols === 3 && this.rows === 3) {
      let newMat = new Matrix(this.mat);

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const colMax = i <= 1 ? 2 : 1;
          const colMin = i >= 1 ? 0 : 1;

          const rowMax = j <= 1 ? 2 : 1;
          const rowMin = j >= 1 ? 0 : 1;

          let detArr = [];
          detArr.push([this.mat[colMin][rowMin], this.mat[colMin][rowMax]]);
          detArr.push([this.mat[colMax][rowMin], this.mat[colMax][rowMax]]);

          let detMat = new Matrix(detArr);

          // newMat.setValue(i, j, detMat.determinant2x2() * Math.pow(-1, i + j + 2));
          newMat.mat[i][j] = detMat.determinant2x2() * Math.pow(-1, i + j + 2);
        }
      }

      this.mat = JSON.parse(JSON.stringify(newMat.mat));

      return true;
    }
    return false;
  }

  determinant2x2() {
    if (this.cols === 2 && this.rows === 2) {
      return (this.mat[0][0] * this.mat[1][1]) - (this.mat[1][0] * this.mat[0][1])
    }
    return NaN;
  }

  transpose() {
    let newMat = new Matrix(this.mat);
    newMat.fromSize(this.rows, this.cols);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0 ; j < this.rows; j++) {
        newMat.mat[j][i] = this.mat[i][j];
      }
    }

    this.mat = JSON.parse(JSON.stringify(newMat.mat)); 
    this.cols = newMat.cols;
    this.rows = newMat.rows;
  }

  determinant3x3() {
    if (this.cols == 3 && this.rows == 3) {
      return (this.mat[0][0] * this.mat[1][1] * this.mat[2][2]) +
        (this.mat[1][0] * this.mat[2][1] * this.mat[0][2]) +
        (this.mat[2][0] * this.mat[0][1] * this.mat[1][2]) -
  
        (this.mat[0][0] * this.mat[2][1] * this.mat[1][2]) -
        (this.mat[1][0] * this.mat[0][1] * this.mat[2][2]) -
        (this.mat[2][0] * this.mat[1][1] * this.mat[0][2]);
    }

    return NaN;
  }

  pow(p) {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0 ; j < this.rows; j++) {
        this.mat[i][j] = Math.pow(this.mat[i][j], p);
      }
    }
  }

  cbrt() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0 ; j < this.rows; j++) {
        this.mat[i][j] = Math.cbrt(this.mat[i][j]);
      }
    }
  }

  nroot(n) {
    const exp = 1. / n;
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0 ; j < this.rows; j++) {
        // newMat.mat[i][j] = Math.pow(this.mat[i][j], p);
        if (n % 1 === 0) {
          this.mat[i][j] = Math.pow(this.mat[i][j], exp);
        } else {
          let absroot = Math.pow(Math.abs(this.mat[i][j]), exp);

          if (this.mat[i][j] < 0.) absroot *= -1;

          this.mat[i][j] = absroot;
        }
      }
    }
  }
}