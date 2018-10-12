//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//Funciones de la Hoja de Cálculo:::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//Regresa los parámetros más utilizados en una hoja
function _target(id, name){
  var ss = SpreadsheetApp.openById(id);
  var sheet = ss.getSheetByName(name);
  var values = sheet.getDataRange().getValues();

  var datas = {
    ss: ss,
    sheet: sheet,
    values: values
  }

  return datas;
}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//Funciones de fecha y hora:::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//Regresa la fecha
function _fecha(dateObj){
  var date = dateObj ? dateObj : new Date();
  var localString = date.toLocaleString();
  var dia = date.getDate();
  var mes = Number(date.getMonth()) + 1;
  var year = date.getFullYear();
  var string = dia + '/' + mes + '/' + year;

  var fecha = {
    date: date,
    strl: localString,
    dia: dia,
    mes: mes,
    year: year,
    str: string
  }

  return fecha;
}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//Funciones de Columnas:::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//Regresa los valores únicos de una columna en forma de array Unidimensional, deleteHeader = true elimina los headers
function _sortedUniqColToArrayUD(values, col, deleteHeader) {
  if(deleteHeader){
    values.shift();
  }

  values = values.map(function(el){
    if(el[col]){
      return el[col];
    }
  });

  values = values.filter(function(elem, index, self) {
    if(elem){
    return index == self.indexOf(elem);
    }
  });

  return values.sort();
}

//Regresa una columna como un array Unidimensional
function _colToArrayUD(arr, col, row){
  arr = row ? arr.splice(row, arr.length - 1) : arr;
  arr = arr.map(function(el){
      return el[col];
  });
  arr = arr.filter(function(el){
      return el;
  });
  return arr;
}

//Regresa los valores únicos de una columna en forma de columna
function _colToColUnique(values, col){
  var arrUnique = _sortedUniqColToRow(values, col, true);

  arrUnique = arrUnique.map(function(el){
    return [el];
  });

  return arrUnique;
}

//Inserta una columna
function _insertValsCol(id, sheetName,colArr, rowNum, colNum, afterBefore){
  if(afterBefore){
    SpreadsheetApp.openById(id).insertColumnAfter(colNum);
  }else{
    SpreadsheetApp.openById(id).insertColumnBefore(colNum)
  }

  SpreadsheetApp.openById(id).getRange(rowNum, colNum, colArr.length, colArr[0].length).setValues(colArr);
}

//Inserta una columna
function _appendCol(id, sheetName,colArr, rowNum){

  var sheet = _target(id, sheetName).sheet;

  //sheet.insertColumnAfter(sheet.getLastColumn() +1);

  sheet.getRange(rowNum, sheet.getLastColumn() +1, colArr.length, colArr[0].length).setValues(colArr);
}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//Funciones de Filas::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//Obtiene la fila dependiendo de las filas que en determinada columna aparecen llenas
function getRowByCol(arr, col){
  arr = arr.filter(function(el){
    if(el[col]){
      return el;
    }
  });

  return arr;
}

//Inserta filas al inicio, pero después de las cabeceras de las columnas
function _insertTop(arr, id, nameSheet){
  var sheet = SpreadsheetApp.openById(id).getSheetByName(nameSheet);
  sheet.insertRowsAfter(1, arr.length);
  sheet.getRange(2, 1, arr.length, arr[0].length).setValues(arr);
}

//Combierte una fila en una columna
function _rowToCol(arr, rowNum){
  var row = arr[rowNum];
  var col = [];
  row.forEach(function(el){
    col.push([el]);
  });

  return col;
}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//Funciones de Valores ünicos:::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//Regresa una array multi dimensional con los valóres únicos obtenidos de un array
function _uniqueFromArrayMultiDi(valuesArr, arr, colComp){
  var unique = [];

  for(var i = 0; i < arr.length; i++){
    for(var j = valuesArr.length - 1; j > 0; j--){
      if(arr[i] === valuesArr[j][colComp]){
        unique.push(valuesArr[j]);
        break;
      }
    }
  }

  return unique;
}

//(La comparación no se hace aducadamente ***Revisar***)Regresa los valores únicos de un array multidimensinal
function _sortedUniqArray(arr){
  var unique_array = arr.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
  });
  return unique_array
}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//Funciones de String:::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//Estandariza un string para poderlo comparar mejor
function _standariseStr(item){
  return  item.replace(/\s/g,"")
              .replace(/([àáâãäå])/gi,"a")
              .replace(/([èéêë])/gi,"e")
              .replace(/([ìíîï])/gi,"i")
              .replace(/([òóôõö])/gi,"o")
              .replace(/([ùúûü])/gi,"u")
              .toLowerCase()
              .trim();
}

//String a mayusculas, elimina además los acentos
function _strSheetToUpperStandar(id, nameSheet){
  var ss = _target(id, nameSheet);
  var values = ss.values;

  for(var i = 0; i < values.length; i++){
    for(var j = 0; j < values[i].length; j++){
      if(values[i][j]){
        if(typeof values[i][j] === 'string'){
          var str = values[i][j].replace(/([àáâãäå])/gi,"A")
                                .replace(/([èéêë])/gi,"E")
                                .replace(/([ìíîï])/gi,"I")
                                .replace(/([òóôõö])/gi,"O")
                                .replace(/([ùúûü])/gi,"U")
                                .toLowerCase()
                                .trim()
                                .toUpperCase();

          ss.sheet.getRange(i+1, j+1).setValue([str]);
        }
      }
    }
  }
}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

