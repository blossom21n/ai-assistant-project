const themeToggle = document.getElementById("themeToggle");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const counter = document.getElementById("counter");
const cards = document.querySelectorAll(".card");

let requestCount = 0;

/**
 * Қараңғы және ашық тақырыпты ауыстырады
 */
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

/**
 * Хабарламаны чат терезесіне қосады
 * @param {string} text - көрсетілетін мәтін
 * @param {string} sender - user немесе bot
 */
function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Тестік ЖИ жауабын қайтарады
 * @param {string} message - пайдаланушының сұрағы
 * @returns {string}
 */
function fakeAIResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("сәлем") || lowerMessage.includes("салам") || lowerMessage.includes("сәлеметсіз")) {
    return "Сәлем! Мен тестік ЖИ-чатпын. Сұрағыңызды жазыңыз.";
  }

  if (lowerMessage.includes("html")) {
    return "HTML — веб-беттің құрылымын жасауға арналған белгілеу тілі.";
  }

  if (lowerMessage.includes("css")) {
    return "CSS — веб-беттің сыртқы көрінісін, түсін, өлшемін және орналасуын баптайды.";
  }

  if (lowerMessage.includes("javascript") || lowerMessage.includes("js")) {
    return "JavaScript — веб-бетке интерактивтілік қосатын бағдарламалау тілі.";
  }

  if (lowerMessage.includes("chatgpt")) {
    return "ChatGPT — мәтін құрастыруға, сұрақтарға жауап беруге және кодты түсіндіруге көмектесетін ЖИ құралы.";
  }

  if (lowerMessage.includes("copilot")) {
    return "GitHub Copilot — кодты автоматты түрде ұсынатын және толықтыратын ЖИ-көмекші.";
  }

  if (lowerMessage.includes("claude")) {
    return "Claude — мәтін талдауға және құрылымды жауап беруге арналған ЖИ жүйесі.";
  }

  return `Сіздің сұрағыңыз: "${message}". Бұл тестік ЖИ жауабы.`;
}

/**
 * Пайдаланушы сұрағын өңдейді
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
 * Enter пернесімен жіберу
 */
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

/**
 * Карточкаларды scroll кезінде шығару анимациясы
 */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

cards.forEach((card) => observer.observe(card));