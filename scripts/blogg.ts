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
function myPublish(event: SubmitEvent): void { //Gör så inte sidan laddas om.
    event.preventDefault();
    
    const titleRef = document.querySelector<HTMLInputElement>("#title"); //hämtar rubrik och innehåll.
    const textRef = document.querySelector<HTMLTextAreaElement>("#text");

    const user: string | null = localStorage.getItem("username"); //Hämtar sparade namnet från local.

    if (titleRef && textRef && user) { //Kontrollerar att allt som man hämtar finns.
        const title: string = titleRef.value.trim(); //Hittade en funktion som sorterar bort onödiga saker som mellanslag i början och slutet.
        const text: string = textRef.value.trim();
        
        if(title === "" || text === "") { 
            return; 
        } //Om inte rubrik och innehåll finns så avbryts processen.

        const newPublish: BloggPublish = { //skapar ett objekt för blogginlägget.
            title: title,
            user: user,
            text: text,
            date: new Date().toLocaleDateString("sv-SE")
        };

        const savedPublishes: string | null = localStorage.getItem("bloggInlagg"); //kollar och hämtar gamla sparade inlägg.

        const publishes: BloggPublish[] = savedPublishes //om det finns sparat så omvandlas det till en array.
            ? JSON.parse(savedPublishes) as BloggPublish[]
            : []; //annars skapas en tom array.

        publishes.push(newPublish); //Till för att att sortera arrayen, alltså lägga nytt inlägg sist i skapade arrayen.

        localStorage.setItem("bloggInlagg", JSON.stringify(publishes)); //Sparar arrayen, gör även om det till en JSON-sträng.

        showPublishes(); //För att visa nya inlägget.

        titleRef.value = ""; //Tömmer inläggs formuläret.
        textRef.value = "";
    }
}
/////////////////////////////////////////////////////////////////////////////////
//Funktion för att skriva ut inlägg och för att kommentera inlägg ska dyka upp.//
/////////////////////////////////////////////////////////////////////////////////
function showPublishes(): void {
    const bloggPrintRef = document.querySelector<HTMLElement>("#bloggPrint"); //Elementer för blogginlägget.

    if (!bloggPrintRef) { //samma som innan, avbryter om elementet för blogginlägget saknas.
        return;
    }

    const savedPublishes: string | null = localStorage.getItem("bloggInlagg"); //Hämtar alla sparade blogginlägg från local.

    const publishes: BloggPublish[] = savedPublishes //samma som innan. Omvandlar till en array.
    ? JSON.parse(savedPublishes) as BloggPublish[]
    : []; //Om det redan finns sparat så används en tom array.

    bloggPrintRef.replaceChildren(); //förhindrar att Samma inlägg visas flera gånger, Genom att jag tömmer först den gamla visningen.

    publishes.forEach((publish: BloggPublish, index: number) => { //Går igenom alla blogginlägg med forEach, index sätter den på rätt plats i arrayen.
        const article = document.createElement("article");
        const heading = document.createElement("h2");
        const author = document.createElement("p");
        const content = document.createElement("p");
        const date = document.createElement("p"); //Skapar Element

        heading.textContent = publish.title;
        author.textContent = `Skrivet av: ${publish.user}`;
        content.textContent = publish.text;
        date.textContent = publish.date; //Fyller i elementen med blogginlägget.

        article.append(heading, author, content, date); //Lägger till i article.

        const commentHeading = document.createElement("h4");
        commentHeading.textContent = "Kommentarer:";
        article.appendChild(commentHeading); //Rubrik för visa att här kan du kommentera.

        const comments: BloggComment[] = publish.comments ?? []; //Hämtar kommentarer. Finns inga kommentarer så är det en tom array.

        comments.forEach((comment:BloggComment) => { //Visar alla kommentarer.
            const commentArticle = document.createElement("article");
            const commentAuthor = document.createElement("p");
            const commentText = document.createElement("p");
            const commentDate = document.createElement("p");
            commentArticle.className = "comment-art"; //Satt en class på artikel för att kunna designa i CSS.
            
            commentAuthor.textContent = `Inlägg skrivet av: ${comment.user}`;
            commentText.textContent = comment.text;
            commentDate.textContent = comment.date; //Användare och datum för kommentaren.

            commentArticle.append(commentAuthor, commentText, commentDate); //Gör innehållet från kommentaren till ett element. +Datum och Användare.
            
            article.appendChild(commentArticle); //Ser till att kommentaren kommer under rätt inlägg. Det gjorde den inte först utan detta.
        });
        const inloggad: string | null = localStorage.getItem("inloggad"); //Är användaren inloggad?
        

    if (inloggad === "true") { //om användaren är inloggad så skapas kommentar formuläret.
        const commentForm = document.createElement("form");
        const commentInput = document.createElement("textarea");
        const commentButton = document.createElement("button");
        commentButton.className = "comment-button";
        commentInput.className = "comment-area"; //sätter i class för att designa.

        commentInput.placeholder = "Skriv en kommentar";
        commentInput.required = true;

        commentButton.textContent = "Kommentera";
        commentButton.type = "submit";

        commentForm.append(commentInput, commentButton); //Ser till att kommentar formuläret hamnar i Article. Alltså i blogginläggsboxen.

        commentForm.addEventListener("submit", (event: SubmitEvent) => {
            commentPub(event, index, commentInput);
            } //Event för kommentera knappen. Index för att hitta rätt blogginlägg.
        );
        article.appendChild(commentForm); //Lägger kommentarfältet på rätt plats under blogginlägget.  
        
    }
    else { //Om användaren inte är inloggad så ska det inte gå kommentera.
            const loginInfo = document.createElement("p");
            loginInfo.textContent = "Logga in För att kommentera.";
            article.appendChild(loginInfo); //Visar icke inloggad att du måste logga in för att kunna komma åt kommentar formuläret.
        }
        bloggPrintRef.appendChild(article);
    });
}

