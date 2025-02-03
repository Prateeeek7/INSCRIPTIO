const API_KEY = 'AIzaSyAP5Wdm2CiiGZymRnxzEokkXJQ7ZnlFa5w';
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    userInput.value = '';

    // Show typing indicator
    typingIndicator.style.display = 'block';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;

        // Hide typing indicator and add bot response
        typingIndicator.style.display = 'none';
        addMessage(botResponse, 'bot');

    } catch (error) {
        console.error('Error:', error);
        typingIndicator.style.display = 'none';
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `
        ${sender === 'bot' ? '<img src="image/doctor.png" alt="Doctor Bot" class="bot-avatar">' : ''}
        <div class="message-content">${text}</div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});