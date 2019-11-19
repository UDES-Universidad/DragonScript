namespace Email {

    interface Email_interface {
        // send: (to: string, subject: string, body: string) => any;
    }

    // function _mail(){
    //   this.sendEmail = function(email, subject, body){
    //     MailApp.sendEmail({
    //       to: email,
    //       subject: subject,
    //       htmlBody: body
    //     });
    //   }
    // }


    export class Email implements Email_interface {

        static send(to: string, subject: string, body: string): any {
            try {
                MailApp.sendEmail({
                    to: to,
                    subject: subject,
                    htmlBody: body,
                });

                return true;
            } catch (e) {
                return e;
            }
        }
    }

}
