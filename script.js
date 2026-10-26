const correctname = "Kalle";
const correctpassword = "qwe123";
const message = document.getElementById("message");
const button = document.getElementById("logout");
const vidare = document.getElementById("vidare");
const form = document.getElementById("formen");
const welcome = document.getElementById("welcome");
const inloggad = localStorage.getItem("inloggad"); // Hämtar värdet från localStorage.

button.style.display = "none" //Döljer knappen för tillfället.

if(inloggad === "true"){ 
    form.style.display = "none";
    button.style.display = "block";
    welcome.style.display = "block";
    welcome.textContent = "Välkommen " + correctname + " du är nu inloggad";
} //Testar först om användaren är inloggad på sidan med "true".
//Om användaren är inloggad så försvinner form och visar welcome och button från HTML.

vidare.addEventListener("click", login); //Ett event som gör att vid klick av knapp så körs funktionen.
button.addEventListener("click", logout);//Samma som login fast logga ut istället. Här lade jag inte i knappfunktionen istället för i function.

function login(e) { 
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value; //Värdet av vad användaren skriver in.

    e.preventDefault(); //förhindrar att sidan laddas om.

    if(username === correctname && password === correctpassword){ //Om namn och lösenord är rätt
        form.style.display = "none";
        button.style.display = "block";
        welcome.style.display = "block";
        welcome.textContent = "Välkommen " + correctname + " du är nu inloggad";
        localStorage.setItem("inloggad", "true"); //Kommer ihåg användaren i webben/lokala sidan.
    } //Om rätt så körs funktioner som tar bort login menyn, en välkomms text och även sparar användaren med true funktionen.
    else{
        message.style.display = "block";
        message.textContent = "Felaktiga inloggningsuppgifter";
    }
}

function logout() {
    form.style.display = "block";
    button.style.display = "none";
    message.textContent = "";
    welcome.style.display = "none";
    localStorage.clear(); //Tar bort all data. Antar man kunde använda sig av removeItem() istället. Men spelar ingen roll i denna uppgiften.
}
