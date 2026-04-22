// ========================================
// API конфигурациясы
// ========================================
const API_KEY = 'xai-b9M5cl3ouywhBewaAixqVZYs5Lct0O4Zrrv77vOyoNUOwN6zEbaZJn9JsrNK2mFLKGdQsg7fft9V91Gp';

// ========================================
// DOM элементтері
// ========================================
const themeToggle = document.getElementById('theme-toggle');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const counter = document.getElementById('counter');
const cards = document.querySelectorAll('.card');

let requestCount = 0;

// ========================================
// Тақырып ауыстыру функциясы
// Бұл функция ашық және қараңғы режим арасында ауыстырады
// ========================================
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

// ========================================
// Сақталған тақырыпты жүктеу
// ========================================
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️ Ашық тақырып';
    }
}

// ========================================
// Чатқа хабарлама қосу
// @param {string} text - Хабарлама мәтіні
// @param {string} type - user немесе ai
// ========================================
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + type + '-message';
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ========================================
// Сұраныс санауышын жаңарту
// ========================================
function updateCounter() {
    requestCount++;
    counter.textContent = requestCount;
}

// ========================================
// Grok / xAI API-ге сұраныс жіберу
// @param {string} message - Пайдаланушы хабарламасы
// @returns {Promise<string>} - ЖИ жауабы
// ========================================
async function sendToGrok(message) {
    const response = await fetch('[api.x.ai](https://api.x.ai/v1/chat/completions)', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY
        },
        body: JSON.stringify({
            model: 'grok-2-latest',
            messages: [
                {
                    role: 'system',
                    content: 'Сен пайдалы ЖИ-ассистентсің. Пайдаланушыға қазақ тілінде қысқа әрі түсінікті жауап бер.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 300
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error('API қатесі: ' + response.status + ' - ' + errorText);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Жауап форматы дұрыс емес');
    }

    return data.choices[0].message.content;
}

// ========================================
// Хабарлама жіберу функциясы
// ========================================
async function sendMessage() {
    const message = userInput.value.trim();

    if (!message) {
        return;
    }

    if (API_KEY === 'YOUR_XAI_API_KEY_HERE') {
        addMessage('⚠️ API кілтін script.js файлына енгізіңіз.', 'ai');
        return;
    }

    addMessage(message, 'user');
    userInput.value = '';
    sendBtn.disabled = true;
    sendBtn.textContent = 'Жүктелуде...';

    try {
        updateCounter();
        const aiResponse = await sendToGrok(message);
        addMessage(aiResponse, 'ai');
    } catch (error) {
        console.error(error);
        addMessage('❌ Қате: ' + error.message, 'ai');
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Жіберу';
    }
}

// ========================================
// Карточкалар анимациясы
// ========================================
function setupCardAnimations() {
    const observer = new IntersectionObserver(function(entries, observerInstance) {
        entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function() {
                    entry.target.classList.add('visible');
                }, index * 150);

                observerInstance.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(function(card) {
        observer.observe(card);
    });
}

// ========================================
// Оқиғалар
// ========================================
themeToggle.addEventListener('click', toggleTheme);
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// ========================================
// Бет жүктелгенде
// ========================================
loadSavedTheme();
setupCardAnimations();
