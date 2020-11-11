namespace SLIDE {

    export class Model {
      id_url_booK: string;
      slide: GoogleAppsScript.Slides.Presentation

      constructor(id_url_booK){
        this.id_url_booK = id_url_booK
        this.slide = this.conn(id_url_booK)
      }

      private conn(id_url_booK: string): GoogleAppsScript.Slides.Presentation {
        if (id_url_booK) {
          if (id_url_booK.indexOf('https://docs.google.com/presentation/') >= 0) {
            return SlidesApp.openByUrl(id_url_booK);
          } else {
            return SlidesApp.openById(id_url_booK);
          }
        } else {
          return SlidesApp.getActivePresentation();
        }
      }

      /**
       *  Makes a Slide clone.
       * */
      clone(name: string, folder_id: string):Model {
        const folder = DriveApp.getFolderById(folder_id)
        const fileFromDrive = DriveApp.getFileById(this.slide.getId())
        const newFile = fileFromDrive.makeCopy(name, folder)
        return new Model(newFile.getId())
      }
      
      /**
       *  Replaces a marks in the Slides.
       * */
      replace(data: {}) {
        for (const key in data){
          this.slide.replaceAllText(`##${key}##`, data[key])
        }
      }
      
      /**
       *  Changes Slide access and permissions. 
       * */
      setPermissions(access: GoogleAppsScript.Drive.Access, 
        permission: GoogleAppsScript.Drive.Permission){
        const fileFromDrive = DriveApp.getFileById(this.slide.getId())
        fileFromDrive.setSharing(access, permission)
      }
      
      /**
       *  Return a URL to export at: pdf, pptx, png
       * */
      getUrlExport(fileType: string, pageNumber?: number): string {
        if (fileType === "pdf") {
          return `https://docs.google.com/presentation/d/${this.slide.getId()}/export/pdf`
        } else if (fileType === "pptx") {
          return `https://docs.google.com/presentation/d/${this.slide.getId()}/export/pptx`
        } else if (fileType === "png") {
          if (pageNumber) {
            return `https://docs.google.com/presentation/d/${this.slide.getId()}/export/png?pageid=p${pageNumber}`
          } else {
            throw new Error("Page number is neded.")
          }
        }

        return ""
      }
    }


}