//////////////////////////////////////////////////////////////////////////////////////
//Funktion för att spara kommentarer, kontrollera den, koppla till rätt blogginlägg.//
//////////////////////////////////////////////////////////////////////////////////////
function commentPub( 
    event: SubmitEvent,
    publishIndex: number,
    commentInput: HTMLTextAreaElement
): void {
    event.preventDefault();

    const inloggad: string | null = localStorage.getItem("inloggad"); //Kollar om man är inloggad.
    const user: string | null = localStorage.getItem("username"); //Var tvungen att ladda om sidan efter inloggad för att kunna kommentera. Detta hjälpte att lägga till.

    if (inloggad !== "true" || !user) { //samma som tidigare, avbryter om den inte hittar användarnamn eller lyckad inloggning.
        return;
    }

    const text: string = commentInput.value.trim(); //Hämtar kommentartexten. Samt med trim tar den bort onödiga mellanslag.

    if (text === "") { //kollar om kommentaren är tom.
        return;
    }

    const savedPublishes: string | null = localStorage.getItem("bloggInlagg"); //Hämtar de sparade blogginläggen
    const publishes: BloggPublish[] = savedPublishes //Igen, omvandlar json till array.
        ? JSON.parse(savedPublishes) as BloggPublish[]
        : [];
    const publish: BloggPublish | undefined = publishes[publishIndex]; //Hämtar blogginlägget som användaren kommenterat.

    if (!publish) { 
        return;
    }

    const newComment: BloggComment = { //Nytt objekt för kommentarer.
        user: user,
        text: text,
        date: new Date().toLocaleDateString("sv-SE")
    };
    
    if (!publish.comments) {
        publish.comments = [];
    }

    publish.comments.push(newComment); //Lägger till i kommentararrayen.

    localStorage.setItem("bloggInlagg", JSON.stringify(publishes)); //Sparar blogginlägget med kommentaren i med att det kommer en ny kommentar.

    showPublishes(); //Läser in blogginläggen igen för att kommentaren ska synas.

}

//Sätter datatyper på alla uppgifter i blogginlägg.
interface BloggPublish {
    title: string;
    user: string;
    text: string;
    date: string;
    comments?: BloggComment[]; //? betyder att comments är valfritt och inget måste.
}
//Sätter datatyper på alla uppgifter i kommentarer.
interface BloggComment {
    user: string;
    text: string;
    date: string;
}
