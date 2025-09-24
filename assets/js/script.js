// Configuration chargée depuis le fichier env.js
// ------------------------------------------------------------
// Clé API Mistral
//const apiKey
// URL de l'API Mistral
//const apiEndpoint


// ------------------------------------------------------------
// Variables globales des éléménts HTML
// ------------------------------------------------------------
const chatbotMessages = document.getElementById('chatbot-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

/**
 * Ajoute un message au chatbot
 *
 * @param sender
 * @param text
 */
function addMessage(sender, text) {
    // Crée un nouvel élément div pour le message
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;

    // Ajoute le message à la zone de messages
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/**
 * Appelle l'API Mistral avec le prompt de l'utilisateur
 *
 * @param prompt
 * @returns {Promise<*|string>}
 */
async function callMistralAPI(prompt) {
    // La fonction est en asynchrone, donc on utilise await pour attendre la réponse de l'API
    try {
        const response = await fetch(apiEndpoint, 
            {
                method: 'POST',
                // Headers de la requête
                headers: {
                    // Type de contenu JSON
                    'Content-Type': 'application/json',
                    // Autorisation avec la clé API Mistral
                    'Authorization': `Bearer ${apiKey}`
                },
                // Corps de la requête au format JSON
                body: JSON.stringify(
                    {
                        // Modèle à utiliser
                        model: 'mistral-tiny',
                        // Messages à envoyer
                        messages: [{ role: 'user', content: prompt }]
                    }
                )
            }
        );

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Transformation de la réponse en JSON
        const data = await response.json();

        // Affichage de la réponse dans la console
        console.log(data);

        // Retourne le contenu de la réponse
        // Le contenu de la réponse est dans le champ "content"
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API:', error);
        return "Désolé, une erreur est survenue.";
    }
}

// ------------------------------------------------------------
// Gestion de l'envoi du message
// ------------------------------------------------------------
sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    addMessage('user', userMessage);
    userInput.value = '';

    const botResponse = await callMistralAPI(userMessage);
    addMessage('bot', botResponse);
});


// ------------------------------------------------------------
// Permet d'envoyer avec la touche Entrée
// ------------------------------------------------------------
userInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;

        addMessage('user', userMessage);
        userInput.value = '';

        const botResponse = await callMistralAPI(userMessage);
        addMessage('bot', botResponse);
    }
});
