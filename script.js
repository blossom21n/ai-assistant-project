const API_KEY = '';

const themeToggle = document.getElementById('theme-toggle');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const counter = document.getElementById('counter');
const cards = document.querySelectorAll('.card');

let requestCount = 0;

/**
 * Тақырыпты ауыстырады.
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
 * @param {string} text
 * @param {string} type
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
 */
function updateCounter() {
    requestCount += 1;
    counter.textContent = requestCount;
}

/**
 * Демо ЖИ жауабын қайтарады.
 * @param {string} message
 * @returns {string}
 */
function getAIResponse(message) {
    const text = message.toLowerCase().trim();

    if (text.includes('сәлем') || text.includes('салам') || text.includes('салем')) {
        return 'Сәлем! Мен ЖИ-ассистентпін. HTML, CSS, JavaScript немесе ЖИ құралдары туралы сұрақ қоя аласыз.';
    }

    if (text.includes('html')) {
        return 'HTML — веб-беттің құрылымын жасайтын белгілеу тілі. Ол тақырып, мәтін, сурет, батырма сияқты элементтерді орналастыру үшін қолданылады.';
    }

    if (text.includes('css')) {
        return 'CSS — веб-бетті безендіруге арналған стиль тілі. Ол түстерді, қаріптерді, арақашықтықты және адаптивті дизайнды баптайды.';
    }

    if (text.includes('javascript') || text.includes('js')) {
        return 'JavaScript — веб-бетке интерактивтілік қосатын бағдарламалау тілі. Ол батырмаға басу, чат жіберу, анимация және API сұраныстарын орындау үшін керек.';
    }

    if (text.includes('chatgpt')) {
        return 'ChatGPT — код жазуға, мәтін құруға, қателерді түсіндіруге және сұрақтарға жауап беруге көмектесетін ЖИ құрал.';
    }

    if (text.includes('claude')) {
        return 'Claude — мәтін талдау, түсіндіру және логикалық жауап беруде пайдалы ЖИ-ассистент.';
    }

    if (text.includes('copilot')) {
        return 'GitHub Copilot — кодты автоматты толықтыруға және функциялар жазуға көмектесетін әзірлеушіге арналған ЖИ құрал.';
    }

    if (text.includes('жи') || text.includes('жасанды интеллект')) {
        return 'Жасанды интеллект — адамның кейбір ойлау әрекеттерін модельдейтін технология. Ол мәтін жазу, сурет жасау, код генерациялау және талдау сияқты міндеттерді орындай алады.';
    }

    if (text.includes('fetch')) {
        return 'fetch() — JavaScript-та серверге сұраныс жіберуге арналған функция. Ол API-ден мәлімет алып, нәтижесін өңдеуге мүмкіндік береді.';
    }

    if (text.includes('api')) {
        return 'API — әртүрлі бағдарламалардың бір-бірімен байланысу тәсілі. Бұл жобада API арқылы ЖИ-ге сұрақ жіберіп, жауап алуға болады.';
    }

    if (text.includes('код')) {
        return 'Код жазғанда құрылымды қарапайым ұстау маңызды: HTML — құрылым, CSS — дизайн, JavaScript — логика.';
    }

    if (text.includes('көмек') || text.includes('көмектес')) {
        return 'Бұл бетте ЖИ құралдары туралы карточкалар, қараңғы тақырып, анимация және чат функциясы бар. Сұрағыңызды нақтырақ жазсаңыз, соған сай жауап беремін.';
    }

    return 'Сұрағыңыз қабылданды. Бұл демонстрациялық ЖИ чат, ол веб-әзірлеу және ЖИ құралдары туралы негізгі сұрақтарға жауап береді.';
}

/**
 * Хабарламаны жібереді.
 */
async function sendMessage() {
    const message = userInput.value.trim();

    if (!message) {
        return;
    }

    addMessage(message, 'user');
    userInput.value = '';
    sendBtn.disabled = true;
    sendBtn.textContent = 'Жүктелуде...';
    updateCounter();

    setTimeout(() => {
        const reply = getAIResponse(message);
        addMessage(reply, 'ai');
        sendBtn.disabled = false;
        sendBtn.textContent = 'Жіберу';
        userInput.focus();
    }, 700);
}

/**
 * Карточкаларға scroll анимациясын қосады.
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
