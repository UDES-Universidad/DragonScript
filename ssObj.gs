//::::::::::::::::::::::::::::::::::::::::::::::
//Spreadsheet Object::::::::::::::::::::::::::::
//::::::::::::::::::::::::::::::::::::::::::::::

function _ss(id){
  //General:::::::::::::::::::::::::::::::::::::
  this.ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  this.id = this.ss.getId();
  this.sheet = '';
  this.values = '';
  this.setSheet = function(name){
    this.sheet = this.ss.getSheetByName(name);
    this.values = this.sheet.getDataRange().getValues();
  };
  //::::::::::::::::::::::::::::::::::::::::::::::

  //SpreadSheet methods---------------------------

  //Get Sheets names as array
  this.nameSheets = function(){
    var sheets = this.ss.getSheets();
    var names = [];
    sheets.forEach(function(el){
      names.push(el.getSheetName());
    })

   return names;
  }

  //Get sheets index as array. When the variable name is seted, returns the index of page.
  this.indexSheets = function(name){
    if(!name){
      var sheets = this.ss.getSheets();
      var index = [];
      sheets.forEach(function(el){
        index.push(el.getIndex());
      })

      return index;
    }else{
      return this.ss.getSheetByName(name).getIndex();
    }
  }
  //----------------------------------------------------------

  //Sheet Methods---------------------------------------------

  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //Columns::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  //Get column's values as array, if uniques is true, return values uniques
  this.colToArr = function(col, deleteHeader, uniques) {
    var values = this.values;

    if(deleteHeader === 1){
      values.shift();
    }

    values = values.map(function(el){
      if(el[col]){
        return el[col];
      }
    });

    if(uniques === 1){
      values = values.filter(function(elem, index, self) {
        if(elem){
          return index == self.indexOf(elem);
        }
      });
    }

    return values;
  }

  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


  //Get rows whit specified key::::::::::::::::::::::::::::::::::::

  this.getRowsBy = function(col, key, strict){
    var values = this.values;
    var filter = values.filter(function(el){
        return (strict === 1) ? el[col] === key : el[col] == key;
    });

    return filter;
  }

  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  //Get Rows empty or full:::::::::::::::::::::::::::::::::::::::::
  this.getRowsWhitCelFull = function(col, empty){
    var values = this.values;
    var filter = values.filter(function(el){
      if(empty === 1){
        return !el[col];
      }else{
        return el[col];
      }
    });

    return filter;
  }

  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //Rows:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


  //Inserta filas al inicio, pero después de las cabeceras de las columnas

  this.insertRowsTop = function(arr, headers){
    var position = headers === 1 ? 1 : 0;
    this.sheet.insertRowsAfter(position, arr.length);
    this.sheet.getRange(position + 1, 1, arr.length, arr[0].length).setValues(arr);
  }

  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  //Inserta filas al final del documentos
  this.insertRowsBottom = function(arr){
    var lastRow = this.sheet.getLastRow();
    this.sheet.getRange(lastRow ? (lastRow + 1) : 1, 1, arr.length, arr[0].length).setValues(arr);
  }

  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  //End General::::::::::::::::::::::::::::::::::::::
}
