const API_KEY = "";

const themeToggle = document.getElementById("themeToggle");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const counter = document.getElementById("counter");
const cards = document.querySelectorAll(".card");

let requestCount = 0;

/**
 * Переключает тёмную и светлую тему
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
 * Добавляет сообщение в чат
 * @param {string} text
 * @param {"user"|"bot"} sender
 */
function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Отправляет запрос в OpenAI API
 * @param {string} message
 * @returns {Promise<string>}
 */
async function sendMessageToAI(message) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Ты полезный ИИ-помощник. Отвечай кратко и понятно, желательно на казахском языке."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("API error:", data);
    throw new Error(data.error?.message || "Ошибка запроса к API");
  }

  return data.choices[0].message.content;
}

/**
 * Обрабатывает отправку сообщения
 */
async function handleSendMessage() {
  const message = userInput.value.trim();

  if (!message) {
    alert("Алдымен сұрақ енгізіңіз.");
    return;
  }

  if (!API_KEY || API_KEY === "") {
    alert("API кілтін script.js файлына енгізіңіз.");
    return;
  }

  addMessage(message, "user");
  userInput.value = "";

  requestCount++;
  counter.textContent = requestCount;

  addMessage("Жауап жазылып жатыр...", "bot");
  const loadingMessage = chatBox.lastChild;

  try {
    const reply = await sendMessageToAI(message);
    loadingMessage.textContent = reply;
  } catch (error) {
    loadingMessage.textContent = "Қате шықты: " + error.message;
    console.error(error);
  }
}

sendBtn.addEventListener("click", handleSendMessage);

/**
 * Отправка по Enter
 */
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSendMessage();
  }
});

/**
 * Анимация карточек при прокрутке
 */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

cards.forEach((card) => observer.observe(card));
