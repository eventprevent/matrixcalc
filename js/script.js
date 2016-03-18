//polyfill for ie8 (classList)
(function () {

  if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

  var prototype = Array.prototype,
      push = prototype.push,
      splice = prototype.splice,
      join = prototype.join;

  function DOMTokenList(el) {
    this.el = el;
    // The className needs to be trimmed and split on whitespace
    // to retrieve a list of classes.
    var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
    for (var i = 0; i < classes.length; i++) {
      push.call(this, classes[i]);
    }
  };

  DOMTokenList.prototype = {
    add: function(token) {
      if(this.contains(token)) return;
      push.call(this, token);
      this.el.className = this.toString();
    },
    contains: function(token) {
      return this.el.className.indexOf(token) != -1;
    },
    item: function(index) {
      return this[index] || null;
    },
    remove: function(token) {
      if (!this.contains(token)) return;
      for (var i = 0; i < this.length; i++) {
        if (this[i] == token) break;
      }
      splice.call(this, i, 1);
      this.el.className = this.toString();
    },
    toString: function() {
      return join.call(this, ' ');
    },
    toggle: function(token) {
      if (!this.contains(token)) {
        this.add(token);
      } else {
        this.remove(token);
      }

      return this.contains(token);
    }
  };

  window.DOMTokenList = DOMTokenList;

  function defineElementGetter (obj, prop, getter) {
      if (Object.defineProperty) {
          Object.defineProperty(obj, prop,{
              get : getter
          });
      } else {
          obj.__defineGetter__(prop, getter);
      }
  }

  defineElementGetter(Element.prototype, 'classList', function () {
    return new DOMTokenList(this);
});

})();

