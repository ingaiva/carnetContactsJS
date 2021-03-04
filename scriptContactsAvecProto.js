// Script sans rechargement du tableau avec la gestion de 2 types de contacts
var lstContacts = new Array();

document.addEventListener("DOMContentLoaded", function(){
   
    const rdPro=document.getElementById("rdTypeContactPro");
    rdPro.addEventListener("change" , function(e){       
        if(document.getElementById("rdTypeContactPerso").checked){
            document.getElementById("divFb").style.display="block";
            document.getElementById("divLdn").style.display="none";
        }
        else{
            document.getElementById("divFb").style.display="none";
            document.getElementById("divLdn").style.display="block";
        }
    });
    const rdPerso=document.getElementById("rdTypeContactPerso");
    rdPerso.addEventListener("change" , function(e){       
        if(document.getElementById("rdTypeContactPerso").checked){
            document.getElementById("divFb").style.display="block";
            document.getElementById("divLdn").style.display="none";
        }
        else{
            document.getElementById("divFb").style.display="none";
            document.getElementById("divLdn").style.display="block";
        }
    });
    
    const btnSave=document.getElementById("btnSave");
    btnSave.addEventListener("click", function(){
        const newEl=getNewContact();
        if (newEl.cIsValid()){
            createRowContact(newEl);
            lstContacts.push(newEl);
            localStorage.setItem("contacts", JSON.stringify(lstContacts));
            checkUi(); 
            clearFrm();
        }
    });
    clearFrm();
    loadContacts();    
});

function loadContacts(){
    if (localStorage.getItem("contacts")) {
        lstContacts = JSON.parse(localStorage.getItem("contacts"));
        lstContacts.forEach(element => {            
            createRowContact(getContactFromJson(element));
        });
    }
    checkUi(); 
}

function getContactFromJson(jContact){
    const contactBase = jContact;  
    
    if(contactBase.cType=="pro"){
        let ldn="";
        if ('linkedin' in contactBase ){
            ldn = contactBase.linkedin;
        } 
        return new ContactPro(contactBase.cId, contactBase.cName, contactBase.cLastName, contactBase.cMail, contactBase.cTel,contactBase.cActif,contactBase.cType,ldn);
    }
    else{
        let fb="";
        if ('facebook' in contactBase ){
            fb = contactBase.facebook;
        } 
        return new ContactPerso(contactBase.cId, contactBase.cName, contactBase.cLastName, contactBase.cMail, contactBase.cTel,contactBase.cActif,contactBase.cType,fb);
    }   
}

function ContactBase(id, fname, lname, mail, tel, actif, type) {
    this.cId=id;
    this.cName=fname;
    this.cLastName=lname;
    this.cMail=mail;
    this.cTel=tel;
    this.cActif=actif ; 
    this.cType=type;  

    this.cIsValid = function () {
        if (this.cName && this.cLastName && this.cName.length > 0 && this.cLastName.length > 0)
            return true;
        else
            return false;
    };
    this.cAbout = function () {
        let msg = `Je suis ${this.cName}  ${this.cLastName} `;
        if (this.cTel && this.cTel.length > 0)
            msg += `, mon numéro est  ${this.cTel}`;

        if (this.cMail && this.cMail.length > 0)
            msg += `, mon e-mail est  ${this.cMail}`;
        return msg;
    };
    this.cIsPro = function () {
        if (this.cType == "pro")
            return true;
        else
            return false;
    };
}

function ContactPerso(id, fname, lname, mail, tel, actif, type, fbook) {
    ContactBase.call(this, id, fname, lname, mail, tel, actif, type);
    this.facebook = fbook;
   
}

function ContactPro(id, fname, lname, mail, tel, actif, type,linkdn){
    ContactBase.call(this,id, fname, lname, mail, tel, actif, type);
    this.linkedin=linkdn;
}

function getNewContact(){     
     
    if(document.querySelector('input[name="rdTypeContact"]:checked').value=="pro"){
        return new ContactPro(genererId(), document.getElementById("nameNew").value,
            document.getElementById("lastNameNew").value,
            document.getElementById("mailNew").value,
            document.getElementById("telNew").value,
            true,
            document.querySelector('input[name="rdTypeContact"]:checked').value,
            document.getElementById("ldn").value);
    }
    else {
        return new ContactPerso(genererId(), document.getElementById("nameNew").value,
            document.getElementById("lastNameNew").value,
            document.getElementById("mailNew").value,
            document.getElementById("telNew").value,
            true,
            document.querySelector('input[name="rdTypeContact"]:checked').value,
            document.getElementById("fb").value);
    }    
    
}

