// Ignore this aberretion, it is util for me.

namespace DaTe {

    export let str: (character: string, date?: Date) => string = (character: string, date?: Date, ) => {
        date = date ? date : new Date();
        return `${date.getDate()}${character}${Number(date.getMonth) + 1}${character}${date.getFullYear()}`
    }

    export const MONTHS: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

}


//Regresa la fecha
// function _date(dateObj) {
//     //StartDate:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
//     this.date = dateObj ? dateObj : new Date();
//     this.dayNum = this.date.getDay();
//     this.day = this.date.getDate();
//     this.month = Number(this.date.getMonth()) + 1;
//     this.monthstr = function() {
//         var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
//
//         return months[this.month - 1];
//     }
//     this.year = this.date.getFullYear();
//     this.strlocal = this.date.toLocaleString();
//     this.str = function(character) {
//         return this.day + character + this.month + character + this.year;
//     }
//     this.strLocalFull = this.day + ' de ' + this.monthstr() + ' de ' + this.year;
//     //this.hours = Number(this.date.getHours()) < 10 ? '0' + this.date.getHours() : this.date.getHours();
//     this.hours = Number(this.date.getHours()) < 10 ? '0' + this.date.getHours() : this.date.getHours();
//     this.minutes = Number(this.date.getMinutes()) < 10 ? '0' + this.date.getMinutes() : this.date.getMinutes();
//     this.seconds = Number(this.date.getSeconds()) < 10 ? '0' + this.date.getSeconds() : this.date.getSeconds();
//     this.hm = this.hours + ':' + this.minutes;
//     this.hms = this.hours + ':' + this.minutes + ':' + this.seconds;
//     this.arr = [this.year, this.month, this.day, this.hours, this.minutes, this.seconds];
//     //EndDate:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// }
