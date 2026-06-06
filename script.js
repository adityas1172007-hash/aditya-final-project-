// Tumhare PythonAnywhere server ka EXACT target route
const BACKEND_URL = "https://aditya7.pythonanywhere.com/api/chat";

const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Auto-resize textarea logic
userInput.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
});

// Handle 'Enter' to send, 'Shift+Enter' for new line
userInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener("click", sendMessage);

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Display User Message
    appendMessage(text, "user-message");
    userInput.value = "";
    userInput.style.height = "auto";
    
    // Disable input while waiting
    sendBtn.disabled = true;
    
    // Create a temporary "Analyzing..." element
    const typingId = "typing-" + Date.now();
    appendMessage("Analyzing...", "ai-message", typingId);

    try {
        // Backend ko POST request bhejna
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        
        // Remove typing indicator
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.remove();

        // Agar response successfully aaya
        if (response.ok && data.candidates && data.candidates.length > 0) {
            const aiReply = data.candidates[0].content.parts[0].text;
            appendMessage(aiReply, "ai-message");
        } else {
            console.error("Backend Error Data:", data);
            appendMessage("System Error: Backend ne invalid response diya. Console check karo.", "ai-message");
        }
    } catch (error) {
        // Network ya Fetch fail hone par
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.remove();
        
        console.error("Fetch Network Error:", error);
        appendMessage("Network Error: Connection fail ho gaya. Verify karo ki tumhara internet chal raha hai aur backend URL sahi hai.", "ai-message");
    } finally {
        sendBtn.disabled = false;
        userInput.focus();
    }
}

// UI mein text append karne ka logic
function appendMessage(text, className, id = null) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message " + className;
    if (id) msgDiv.id = id;
    
    // HTML tags se bachne ke liye aur proper format ke liye innerText
    msgDiv.innerText = text;
    
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
