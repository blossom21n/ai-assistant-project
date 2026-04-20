// ========================================
// API конфигурациясы
// ========================================

// МАҢЫЗДЫ: Өз API кілтіңізді осында қойыңыз
// OpenAI кілтін алу: [platform.openai.com](https://platform.openai.com/api-keys)
// Claude кілтін алу: [console.anthropic.com](https://console.anthropic.com/)
const API_KEY = '2e6208bbe3febe85b304bfde7aa8846aabda7a2ea98154caa66db16a8452de81';

// API провайдерін таңдаңыз: 'openai' немесе 'claude'
const API_PROVIDER = 'openai';

// ========================================
// DOM элементтерін алу
// ========================================
const themeToggle = document.getElementById('theme-toggle');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const counter = document.getElementById('counter');
const cards = document.querySelectorAll('.card');

// Сұраныстар санауышы
let requestCount = 0;

// ========================================
// Тақырып ауыстыру функциясы
// Бұл функция ашық және қараңғы тақырып арасында ауыстырады.
// localStorage-да таңдауды сақтайды.
// ========================================
function toggleTheme() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙 Қараңғы тақырып';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️ Ашық тақырып';
        localStorage.setItem('theme', 'dark');
    }
}

// ========================================
// Сақталған тақырыпты жүктеу
// Бет жүктелгенде пайдаланушының алдыңғы таңдауын қалпына келтіреді.
// ========================================
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️ Ашық тақырып';
    }
}

// ========================================
// Чатқа хабарлама қосу функциясы
// @param {string} text - Хабарлама мәтіні
// @param {string} type - Хабарлама түрі: 'user' немесе 'ai'
// ========================================
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    
    // Автоматты түрде төменге айналдыру
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ========================================
// Санауышты жаңарту функциясы
// Жіберілген сұраныстар санын көрсетеді.
// ========================================
function updateCounter() {
    requestCount++;
    counter.textContent = requestCount;
}

// ========================================
// OpenAI API-ге сұраныс жіберу
// @param {string} message - Пайдаланушы хабарламасы
// @returns {Promise<string>} - ЖИ жауабы
// ========================================
async function sendToOpenAI(message) {
    const response = await fetch('[api.openai.com](https://api.openai.com/v1/chat/completions)', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'Сен көмекші ассистентсің. Қазақ тілінде жауап бер.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 500
        })
    });

    if (!response.ok) {
        throw new Error(`API қатесі: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// ========================================
// Claude API-ге сұраныс жіберу
// @param {string} message - Пайдаланушы хабарламасы
// @returns {Promise<string>} - ЖИ жауабы
// ========================================
async function sendToClaude(message) {
    const response = await fetch('[api.anthropic.com](https://api.anthropic.com/v1/messages)', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 500,
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error(`API қатесі: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
}

// ========================================
// Хабарлама жіберу функциясы
// Пайдаланушы енгізуін өңдеп, API-ге жібереді.
// ========================================
async function sendMessage() {
    const message = userInput.value.trim();
    
    // Бос хабарламаны тексеру
    if (!message) {
        return;
    }

    // API кілтін тексеру
    if (API_KEY === '2e6208bbe3febe85b304bfde7aa8846aabda7a2ea98154caa66db16a8452de81') {
        addMessage('⚠️ API кілті орнатылмаған. script.js файлында API_KEY айнымалысын өз кілтіңізбен ауыстырыңыз.', 'ai');
        return;
    }

    // Пайдаланушы хабарламасын қосу
    addMessage(message, 'user');
    userInput.value = '';
    
    // Батырманы өшіру (қайталанған басуды болдырмау)
    sendBtn.disabled = true;
    sendBtn.textContent = 'Жүктелуде...';

    try {
        // Санауышты жаңарту
        updateCounter();
        
        // Таңдалған API провайдеріне сұраныс жіберу
        let aiResponse;
        if (API_PROVIDER === 'openai') {
            aiResponse = await sendToOpenAI(message);
        } else {
            aiResponse = await sendToClaude(message);
        }
        
        // ЖИ жауабын көрсету
        addMessage(aiResponse, 'ai');
        
    } catch (error) {
        console.error('Қате:', error);
        addMessage(`❌ Қате орын алды: ${error.message}. API кілтіңізді тексеріңіз.`, 'ai');
    } finally {
        // Батырманы қайта қосу
        sendBtn.disabled = false;
        sendBtn.textContent = 'Жіберу';
    }
}

// ========================================
// Карточкалар анимациясы (Intersection Observer)
// Бет айналдырылғанда карточкалар біртіндеп пайда болады.
// ========================================
function setupCardAnimations() {
    // Intersection Observer опциялары
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Элементтің 10%-ы көрінгенде іске қосылады
    };

    // Observer callback функциясы
    const observerCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Кідіріспен анимация қосу (бірінен соң бірі)
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                
                // Бір рет пайда болғаннан кейін бақылауды тоқтату
                observer.unobserve(entry.target);
            }
        });
    };

    // Observer жасау
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Барлық карточкаларды бақылауға қосу
    cards.forEach(card => {
        observer.observe(card);
    });
}

// ========================================
// Оқиға тыңдаушыларын орнату
// ========================================

// Тақырып ауыстыру батырмасы
themeToggle.addEventListener('click', toggleTheme);

// Жіберу батырмасы
sendBtn.addEventListener('click', sendMessage);

// Enter пернесімен жіберу
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// ========================================
// Бет жүктелгенде іске қосылатын код
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Сақталған тақырыпты жүктеу
    loadSavedTheme();
    
    // Карточкалар анимациясын орнату
    setupCardAnimations();
});
