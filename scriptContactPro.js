class ContactPro extends ContactBase{
    constructor(id, fname, lname, mail, tel, actif, type,linkdn){
        super(id, fname, lname, mail, tel, actif, type);
        this.linkedin=linkdn;
    }       
}
