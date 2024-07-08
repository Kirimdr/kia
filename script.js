const HUGGINGFACE_API_KEY = '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'; // Remplacez par votre vrai token API
const API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';

async function getAIResponse(message) {
    try {
        const response = await axios.post(API_URL, 
            { inputs: message },
            { headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` } }
        );
        console.log('Réponse API:', response.data);
        return response.data[0].generated_text;
    } catch (error) {
        console.error('Erreur détaillée:', error);
        if (error.response) {
            console.error('Données de réponse:', error.response.data);
            console.error('Statut:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            console.error('Aucune réponse reçue');
        } else {
            console.error('Erreur de configuration:', error.message);
        }
        return "Désolé, une erreur s'est produite lors de la communication avec l'IA. Veuillez réessayer plus tard.";
    }
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (message) {
        const chatScreen = document.getElementById('chat-screen');
        
        // Message de l'utilisateur
        const userMessage = document.createElement('div');
        userMessage.classList.add('message', 'sent');
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        userMessage.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">${currentTime}</div>
        `;
        chatScreen.appendChild(userMessage);
        
        // Réinitialiser l'input
        userInput.value = '';
        
        // Afficher un message de chargement
        const loadingMessage = document.createElement('div');
        loadingMessage.classList.add('message', 'received', 'loading');
        loadingMessage.innerHTML = `
            <div class="message-content">En train de réfléchir...</div>
        `;
        chatScreen.appendChild(loadingMessage);
        chatScreen.scrollTop = chatScreen.scrollHeight;

        // Obtenir la réponse de l'IA
        try {
            const aiResponse = await getAIResponse(message);
            loadingMessage.remove();
            const botMessage = document.createElement('div');
            botMessage.classList.add('message', 'received');
            botMessage.innerHTML = `
                <div class="message-content">${aiResponse}</div>
                <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            `;
            chatScreen.appendChild(botMessage);
        } catch (error) {
            loadingMessage.remove();
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('message', 'received', 'error');
            errorMessage.innerHTML = `
                <div class="message-content">Désolé, une erreur s'est produite. Veuillez réessayer.</div>
            `;
            chatScreen.appendChild(errorMessage);
        }

        chatScreen.scrollTop = chatScreen.scrollHeight;
    }
}

function toggleChatbot() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.classList.toggle('d-none');
    if (!chatContainer.classList.contains('d-none')) {
        document.getElementById('user-input').focus();
    }
}

// Fonction pour ajuster automatiquement la hauteur de la zone de texte
function autoResizeTextarea() {
    const textarea = document.getElementById('user-input');
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const toggleButton = document.getElementById('toggle-chatbot');

    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    if (userInput) {
        userInput.addEventListener('input', autoResizeTextarea);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', toggleChatbot);
    }
});