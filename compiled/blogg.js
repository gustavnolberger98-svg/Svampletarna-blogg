"use strict";
const correctname = "Kalle";
const correctpassword = "qwe123";
function init() {
    const buttonRef = document.querySelector("#logout");
    const formRef = document.querySelector("#form");
    const bloggFormRef = document.querySelector("#bloggForm");
    if (buttonRef && formRef) {
        buttonRef.style.display = "none"; // Döljer knappen för tillfället.
        checkLogin();
        formRef.addEventListener("submit", login);
        buttonRef.addEventListener("click", logout);
    }
    if (bloggFormRef) {
        bloggFormRef.addEventListener("submit", myPublish);
    }
    showPublishes();
}
window.onload = init; // Kör init-funktionen när sidan har laddats.
///////////////////////////////////////////////////////////////////
//Funktion som kontrollerar om användaren är inloggad eller inte.//
///////////////////////////////////////////////////////////////////
function checkLogin() {
    const formRef = document.querySelector("#form");
    const buttonRef = document.querySelector("#logout");
    const welcomeRef = document.querySelector("#welcome");
    const loginMessageRef = document.querySelector("#loginMessage");
    const inloggad = localStorage.getItem("inloggad");
    const username = localStorage.getItem("username");
    const bloggFormRef = document.querySelector("#bloggForm");
    if (formRef && buttonRef && welcomeRef && bloggFormRef && loginMessageRef) { // Kontrollera att referenserna inte är null innan du använder dem.
        if (inloggad === "true") { // Om användaren är inloggad, döljs formuläret och knappen visas.
            formRef.style.display = "none";
            buttonRef.style.display = "block";
            welcomeRef.style.display = "block";
            bloggFormRef.style.display = "block";
            loginMessageRef.style.display = "none";
            welcomeRef.textContent = `Välkommen ${username}!`;
            welcomeRef.textContent = `Du kan nu skriva ett inlägg`;
        }
        else { // Om användaren inte är inloggad, visas formuläret och knappen döljs.
            formRef.style.display = "block";
            buttonRef.style.display = "none";
            welcomeRef.style.display = "none";
            bloggFormRef.style.display = "none";
            loginMessageRef.style.display = "block";
        }
    }
}
/////////////////////////////////////
//Funktion som hanterar inloggning.//
/////////////////////////////////////
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
///////////////////////////////////
//Funktino för hantera utloggning//
///////////////////////////////////
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
function myPublish(event) {
    event.preventDefault();
    const titleRef = document.querySelector("#title");
    const textRef = document.querySelector("#text");
    const user = localStorage.getItem("username");
    if (titleRef && textRef && user) {
        const title = titleRef.value.trim();
        const text = textRef.value.trim();
        if (title === "" || text === "") {
            return;
        }
        const newPublish = {
            title: title,
            user: user,
            text: text,
            date: new Date().toLocaleDateString("sv-SE")
        };
        const savedPublishes = localStorage.getItem("bloggInlagg");
        const publishes = savedPublishes
            ? JSON.parse(savedPublishes)
            : [];
        publishes.push(newPublish);
        localStorage.setItem("bloggInlagg", JSON.stringify(publishes));
        showPublishes();
        titleRef.value = "";
        textRef.value = "";
    }
}
function showPublishes() {
    const bloggPrintRef = document.querySelector("#bloggPrint");
    if (!bloggPrintRef) {
        return;
    }
    const savedPublishes = localStorage.getItem("bloggInlagg");
    const publishes = savedPublishes
        ? JSON.parse(savedPublishes)
        : [];
    bloggPrintRef.replaceChildren();
    publishes.forEach((publish) => {
        const article = document.createElement("article");
        const heading = document.createElement("h2");
        const author = document.createElement("p");
        const content = document.createElement("p");
        const date = document.createElement("p");
        heading.textContent = publish.title;
        author.textContent = `Skrivet av: ${publish.user}`;
        content.textContent = publish.text;
        date.textContent = publish.date;
        article.append(heading, author, content, date);
        bloggPrintRef.appendChild(article);
    });
}
