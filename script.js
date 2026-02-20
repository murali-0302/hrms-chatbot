const API_KEY = "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";

function handleKey(e) {
  if (e.key === "Enter") sendMessage();
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  displayMessage(message, "user-message");
  input.value = "";

  const typing = displayMessage("Typing...", "bot-message typing");

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": location.href,
          "X-Title": "HRMS Chatbot"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: "" },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();
    typing.remove();

    const reply =
      data.choices?.[0]?.message?.content || "Error";

    displayMessage(reply, "bot-message");

  } catch (error) {
    typing.remove();
    displayMessage("Connection error", "bot-message");
  }
}

function displayMessage(text, className) {
  const chat = document.getElementById("chat-window");
  const div = document.createElement("div");
  div.className = `message ${className}`;
  div.innerHTML = marked.parse(text);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

/* Voice Recognition */
let recognition;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onstart = function () {
    document.getElementById("mic-btn").classList.add("listening");
  };

  recognition.onend = function () {
    document.getElementById("mic-btn").classList.remove("listening");
  };

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("user-input").value = transcript;
    sendMessage();
  };

} else {
  alert("Speech Recognition not supported in this browser");
}

function startVoice() {
  if (recognition) recognition.start();
}
