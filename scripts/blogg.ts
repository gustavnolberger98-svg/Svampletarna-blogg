const correctname: string = "Kalle";
const correctpassword: string = "qwe123";

function init(): void {
    const buttonRef = document.querySelector<HTMLButtonElement>("#logout");
    const formRef = document.querySelector<HTMLFormElement>("#form");
    const bloggFormRef = document.querySelector<HTMLFormElement>("#bloggForm");

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
function checkLogin(): void { 
    const formRef = document.querySelector<HTMLFormElement>("#form");
    const buttonRef = document.querySelector<HTMLButtonElement>("#logout");
    const welcomeRef = document.querySelector<HTMLParagraphElement>("#welcome");
    const loginMessageRef = document.querySelector<HTMLParagraphElement>("#loginMessage");

    const inloggad: string | null = localStorage.getItem("inloggad");
    const username: string | null = localStorage.getItem("username");
    const bloggFormRef = document.querySelector<HTMLFormElement>("#bloggForm");    

    if (formRef && buttonRef && welcomeRef && bloggFormRef && loginMessageRef) { // Kontrollera att referenserna inte är null innan du använder dem.

        if (inloggad === "true") { // Om användaren är inloggad, döljs formuläret och knappen visas.
            formRef.style.display = "none";
            buttonRef.style.display = "block";
            welcomeRef.style.display = "block";
            bloggFormRef.style.display = "block";
            loginMessageRef.style.display = "none";
            
            welcomeRef.textContent = `Välkommen ${username}!`;
            welcomeRef.textContent = `Du kan nu skriva ett inlägg`;
        } else { // Om användaren inte är inloggad, visas formuläret och knappen döljs.
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
function login(e: SubmitEvent): void { 
    e.preventDefault(); // Förhindrar att formuläret skickas och sidan laddas om.

    const usernameRef = document.querySelector<HTMLInputElement>("#username");
    const passwordRef = document.querySelector<HTMLInputElement>("#password");
    const messageRef = document.querySelector<HTMLParagraphElement>("#message");

    if (usernameRef && passwordRef && messageRef) { // Kontrollera att referenserna inte är null innan du använder dem.
        const username: string = usernameRef.value;
        const password: string = passwordRef.value;

        if (
            username === correctname && password === correctpassword
        ) {
            localStorage.setItem("inloggad", "true");
            localStorage.setItem("username", username);
            
            messageRef.textContent = "";
            
            checkLogin();

        } else {
            messageRef.style.display = "block";
            messageRef.textContent = "Fel användarnamn eller lösenord!";
        }
    }
}
///////////////////////////////////
//Funktino för hantera utloggning//
///////////////////////////////////
function logout(): void { 
    const formRef = document.querySelector<HTMLFormElement>("#form"); // Hämtar referensen till formuläret.
    const messageRef = document.querySelector<HTMLParagraphElement>("#message");

    localStorage.removeItem("inloggad"); // Tar bort inloggningsstatus från localStorage.
    localStorage.removeItem("username"); // Tar bort användarnamn och inloggningsstatus från localStorage.
    if (formRef) {
        formRef.reset();// Återställer formuläret till sitt ursprungliga skick.
    }

    if (messageRef) {
        messageRef.style.display = "none";
    }

    checkLogin();
}

function myPublish(event: SubmitEvent): void {
    event.preventDefault();
    
    const titleRef = document.querySelector<HTMLInputElement>("#title");
    const textRef = document.querySelector<HTMLTextAreaElement>("#text");

    const user: string | null = localStorage.getItem("username");

    if (titleRef && textRef && user) {
        const title: string = titleRef.value.trim();
        const text: string = textRef.value.trim();
        
        if(title === "" || text === "") {
            return; 
        }

        const newPublish: BloggPublish = {
            title: title,
            user: user,
            text: text,
            date: new Date().toLocaleDateString("sv-SE")
        };

        const savedPublishes: string | null = localStorage.getItem("bloggInlagg");

        const publishes: BloggPublish[] = savedPublishes
            ? JSON.parse(savedPublishes) as BloggPublish[]
            : [];

        publishes.push(newPublish);

        localStorage.setItem("bloggInlagg", JSON.stringify(publishes));

        showPublishes();

        titleRef.value = "";
        textRef.value = "";
    }
}

function showPublishes(): void {
    const bloggPrintRef = document.querySelector<HTMLElement>("#bloggPrint");

    if (!bloggPrintRef) {
        return;
    }

    const savedPublishes: string | null = localStorage.getItem("bloggInlagg");

    const publishes: BloggPublish[] = savedPublishes
    ? JSON.parse(savedPublishes) as BloggPublish[]
    : [];

    bloggPrintRef.replaceChildren(); 

    publishes.forEach((publish: BloggPublish) => {
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


interface BloggPublish {
    title: string;
    user: string;
    text: string;
    date: string;

}

