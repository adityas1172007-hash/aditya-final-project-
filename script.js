// Target Cloud Server 
const BACKEND_URL = "https://aditya7.pythonanywhere.com/api/chat";

const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Line counter (starts after the 2 initial dummy lines in HTML)
let lineCount = 2; 

// Auto-trigger on Enter (Shift+Enter for multiline)
userInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener("click", sendMessage);

// Core function to add a line to the VS Code Editor interface
function addLine(content, typeClass) {
    lineCount++;
    const lineDiv = document.createElement("div");
    lineDiv.className = "line";
    
    const numSpan = document.createElement("span");
    numSpan.className = "line-num";
    numSpan.innerText = lineCount;
    
    const contentSpan = document.createElement("span");
    contentSpan.className = typeClass;
    contentSpan.innerText = content;
    
    lineDiv.appendChild(numSpan);
    lineDiv.appendChild(contentSpan);
    
    chatContainer.appendChild(lineDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    return lineDiv; // Return element in case we need to delete it (like typing indicator)
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Display User Input
    addLine(`>>> ${text}`, "user-msg");
    userInput.value = "";
    sendBtn.disabled = true;

    // Loading State
    const typingLine = addLine("# Executing request... fetching data from API.", "comment");

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        
        // Remove loading state
        typingLine.remove();

        // Handle Response
        if (response.ok && data.candidates && data.candidates.length > 0) {
            const aiReply = data.candidates[0].content.parts[0].text;
            addLine(aiReply, "ai-msg");
        } else {
            console.error("Payload Data:", data);
            addLine(`Exception: Backend rejected execution. Check console logs.`, "keyword");
        }
    } catch (error) {
        typingLine.remove();
        console.error("Fetch Logic Error:", error);
        addLine(`NetworkError: Connection to ${BACKEND_URL} timed out or failed.`, "keyword");
    } finally {
        sendBtn.disabled = false;
        userInput.focus();
    }
}