function createRowContact(objContact){
    if(objContact.cIsValid()){        
        const tBody=document.querySelector("#lstContacts tbody");
        const newRow=document.createElement("tr");
        newRow.style.backgroundColor=getBgColor(objContact.cActif);        

        let tdC=document.createElement("td");
         //-------------
        let btnIsActif = document.createElement("a");         
        btnIsActif.style.color = getBtnActifColor(objContact.cActif);
        btnIsActif.style.cursor = "pointer"; 
        btnIsActif.classList.add("mx-2");        
        btnIsActif.title="Activer / désactiver ce contact";      
        btnIsActif.insertAdjacentHTML('beforeend', '<i class="fas fa-user-check"></i>');         
        btnIsActif.addEventListener("click", function (e) {            
            objContact.cActif = !(objContact.cActif);
            this.style.color = getBtnActifColor(objContact.cActif);            
            newRow.style.backgroundColor = getBgColor(objContact.cActif); 
            updateLstContact(objContact);            
        });
        tdC.appendChild(btnIsActif); 
         //-------------       
        newRow.appendChild(tdC);
        //-------------      
        tdC=document.createElement("td");
        let btnType = document.createElement("a");
        btnType.style.cursor = "pointer";
        btnType.classList.add("mx-2");
        btnType.title = "Type contact";
        btnType.addEventListener("click", function (e) {
            btnType.innerText="";
            if (objContact.cIsPro()) {
                objContact.cType = "perso";
                btnType.style.color = "red"; 
                btnType.insertAdjacentHTML('beforeend', '<i class="far fa-heart"></i>');  
                createCellTypeContact(newRow, objContact);             
            }
            else {
                objContact.cType = "pro";
                btnType.style.color = "black";                   
                btnType.insertAdjacentHTML('beforeend', '<i class="fas fa-user-tie"></i>');   
                createCellTypeContact(newRow, objContact);  
            }
            updateLstContact(objContact);
        });

        if (objContact.cIsPro()) {  
            btnType.style.color = "black";          
            btnType.insertAdjacentHTML('beforeend', '<i class="fas fa-user-tie"></i>');            
        }
        else {
            btnType.style.color = "red";
            btnType.insertAdjacentHTML('beforeend', '<i class="far fa-heart"></i>');            
        }
        tdC.appendChild(btnType); 
        newRow.appendChild(tdC);
        //-------------      


        tdC=document.createElement("td");
        tdC.textContent=objContact.cName;
        addEvents(tdC, objContact, "cName");
        newRow.appendChild(tdC);

        tdC=document.createElement("td");
        tdC.textContent=objContact.cLastName;
        addEvents(tdC, objContact, "cLastName");
        newRow.appendChild(tdC);        
        
        tdC=document.createElement("td");
        tdC.textContent=objContact.cMail;
        addEvents(tdC, objContact, "cMail");
        newRow.appendChild(tdC);
        // cellule particuliere-----
        tdC=document.createElement("td");        
        tdC.classList.add("td-typeContact");
        newRow.appendChild(tdC);
        createCellTypeContact(newRow, objContact);        
        //--------------------------
        tdC=document.createElement("td");
        tdC.textContent=objContact.cTel;
        addEvents(tdC, objContact, "cTel");
        newRow.appendChild(tdC);
        
        // Boutons------
        tdC=document.createElement("td");
         //-------------
        let btnAbout = document.createElement("a");        
        btnAbout.title="A propos...";
        btnAbout.style.color = "blue";
        btnAbout.style.cursor = "pointer";       
        btnAbout.classList.add("mx-2");        
        btnAbout.insertAdjacentHTML('beforeend', '<i class="fas fa-volume-up"></i>'); 
        btnAbout.addEventListener("click", function (e) {
            alert(objContact.cAbout());
        });
        tdC.appendChild(btnAbout);        
         //-------------
        let btnDel = document.createElement("a");        
        btnDel.title="supprimer";
        btnDel.style.color = "red";
        btnDel.style.cursor = "pointer";       
        btnDel.classList.add("mx-2");        
        btnDel.insertAdjacentHTML('beforeend', '<i class="far fa-trash-alt"></i>'); 
        btnDel.addEventListener("click", function (e) {
            var result = confirm(`Voulez-vous supprimer le contact ${objContact.cName} ${objContact.cLastName} ?`);
            if (result) {
                deleteContact(newRow, objContact);                
            }
        });
        tdC.appendChild(btnDel);
        //-------------
        newRow.appendChild(tdC);
        // Fin boutons
        tBody.appendChild(newRow);
    }      
}

