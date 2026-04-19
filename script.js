const themeToggle = document.getElementById("themeToggle");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const counter = document.getElementById("counter");
const cards = document.querySelectorAll(".card");

let requestCount = 0;

/**
 * Қараңғы және ашық режимді ауыстырады
 */
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "Ашық режим";
  } else {
    themeToggle.textContent = "Қараңғы режим";
  }
});

/**
 * Хабарламаны чатқа қосады
 * @param {string} text
 * @param {string} sender
 */
function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Тестік ЖИ жауабы
 * @param {string} message
 * @returns {string}
 */
function fakeAIResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("сәлем") ||
    lowerMessage.includes("салам") ||
    lowerMessage.includes("сәлеметсіз")
  ) {
    return "Сәлем! Мен тестік ЖИ-чатпын. Сұрағыңызды қойыңыз.";
  }

  if (lowerMessage.includes("html")) {
    return "HTML — веб-беттің құрылымын жасауға арналған белгілеу тілі.";
  }

  if (lowerMessage.includes("css")) {
    return "CSS — веб-беттің сыртқы көрінісін, түсін, өлшемін және орналасуын реттейді.";
  }

  if (lowerMessage.includes("javascript") || lowerMessage.includes("js")) {
    return "JavaScript — веб-бетке интерактивтілік қосатын бағдарламалау тілі.";
  }

  if (lowerMessage.includes("chatgpt")) {
    return "ChatGPT — мәтін құрастыруға, сұрақтарға жауап беруге және кодты түсіндіруге көмектесетін ЖИ құралы.";
  }

  if (lowerMessage.includes("copilot")) {
    return "GitHub Copilot — код жазу кезінде автоматты ұсыныстар беретін ЖИ-көмекші.";
  }

  if (lowerMessage.includes("claude")) {
    return "Claude — мәтін талдау мен құрылымды жауап беруге арналған жасанды интеллект жүйесі.";
  }

  return `Сіздің сұрағыңыз: "${message}". Бұл тестік ЖИ жауабы.`;
}

/**
 * Жіберу батырмасы
 */
sendBtn.addEventListener("click", () => {
  const message = userInput.value.trim();

  if (!message) {
    alert("Алдымен сұрақ енгізіңіз.");
    return;
  }

  addMessage(message, "user");
  requestCount++;
  counter.textContent = requestCount;

  const reply = fakeAIResponse(message);
  addMessage(reply, "bot");

  userInput.value = "";
});

/**
 * Enter пернесімен хабар жіберу
 */
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

/**
 * Карточкаларды scroll кезінде анимациямен шығару
 */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

cards.forEach((card) => observer.observe(card));
