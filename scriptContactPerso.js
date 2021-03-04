class ContactPerso extends ContactBase{
    constructor(id, fname, lname, mail, tel, actif, type, fbook){
        super(id, fname, lname, mail, tel, actif, type);
        this.facebook = fbook;
    }   
}