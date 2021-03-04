class ContactBase {
   constructor(id, fname, lname, mail, tel, actif, type){       
       this.cId=id;
       this.cName=fname;
       this.cLastName=lname;
       this.cMail=mail;
       this.cTel=tel;
       this.cActif=actif ; 
       this.cType=type;
   }

    cIsValid () {
        if (this.cName && this.cLastName && this.cName.length > 0 && this.cLastName.length > 0)
            return true;
        else
            return false;
    };
    cAbout () {
        let msg = `Je suis ${this.cName}  ${this.cLastName} `;
        if (this.cTel && this.cTel.length > 0)
            msg += `, mon numéro est  ${this.cTel}`;

        if (this.cMail && this.cMail.length > 0)
            msg += `, mon e-mail est  ${this.cMail}`;
        return msg;
    };
    cIsPro() {
        if (this.cType == "pro")
            return true;
        else
            return false;
    };    

    toString() {
        let ret="Classe : ";
        for (const key in this) {
            if (this.hasOwnProperty.call(this, key)) {
                const element = this[key];
                ret +=` ${key} = ${element} ;`;
            }
        }
        return ret;
    };
}