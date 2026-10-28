const correctname: string = "Kalle";
const correctpassword: string = "qwe123";

function init(): void {//Kontrollerar att saker hittas innan användning, samt ser till att rätt funktioner kan köras.
    //Hämtar Från HTML.
    const buttonRef = document.querySelector<HTMLButtonElement>("#logout");
    const formRef = document.querySelector<HTMLFormElement>("#form");
    const bloggFormRef = document.querySelector<HTMLFormElement>("#bloggForm");
    //Kontrollerar att det finns.
    if (buttonRef && formRef) {
        buttonRef.style.display = "none"; // Döljer knappen för tillfället.
        checkLogin(); //Funktionen körs och kollar om användaren är inloggad.
        
        formRef.addEventListener("submit", login); //Skapar ett event för loginknappen
        buttonRef.addEventListener("click", logout); //Skapar ett event för logga ut knappen.
    }
    if (bloggFormRef) { //Om formuläret finns så läggs ett event till.
        bloggFormRef.addEventListener("submit", myPublish);
    }
    showPublishes(); //Hämtar och visar blogginläggen som finns sparade.
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
    const bloggRef = document.querySelector<HTMLElement>("#blogg");    

    if (formRef && buttonRef && welcomeRef && bloggRef && loginMessageRef) { // Kontrollera att referenserna inte är null innan du använder dem.

        if (inloggad === "true") { // Om användaren är inloggad, döljs formuläret och knappen visas.
            formRef.style.display = "none";
            buttonRef.style.display = "block";
            welcomeRef.style.display = "block";
            bloggRef.style.display = "block";
            loginMessageRef.style.display = "none";
            
            welcomeRef.textContent = `Välkommen ${username}!`;
            welcomeRef.textContent = `Du kan nu skriva ett inlägg`;
        } else { // Om användaren inte är inloggad, visas formuläret och knappen döljs.
            formRef.style.display = "block";
            buttonRef.style.display = "none";
            welcomeRef.style.display = "none";
            bloggRef.style.display = "none";
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
            
            messageRef.textContent = ""; //Hade problem att om jag först fick felmeddelande så visades det efter lyckat inlogg.
            
            checkLogin(); //Kör funktionen checklogin.
            showPublishes(); //Behövde ladda om sidan efter lyckad inloggning, därför las detta till här som kör funktionen.

        } else { //Om fel lösenord och användarnamn så visas meddelande.
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

    if (messageRef) { //Döljer eventuellt felmeddelande.
        messageRef.style.display = "none";
    }

    checkLogin(); //I med att man blir utloggad så kan jag köra checklogin funktionen igen.
    showPublishes(); //Samma sak som innan, loggade jag ut så visades fortfarande kommentera inlägg.
}
//////////////////////////////////////
//funmktion för att publicera inlägg//
//////////////////////////////////////
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
/////////////////////////////////////
//Funktion för att skriva ut inlägg//
/////////////////////////////////////
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

    publishes.forEach((publish: BloggPublish, index: number) => {
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

        const commentHeading = document.createElement("h4");
        commentHeading.textContent = "Kommentarer:";
        article.appendChild(commentHeading);

        const comments: BloggComment[] = publish.comments ?? [];

        comments.forEach((comment:BloggComment) => {
            const commentArticle = document.createElement("article");
            const commentAuthor = document.createElement("p");
            const commentText = document.createElement("p");
            const commentDate = document.createElement("p");
            commentArticle.className = "comment-art";
            
            commentAuthor.textContent = `Inlägg skrivet av: ${comment.user}`;
            commentText.textContent = comment.text;
            commentDate.textContent = comment.date;

            commentArticle.append(commentAuthor, commentText, commentDate);
            
            article.appendChild(commentArticle);  
        });
        const inloggad: string | null = localStorage.getItem("inloggad");
        

    if (inloggad === "true") {
        const commentForm = document.createElement("form");
        const commentInput = document.createElement("textarea");
        const commentButton = document.createElement("button");
        commentButton.className = "comment-button";
        commentInput.className = "comment-area";

        commentInput.placeholder = "Skriv en kommentar";
        commentInput.required = true;

        commentButton.textContent = "Kommentera";
        commentButton.type = "submit";

        commentForm.append(commentInput, commentButton);

        commentForm.addEventListener("submit", (event: SubmitEvent) => {
            commentPub(event, index, commentInput);
            }
        );
        article.appendChild(commentForm);    
        
    }
    else {
            const loginInfo = document.createElement("p");
            loginInfo.textContent = "Logga in För att kommentera.";
            article.appendChild(loginInfo);
        }
        bloggPrintRef.appendChild(article);
    });
}

//////////////////////////////////////
//Funktion för att kommentera inlägg//
//////////////////////////////////////
function commentPub(
    event: SubmitEvent,
    publishIndex: number,
    commentInput: HTMLTextAreaElement
): void {
    event.preventDefault();

    const inloggad: string | null = localStorage.getItem("inloggad");
    const user: string | null = localStorage.getItem("username");

    if (inloggad !== "true" || !user) {
        return;
    }

    const text: string = commentInput.value.trim();

    if (text === "") {
        return;
    }

    const savedPublishes: string | null = localStorage.getItem("bloggInlagg"); //Hämtar blogginläggen
    const publishes: BloggPublish[] = savedPublishes
        ? JSON.parse(savedPublishes) as BloggPublish[]
        : [];
    const publish: BloggPublish | undefined = publishes[publishIndex];


    if (!publish) {
        return;
    }

    const newComment: BloggComment = {
        user: user,
        text: text,
        date: new Date().toLocaleDateString("sv-SE")
    };
    
    if (!publish.comments) {
        publish.comments = [];
    }

    publish.comments.push(newComment);

    localStorage.setItem("bloggInlagg", JSON.stringify(publishes));

    showPublishes();

}


interface BloggPublish {
    title: string;
    user: string;
    text: string;
    date: string;
    comments?: BloggComment[];
}

interface BloggComment {
    user: string;
    text: string;
    date: string;
}
