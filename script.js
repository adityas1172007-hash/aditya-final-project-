// Tumhare PythonAnywhere server ka exact address
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
    
    // Create a temporary "typing..." element
    const typingId = "typing-" + Date.now();
    appendMessage("Analyzing...", "ai-message", typingId);

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        
        // Remove typing indicator
        document.getElementById(typingId).remove();

        if (response.ok && data.candidates && data.candidates.length > 0) {
            const aiReply = data.candidates[0].content.parts[0].text;
            appendMessage(aiReply, "ai-message");
        } else {
            console.error("Server Error:", data);
            appendMessage("Error: The connection to the backend failed or returned an invalid response.", "ai-message");
        }
    } catch (error) {
        document.getElementById(typingId).remove();
        console.error("Fetch Error:", error);
        appendMessage("Network Error: Make sure your PythonAnywhere server is active and CORS is allowed.", "ai-message");
    } finally {
        sendBtn.disabled = false;
        userInput.focus();
    }
}

function appendMessage(text, className, id = null) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message " + className;
    if (id) msgDiv.id = id;
    
    // Use innerText to naturally handle whitespace and line breaks
    msgDiv.innerText = text;
    
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
