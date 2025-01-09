//verific daca am reusit sa conectez codul de js la restul proiectului
console.log("JavaScript este conectat corect!");

//selectez elementele din DOM
const carImage = document.getElementById("car-image");
const changeColorBtn = document.getElementById("change-color");
const resetBtn = document.getElementById("reset");
const carSizeSlider = document.getElementById("car-size");
const output = document.getElementById("output");
const subtitle = document.getElementById("subtitle");
const canvas = document.getElementById("canvas");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const registerUsernameInput = document.getElementById("register-username");
const registerPasswordInput = document.getElementById("register-password");
const loginUsernameInput = document.getElementById("login-username");
const loginPasswordInput = document.getElementById("login-password");
const registerMessage = document.getElementById("register-message");
const loginMessage = document.getElementById("login-message");
const jsonResponse = document.getElementById("json-response");

// LocalStorage salveaza configurarea
const localStorageKey = "trabantConfig";
let config = {
    color: "original",
    size: 100,
};

//am 4 imagini pe  care le to schimb cand schimb culoarea
const carImages = {
    original: "trabant601.jpg",
    blue: "trabant601_blue.jpg",
    red: "trabant601_red.jpg",
    green: "trabant601_green.jpg",
};

//incarc configuratia din localStorage
function loadConfig() {
    const savedConfig = localStorage.getItem(localStorageKey);
    if (savedConfig) {
        config = JSON.parse(savedConfig);
        applyConfig();
    }
}

//aplic setarile curente
function applyConfig() {
    carImage.src = carImages[config.color];
    carImage.style.width = config.size + "%"; //latimea in procente
    carImage.style.height = "auto"; //pastrez proporptiile precedente
    carSizeSlider.value = config.size;
}

//salvez iar configuratia in localStorage
function saveConfig() {
    localStorage.setItem(localStorageKey, JSON.stringify(config));
}

//functia care imi schimba numele culorii (ca sa nu apara in engleza)
function translateColor(color) {
    const colorTranslations = {
        original: "originală",
        blue: "albastru",
        red: "roșu",
        green: "verde",
    };
    return colorTranslations[color] || color;
}

//eveniment => schimba culoarea masinii (schimba sursa imaginii)
changeColorBtn.addEventListener("click", () => {
    config.color = config.color === "blue" ? "red"
                : config.color === "red" ? "green"
                : config.color === "green" ? "original"
                : "blue";
    applyConfig();
    saveConfig();
    output.textContent = `Culoarea mașinii a fost schimbată la ${translateColor(config.color)}.`;
});

//eveniment => resetare
resetBtn.addEventListener("click", () => {
    config = { color: "original", size: 100 };
    applyConfig();
    saveConfig();
    output.textContent = "Configurarea a fost resetată.";
});

//eveniment => modificarea dimensiunii masinii
carSizeSlider.addEventListener("input", (e) => {
    config.size = e.target.value;
    applyConfig();
    saveConfig();
    output.textContent = `Dimensiunea mașinii este acum ${config.size}%.`;
});

// Load configurare la pornire
loadConfig();

//schimbarea aleatorie a textului la intervale de 3 secunde
//aici folosesc modificarea de proprietati si set interval
const messages = [
    "Acesta este unicul configurator de Trabant",
    "Spor la treabă!",
    "Începe să-ți personalizezi Trabantul!",
    "Este timpul să îți alegi culoarea preferată!"
];
let messageIndex = 0;
setInterval(() => {
    subtitle.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
}, 3000);

//functia de login
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const loginUsername = loginUsernameInput.value;
    const loginPassword = loginPasswordInput.value;

    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");

    if (loginUsername === savedUsername && loginPassword === savedPassword) {
        localStorage.setItem("isLoggedIn", "true");
        loginMessage.textContent = "Login reușit!";
        loginMessage.classList.add("login-message");

        //ascunde formularele de login si inregistrare daca login ul a fost de succes
        registerForm.style.display = "none";
        loginForm.style.display = "none";
        logoutBtn.style.display = "inline-block";  //abia dupa ce login ul a fost de succes
                                                    //afisez butonul de logout

        //modific textul de bun venit
        subtitle.textContent = "Bine ai venit!";

        //desenez unui patrat verde pe canvas\
        //daca login ul a fost de succes
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);  //curat canvasul anterior
        ctx.fillStyle = "green";  //setez culoarea verde
        ctx.fillRect(50, 50, 100, 100);  //desenez un patrat verde

        //generez numar aleatoriu
        //aici folosesc metode din clasa Math
        const randomNumber = Math.floor(Math.random() * 1000) + 1; // Generez numar aleator 1 - 1000

        //creez mesajul de bun venit
        const welcomeMessage = `Bun venit, ${loginUsername}. Astăzi s-au vândut ${randomNumber} mașini.`;

        //afisez mesajul timp de 5 secunde
        const welcomeElement = document.createElement("div");
        welcomeElement.textContent = welcomeMessage;
        welcomeElement.style.backgroundColor = "lightgreen";
        welcomeElement.style.padding = "10px";
        welcomeElement.style.margin = "10px";
        welcomeElement.style.borderRadius = "5px";
        document.body.appendChild(welcomeElement);

        //elimin mesajul după 5 secunde
        setTimeout(() => {
            welcomeElement.remove();
        }, 5000);

    } else {
        loginMessage.textContent = "Username sau parolă incorectă!";
        loginMessage.classList.remove("login-message");
    }
});

//functia de înregistrare
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const registerUsername = registerUsernameInput.value;
    const registerPassword = registerPasswordInput.value;

    //validarea parolei să fie de minim 3 caractere
    if (registerPassword.length < 3) {
        registerMessage.textContent = "Parola trebuie să aibă minim 3 caractere.";
        registerMessage.classList.add("error-message");
    } else {
        // Salvarea username și parolă în localStorage
        localStorage.setItem("username", registerUsername);
        localStorage.setItem("password", registerPassword);
        registerMessage.textContent = "Înregistrare reușită!";
        registerMessage.classList.remove("error-message");
    }
});

document.getElementById("load-models").addEventListener("click", () => {
    fetch("data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(models => {
            const modelsContainer = document.getElementById("models-container");
            modelsContainer.innerHTML = ""; //curat continutul anterior

            models.forEach(model => {
                const modelDiv = document.createElement("div");
                modelDiv.style.border = "1px solid black";
                modelDiv.style.margin = "10px";
                modelDiv.style.padding = "10px";
                modelDiv.innerHTML = `
                    <h3>${model.model} (${model.year})</h3>
                    <p>Motor: ${model.engine}</p>
                    <p>Combustibil: ${model.fuel}</p>
                    <p>Culori disponibile: ${model.colorOptions.join(", ")}</p>
                `;
                modelsContainer.appendChild(modelDiv);
            });
        })
        .catch(error => {
            console.error("Eroare la încărcarea modelelor:", error);
            alert("Eroare la încărcarea modelelor.");
        });
});

//selectez butonul de logout
const logoutBtn = document.getElementById("logout");

//functia de logout
logoutBtn.addEventListener("click", () => {

    //pot elimina informatiile din local LocalStorage

    //localStorage.removeItem("isLoggedIn");
    //localStorage.removeItem("username");
    //localStorage.removeItem("password");

    //revin la starea intiala a aplicatiei
    registerForm.style.display = "block";
    loginForm.style.display = "block";
    logoutBtn.style.display = "none";
    subtitle.textContent = "Te rog să te autentifici.";

    //curat canvasul si mesajele
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);  //curat canvasul

    //adaug mesaj de log logout
    alert("Ai fost deconectat.");
});
