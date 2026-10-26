"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
window.onload = init;
function checkLogin() {
    const formRef = document.querySelector("#form");
    const buttonRef = document.querySelector("#logout");
    const welcomeRef = document.querySelector("#welcome");
    const inloggad = localStorage.getItem("inloggad");
    const username = localStorage.getItem("username");
    if (formRef && buttonRef && welcomeRef) {
        if (inloggad === "true") {
            formRef.style.display = "none";
            buttonRef.style.display = "block";
            welcomeRef.style.display = "block";
            welcomeRef.textContent = `Välkommen ${username}!`;
        }
        else {
            formRef.style.display = "block";
            buttonRef.style.display = "none";
            welcomeRef.style.display = "none";
        }
    }
}
function login(e) {
    e.preventDefault();
    const usernameRef = document.querySelector("#username");
    const passwordRef = document.querySelector("#password");
    const messageRef = document.querySelector("#message");
    if (usernameRef && passwordRef && messageRef) {
        const username = usernameRef.value;
        const password = passwordRef.value;
        if (username === correctname &&
            password === correctpassword) {
            localStorage.setItem("inloggad", "true");
            localStorage.setItem("username", username);
            messageRef.textContent = `Välkommen ${username}!`;
            checkLogin();
        }
        else {
            messageRef.style.display = "block";
            messageRef.textContent = "Fel användarnamn eller lösenord!";
        }
    }
}
function logout() {
    const formRef = document.querySelector("#form");
    const messageRef = document.querySelector("#message");
    localStorage.removeItem("inloggad");
    localStorage.removeItem("username");
    if (formRef) {
        formRef.reset();
    }
    if (messageRef) {
        messageRef.style.display = "none";
    }
    checkLogin();
}
//# sourceMappingURL=blogg.js.map