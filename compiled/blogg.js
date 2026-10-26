"use strict";
const correctname = "Kalle";
const correctpassword = "qwe123";
function init() {
    const buttonRef = document.querySelector("#logout");
    const formRef = document.querySelector("form");
    if (buttonRef && formRef) {
        buttonRef.style.display = "none"; // Döljer knappen för tillfället.
        checkLogin();
        formRef.addEventListener("submit", login);
        buttonRef.addEventListener("click", logout);
    }
}
window.onload = init; // Kör init-funktionen när sidan har laddats.
function checkLogin() {
    const formRef = document.querySelector("#form");
    const buttonRef = document.querySelector("#logout");
    const welcomeRef = document.querySelector("#welcome");
    const inloggad = localStorage.getItem("inloggad");
    const username = localStorage.getItem("username");
    if (formRef && buttonRef && welcomeRef) { // Kontrollera att referenserna inte är null innan du använder dem.
        if (inloggad === "true") { // Om användaren är inloggad, döljs formuläret och knappen visas.
            formRef.style.display = "none";
            buttonRef.style.display = "block";
            welcomeRef.style.display = "block";
            welcomeRef.textContent = `Välkommen ${username}!`;
        }
        else { // Om användaren inte är inloggad, visas formuläret och knappen döljs.
            formRef.style.display = "block";
            buttonRef.style.display = "none";
            welcomeRef.style.display = "none";
        }
    }
}
function login(e) {
    e.preventDefault(); // Förhindrar att formuläret skickas och sidan laddas om.
    const usernameRef = document.querySelector("#username");
    const passwordRef = document.querySelector("#password");
    const messageRef = document.querySelector("#message");
    if (usernameRef && passwordRef && messageRef) { // Kontrollera att referenserna inte är null innan du använder dem.
        const username = usernameRef.value;
        const password = passwordRef.value;
        if (username === correctname && password === correctpassword) {
            localStorage.setItem("inloggad", "true");
            localStorage.setItem("username", username);
            messageRef.textContent = "";
            checkLogin();
        }
        else {
            messageRef.style.display = "block";
            messageRef.textContent = "Fel användarnamn eller lösenord!";
        }
    }
}
////////////////////////////////////////////////
//      Funktino för hantera utloggning       //
////////////////////////////////////////////////
function logout() {
    const formRef = document.querySelector("#form"); // Hämtar referensen till formuläret.
    const messageRef = document.querySelector("#message");
    localStorage.removeItem("inloggad"); // Tar bort inloggningsstatus från localStorage.
    localStorage.removeItem("username"); // Tar bort användarnamn och inloggningsstatus från localStorage.
    if (formRef) {
        formRef.reset(); // Återställer formuläret till sitt ursprungliga skick.
    }
    if (messageRef) {
        messageRef.style.display = "none";
    }
    checkLogin();
}