function createCellTypeContact(row, objContact){
    let tdC = row.querySelector(".td-typeContact");

    tdC.innerText="";
    let lbl=document.createElement("label");
    lbl.classList.add("w-75");    
    lbl.classList.add("p-1");
    lbl.classList.add("text-left");
    lbl.style.whiteSpace = "pre-line";
    if(objContact.cIsPro()){        
        tdC.insertAdjacentHTML('afterbegin', '<i class="fab fa-linkedin  mx-2"></i>');
        lbl.textContent=objContact.linkedin;
        addEvents(lbl, objContact, "linkedin"); 
        tdC.appendChild(lbl);
    }
    else{        
        tdC.insertAdjacentHTML('afterbegin', '<i class="fab fa-facebook mx-2"></i>');        
        lbl.textContent=objContact.facebook;
        addEvents(lbl, objContact, "facebook"); 
        tdC.appendChild(lbl);            
    } 
    let iTag = tdC.querySelector("i"); 
    if (iTag){
        iTag.addEventListener("click", function(e){
            lbl.contentEditable = "true"; 
            lbl.style.backgroundColor="white";
            lbl.focus();
        })
    }
}

function addEvents(tdC, objContact, propName){
    tdC.addEventListener("dblclick", function (e) {
        tdC.contentEditable = "true"; 
        tdC.style.backgroundColor="white";
        tdC.focus();
    });

    tdC.addEventListener("blur", function (e) {
        tdC.contentEditable = "false";  
        tdC.style.backgroundColor="";
        objContact[propName] = tdC.textContent;
        updateLstContact(objContact);                   
    });
}

function  deleteContact(cRow, objContact){    
    const idx = lstContacts.findIndex(item => item.cId === objContact.cId);  
    lstContacts.splice(idx ,1);
    
    if(lstContacts.length>0)
        localStorage.setItem("contacts", JSON.stringify(lstContacts));
    else 
        localStorage.removeItem("contacts");  
    
    cRow.parentNode.removeChild(cRow);
    checkUi(); 
}

function updateLstContact(objContact){
    const idx = lstContacts.findIndex(item => item.cId === objContact.cId);    
    lstContacts[idx]=objContact;   
    localStorage.setItem("contacts", JSON.stringify(lstContacts));  
}     

function clearFrm(){
    document.getElementById("nameNew").value = ""; 
    document.getElementById("lastNameNew").value = ""; 
    document.getElementById("mailNew").value = ""; 
    document.getElementById("telNew").value = ""; 
    // document.getElementById("chkActifNew").checked = true; 
    document.getElementById("rdTypeContactPerso").checked = true;

    document.getElementById("fb").value = ""; 
    document.getElementById("ldn").value = ""; 
}

function checkUi(){
    let msgContactNone = document.getElementById("contactNone");
    const tBody=document.querySelector("#lstContacts tbody");
    if(tBody.children.length > 0){
        msgContactNone.style.display = "none";
        document.getElementById("lstContacts").style.display="table";
    }
    else {
        msgContactNone.style.display = "block";
        document.getElementById("lstContacts").style.display="none";
    }
    
    if(document.getElementById("rdTypeContactPerso").checked){
        document.getElementById("divFb").style.display="block";
        document.getElementById("divLdn").style.display="none";
    }
    else{
        document.getElementById("divFb").style.display="none";
        document.getElementById("divLdn").style.display="block";
    }
}

function getBgColor(isActif){
    if(isActif){            
        return "#b8daff";
    } else {            
        return "#d6d8db";
    } 
}
function getBtnActifColor(isActif){
    if(isActif)
        return  "green";
    else 
        return "gray";
}

function genererId() {
    return Math.round((Math.random() * 100000));
}