//my script
(function () {
  function Multiply() {
    var firstMatrix = document.querySelectorAll('.first-matrix .matrix-row');
    var secondMatrix = document.querySelectorAll('.second-matrix .matrix-row');
    var resultMatrix = document.querySelectorAll('.result-matrix .matrix-row');


    if (checkMatrixValue(firstMatrix) && checkMatrixValue(secondMatrix)) {
      var sumElem = 0;
      for (var i = 0; i < firstMatrix.length; i++) {
        for (var j = 0; j < secondMatrix[0].children.length; j++) {
          sumElem=0;
          for (var k = 0; k < secondMatrix.length; k++) {
            sumElem += (firstMatrix[i].children[k].value)*(secondMatrix[k].children[j].value);
          }
          resultMatrix[i].children[j].value=+sumElem.toFixed(10);
        }
      }
    } else {
      errorControl.addValueError();
    }
  }

  function checkMatrixValue (matrix) {
    var matrixValue = true;
    var i = 0;
    var j = 0;
    var value = 0;

    while (matrixValue && (i < matrix.length)) {
      value = matrix[i].children[j].value;
      matrixValue  = !isNaN(parseFloat(value)) && isFinite(value) && (+value <=10);
      if (j < matrix[i].children.length - 1) {
        j++;
      } else {
        j = 0;
        i++;
      }
    }

    return matrixValue;
  }

  function matrixClean() {
    var matrixRows = document.querySelectorAll('.matrix-row');
    for (var i = 0; i < matrixRows.length; i++) {
      for (var j = 0; j < matrixRows[i].children.length; j++) {
        matrixRows[i].children[j].value = '';
      }
    }
  }

  function matrixAddRow(matrixClass) {
    var matrix = document.querySelectorAll(matrixClass + ' .matrix-row');
    var countRows = matrix.length;
    var newRow = matrix[countRows-1].cloneNode(true);
    for (var i = 0; i < newRow.children.length; i++) {
      newRow.children[i].placeholder = matrix[countRows-1].children[0].placeholder.charAt(0) + (countRows+1) + ',' + (i+1);
      newRow.children[i].value = '';
      inputFocus(newRow.children[i]);
    }
    matrix[countRows-1].parentNode.appendChild(newRow);
    matrix = document.querySelectorAll(matrixClass + ' .matrix-row');
    if (matrix.length > 9) {
      btnAddRow.disabled = true;
    }
    btnDeleteRow.disabled = false;
  }

  function matrixDeleteRow(matrixClass) {
    var matrix = document.querySelectorAll(matrixClass + ' .matrix-row');
    var lastRow = +matrix.length - 1;
    matrix[lastRow].parentNode.removeChild(matrix[lastRow]);
    matrix = document.querySelectorAll(matrixClass + ' .matrix-row');
    if (matrix.length < 3) {
      btnDeleteRow.disabled = true;
    }
    btnAddRow.disabled = false;
  }

  function matrixAddCol(matrixClass) {
    var matrix = document.querySelectorAll(matrixClass + ' .matrix-row');
    var countElem = matrix[0].children.length;
    var newElem;
    for (var i = 0; i < matrix.length; i++) {
      newElem = matrix[i].children[countElem-1].cloneNode(true);
      newElem.placeholder = matrix[i].children[countElem-1].placeholder.charAt(0) + (i+1) + ',' + (countElem+1);
      newElem.value = '';
      inputFocus(newElem);
      matrix[i].appendChild(newElem);
    }
    matrix = document.querySelectorAll(matrixClass + ' .matrix-row');
    if (matrix[0].children.length > 9) {
      btnAddCol.disabled = true;
    }
    btnDeleteCol.disabled = false;
  }

  function matrixDeleteCol(matrixClass) {
    var matrix = document.querySelectorAll(matrixClass + ' .matrix-row');
    var lastElem = matrix[0].children.length-1;
    for (var i = 0; i < matrix.length; i++) {
      matrix[i].removeChild(matrix[i].children[lastElem]);
    }
    matrix = document.querySelectorAll(matrixClass + ' .matrix-row');
    if (matrix[0].children.length < 3) {
      btnDeleteCol.disabled = true;
    }
    btnAddCol.disabled = false;
  }

  function matrixControlStatus (matrix) {
    if (matrix.length > 9) {
      btnAddRow.disabled = true;
    } else {
      btnAddRow.disabled = false;
    }
    if (matrix.length < 3) {
      btnDeleteRow.disabled = true;
    } else {
      btnDeleteRow.disabled = false;
    }
    if (matrix[0].children.length > 9) {
      btnAddCol.disabled = true;
    } else {
      btnAddCol.disabled = false;
    }
    if (matrix[0].children.length < 3) {
      btnDeleteCol.disabled = true;
    } else {
      btnDeleteCol.disabled = false;
    }
  }

  function checkMatrixSize() {
    var firstMatrix = document.querySelectorAll('.first-matrix .matrix-row');
    var secondMatrix = document.querySelectorAll('.second-matrix .matrix-row');

    if (!(firstMatrix[0].children.length == secondMatrix.length)) {
      errorControl.addSizeError();
    } else {
      errorControl.removeSizeError();
    }
  }

  function matrixSwap() {
    var firstMatrix = document.querySelector('.matrix');

    firstMatrix.parentNode.appendChild(firstMatrix);
  }

  function inputFocus(control) {
    control.addEventListener('focus', function () {
      errorControl.removeValueError();
      checkMatrixSize();
      controlBlock.classList.add('changes');
    });
    control.addEventListener('blur', function () {
      controlBlock.classList.remove('changes');
    });
  }

  var errorControl = {
    addSizeError: function () {
      controlBlock.classList.add('error');
      btnMultiply.disabled = true;
      errorText.innerHTML = 'Такие матрицы нельзя перемножить, так как количество столбцов матрицы A не равно количеству строк матрицы B.';
    },
    removeSizeError: function () {
      controlBlock.classList.remove('error');
      errorText.innerHTML = '';
      btnMultiply.disabled = false;
    },
    addValueError: function () {
      controlBlock.classList.add('error');
      btnMultiply.disabled = true;
      errorText.innerHTML = 'Значение в ячейке матрицы должно быть числом, не превышающим 10.';
    },
    removeValueError: function () {
      controlBlock.classList.remove('error');
      errorText.innerHTML = '';
      btnMultiply.disabled = false;
    }
  }

  var controlBlock = document.querySelector('body');
  var btnMultiply = document.querySelector('.multiply-btn');
  var btnClean = document.querySelector('.clean-btn');
  var btnSwap = document.querySelector('.swap-btn');
  var errorText = document.querySelector('.error-text');
  var btnAddRow = document.querySelector('.add-row');
  var btnDeleteRow = document.querySelector('.delete-row');
  var btnAddCol = document.querySelector('.add-col');
  var btnDeleteCol = document.querySelector('.delete-col');
  var matrixCells = document.querySelectorAll('input[type="number"]');
  var currentMatrix = document.querySelectorAll('input[type="radio"]');
  var MATRIX_A = 0;
  var MATRIX_B = 1;

  checkMatrixSize();

  if (currentMatrix[MATRIX_A].checked) {
    var matrix = document.querySelectorAll('.first-matrix .matrix-row');
    matrixControlStatus(matrix);
  }

  if (currentMatrix[MATRIX_B].checked) {
    var matrix = document.querySelectorAll('.second-matrix .matrix-row');
    matrixControlStatus(matrix);
  }

  for (var i = 0; i < matrixCells.length; i++) {
    inputFocus(matrixCells[i]);
  }

  btnMultiply.addEventListener('click', function(event) {
    event.preventDefault();
    Multiply();
  });
  btnClean.addEventListener('click', function(event) {
    event.preventDefault();
    matrixClean();
  });
  currentMatrix[MATRIX_A].addEventListener('click', function() {
    var matrix = document.querySelectorAll('.first-matrix .matrix-row');
    matrixControlStatus(matrix);
  });
  currentMatrix[MATRIX_B].addEventListener('click', function() {
    var matrix = document.querySelectorAll('.second-matrix .matrix-row');
    matrixControlStatus(matrix);
  });
  btnAddRow.addEventListener('click', function(event) {
    event.preventDefault();
    if (currentMatrix[MATRIX_A].checked) {
      matrixAddRow('.first-matrix');
      matrixAddRow('.result-matrix');
    }
    if (currentMatrix[MATRIX_B].checked) {
      matrixAddRow('.second-matrix');
    }
    checkMatrixSize();
  });
  btnDeleteRow.addEventListener('click', function(event) {
    event.preventDefault();
    if (currentMatrix[MATRIX_A].checked) {
      matrixDeleteRow('.first-matrix');
      matrixDeleteRow('.result-matrix');
    }
    if (currentMatrix[MATRIX_B].checked) {
      matrixDeleteRow('.second-matrix');
    }
    checkMatrixSize();
  });
  btnAddCol.addEventListener('click', function(event) {
    event.preventDefault();
    if (currentMatrix[MATRIX_A].checked) {
      matrixAddCol('.first-matrix');
    }
    if (currentMatrix[MATRIX_B].checked) {
      matrixAddCol('.second-matrix');
      matrixAddCol('.result-matrix');
    }
    checkMatrixSize();
  });
  btnDeleteCol.addEventListener('click', function(event) {
    event.preventDefault();
    if (currentMatrix[MATRIX_A].checked) {
      matrixDeleteCol('.first-matrix');
    }
    if (currentMatrix[MATRIX_B].checked) {
      matrixDeleteCol('.second-matrix');
      matrixDeleteCol('.result-matrix');
    }
    checkMatrixSize();
  });
  btnSwap.addEventListener('click', function(event) {
    event.preventDefault();
    matrixSwap();
  });
})();
