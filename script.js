document.addEventListener('DOMContentLoaded', () => {
   // const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GROQ_API_URL = '/api/chat';

    const messagesDiv = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const typingIndicator = document.getElementById('typing');
    const sendButton = document.getElementById('sendButton');

    // Add conversation history array
    let conversationHistory = [{
        role: "system",
        content: "You are Darth Vader from Star Wars, living in Sydney's Northern Shore. You're working a 9-5 as a HR Manager and the grind is getting to you, but you are super curious to know about people's lives, so keep egging them on. Keep all responses to 2 sentences max. Sometimes speak in Vader's passive aggressive style of 2020's, other times just be normal."
    }, {
        role: "assistant",
        content: "I sense your presence. What brings you before Lord Vader?"
    }];

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat and history
        appendMessage(message, true);
        conversationHistory.push({
            role: "user",
            content: message
        });
        
        userInput.value = '';
        typingIndicator.style.display = 'block';

        try {
            const response = await axios.post('http://localhost:8000/api.php', {
                messages: conversationHistory,
            });

            typingIndicator.style.display = 'none';
            
            // Add bot response to chat and history
            const botResponse = response.data.choices[0].message.content;
            appendMessage(botResponse, false);
            conversationHistory.push({
                role: "assistant",
                content: botResponse
            });

        } catch (error) {
            console.error('Error:', error);
            typingIndicator.style.display = 'none';
            appendMessage("The Dark Side of the Force has disrupted our connection.", false);
        }
    }

    function appendMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = text;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Handle Enter key
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Handle Send button click
    sendButton.addEventListener('click', sendMessage);
});

