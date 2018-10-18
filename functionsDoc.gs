//Google Docs to HTML
function _exportAsHTML(docID){
  var url = "https://docs.google.com/feeds/download/documents/export/Export?id="+docID+"&exportFormat=html";
  var param = {
    method: "get",
    headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpExceptions:true,
  };
  var html = UrlFetchApp.fetch(url,param).getContentText();
  return html; 
}

//New  docfile from template
function _fileNewFromTemplate(docID, nameNew){
  var file= DriveApp.getFileById(docID);
  var newFileID = file.makeCopy(nameNew).getId();
  
  return newFileID;
}

//Reemplace marcs
function _reemplaceStrSingleFile(docID, arr, regEx){
  var fileBody = DocumentApp.openById(docID).getBody();
  
  for(var i = 0; i < arr.length; i++){
    var mark = regEx ? new RegExp(arr[i][0], "g") : arr[i][0];
    var value = arr[i][1];
    fileBody.replaceText(mark, value);    
  }
}

function moveFileId(fileId, toFolderId) {
   var file = DriveApp.getFileById(fileId);
   var source_folder = DriveApp.getFileById(fileId).getParents().next();
   var folder = DriveApp.getFolderById(toFolderId)
   folder.addFile(file);
   source_folder.removeFile(file);
}
