const API_KEY = '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';

const themeToggle = document.getElementById('theme-toggle');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const counter = document.getElementById('counter');
const cards = document.querySelectorAll('.card');

let requestCount = 0;

/**
 * Тақырыпты ауыстырады.
 * Параметр қабылдамайды.
 */
function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';

    if (isDark) {
        document.body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙 Қараңғы тақырып';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️ Ашық тақырып';
        localStorage.setItem('theme', 'dark');
    }
}

/**
 * Сақталған тақырыпты жүктейді.
 * Параметр қабылдамайды.
 */
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️ Ашық тақырып';
    }
}

/**
 * Чатқа хабарлама қосады.
 * @param {string} text - Көрсетілетін мәтін
 * @param {string} type - user немесе ai
 */
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + type + '-message';
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Сұраныс санауышын жаңартады.
 * Параметр қабылдамайды.
 */
function updateCounter() {
    requestCount += 1;
    counter.textContent = requestCount;
}

/**
 * Groq API-ге сұраныс жібереді.
 * @param {string} message - Пайдаланушының хабары
 * @returns {Promise<string>} - ЖИ жауабы
 */
async function sendToGroq(message) {
    const response = await fetch('[api.groq.com](https://api.groq.com/openai/v1/chat/completions)', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY
        },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'system',
                    content: 'Сен қазақ тілінде жауап беретін пайдалы ЖИ-ассистентсің. Қысқа, нақты және түсінікті жауап бер.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 400
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error('API қатесі: ' + response.status + ' - ' + errorText);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('API жауабы дұрыс форматта емес');
    }

    return data.choices[0].message.content;
}

/**
 * Хабарламаны өңдеп, ЖИ-ге жібереді.
 * Параметр қабылдамайды.
 */
async function sendMessage() {
    const message = userInput.value.trim();

    if (!message) {
        return;
    }

    if (API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
        addMessage('API кілтін script.js файлына енгізіңіз.', 'ai');
        return;
    }

    addMessage(message, 'user');
    userInput.value = '';
    sendBtn.disabled = true;
    sendBtn.textContent = 'Жүктелуде...';
    updateCounter();

    try {
        const reply = await sendToGroq(message);
        addMessage(reply, 'ai');
    } catch (error) {
        addMessage('❌ Қате: ' + error.message, 'ai');
        console.error(error);
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Жіберу';
        userInput.focus();
    }
}

/**
 * Карточкаларға scroll анимациясын қосады.
 * Параметр қабылдамайды.
 */
function setupCardAnimations() {
    const observer = new IntersectionObserver(function(entries, observerInstance) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observerInstance.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    cards.forEach(function(card) {
        observer.observe(card);
    });
}

themeToggle.addEventListener('click', toggleTheme);
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

loadSavedTheme();
setupCardAnimations();
