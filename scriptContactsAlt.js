// Script simple avec le rechargement du tableau
var lstContacts = new Array();

document.addEventListener("DOMContentLoaded", function(){    
    if (localStorage.getItem("contacts")) {
        lstContacts = JSON.parse(localStorage.getItem("contacts"));        
    }
    const btnSave=document.getElementById("btnSave");
    btnSave.addEventListener("click", function(){
        const newEl=getNewContact();
        if (newEl.cIsValid()){            
            lstContacts.push(newEl);
            localStorage.setItem("contacts", JSON.stringify(lstContacts));
            loadContacts();
            clearFrm();
        }
    });  
    loadContacts();  
    clearFrm();
});

function loadContacts(){ 
    const tBody=document.querySelector("#lstContacts tbody");
    tBody.innerHTML="";   
    lstContacts.forEach(element => {            
        createRowContact(getContactFromJson(element));
    });
    checkUi(); 
}

function getContactFromJson(jContact){
    const newEl={
        cId:jContact.cId,
        cName:jContact.cName,
        cLastName:jContact.cLastName,
        cMail:jContact.cMail,
        cTel:jContact.cTel,
        cActif: jContact.cActif,
        cIsValid : function(){
            if(this.cName.length >0 && this.cLastName.length >0)
                return true;             
            else
                return false;            
        },
        cAbout : function(){
            let msg =`Je suis ${this.cName}  ${this.cLastName} `;
            if(this.cTel && this.cTel.length>0)
                msg +=`, mon numéro est  ${this.cTel}`;

            if(this.cMail && this.cMail.length>0)
                msg +=`, mon e-mail est  ${this.cMail}`;
            return msg;
        }
    }
    return newEl;
}

function getNewContact(){
    const newEl={
        cId:genererId(),
        cName:document.getElementById("nameNew").value,
        cLastName:document.getElementById("lastNameNew").value,
        cMail:document.getElementById("mailNew").value,
        cTel:document.getElementById("telNew").value,
        cActif: document.getElementById("chkActifNew").checked        
    };    
    return getContactFromJson( newEl);
}

function createRowContact(objContact){
    if(objContact.cIsValid()){        
        const tBody=document.querySelector("#lstContacts tbody");
        const newRow=document.createElement("tr");
        newRow.style.backgroundColor = getBgColor(objContact.cActif);        

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
                deleteContact(objContact);                
            }
        });
        tdC.appendChild(btnDel);
        //-------------
        newRow.appendChild(tdC);
        // Fin boutons
        tBody.appendChild(newRow);
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

function  deleteContact(objContact){  
    const idx = lstContacts.findIndex(item => item.cId === objContact.cId);      
    lstContacts.splice(idx,1);
    if(lstContacts.length>0)
        localStorage.setItem("contacts", JSON.stringify(lstContacts));
    else 
        localStorage.removeItem("contacts");      
    
    loadContacts();
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
    document.getElementById("chkActifNew").checked = true;    
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

// function find(cId){
//     for (let index = 0; index < lstContacts.length; index++) {
//         if(lstContacts[index].cId==cId)
//             return index;  
//     }
//     return -1;
// }



