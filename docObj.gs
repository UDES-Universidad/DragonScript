function _doc(id){
  this.doc = id ? DocumentApp.openById(id) : DocumentApp.getActiveDocument();
  this.id = this.doc.getId();
  this.body = this.doc.getBody();
    
  this.copy = function(name, usethis){
    var file= DriveApp.getFileById(this.id);
    var nameFile = name ? name : "Copia de" + file.getName();
    var newFileID = file.makeCopy(nameFile).getId();
    if(usethis){
      this.id = newFileID 
    }
    return newFileID;
  }
  
  this.exportHTML = function(){
    var url = "https://docs.google.com/feeds/download/documents/export/Export?id="+this.id+"&exportFormat=html";
    var param = {
      method: "get",
      headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
      muteHttpExceptions:true,
    };
    var html = UrlFetchApp.fetch(url,param).getContentText();
    return html;
  }
  
  this.streplace = function (obj, regEx, regExParams){
    for(var i in obj){
      var mark = regEx ? new RegExp(i, regExParams) : i;
      this.body.replaceText(mark, obj[i]);
    }
  }
  
  this.moveFile = function(toFolderId) {
    var source_folder = DriveApp.getFileById(this.id).getParents().next();
    var folder = DriveApp.getFolderById(toFolderId)
    folder.addFile(file);
    source_folder.removeFile(file);
  }
  
  this.appendMap = function(dir) {
    var map = Maps.newStaticMap().addMarker(dir).getBlob();
    this.body.appendImage(map);
  }
}
