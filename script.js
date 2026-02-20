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
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": location.href,
          "X-Title": "HRMS Chatbot"
        },

        body: JSON.stringify({
          model: "openai/gpt-4o-mini",

          messages: [

            {
              role: "system",
              content: "You are a professional HRMS assistant."
            },

            {
              role: "user",
              content: message
            }

          ]

        })

      }
    );


    const data = await response.json();


    if (typing) typing.remove();


    if (!response.ok) {

      displayMessage(
        data.error?.message || "API Error",
        "bot-message"
      );

      return;

    }


    const reply =
      data.choices?.[0]?.message?.content || "No response";


    displayMessage(reply, "bot-message");


  }

  catch (error) {

    if (typing) typing.remove();

    displayMessage(
      "Connection error",
      "bot-message"
    );

    console.error(error);

  }

}



function displayMessage(text, className) {

  const chat =
    document.getElementById("chat-window");


  const div =
    document.createElement("div");


  div.className =
    `message ${className}`;


  div.innerHTML =
    marked.parse(text);


  chat.appendChild(div);


  chat.scrollTop =
    chat.scrollHeight;


  return div;

}



/* Voice Recognition */

let recognition = null;


if (
  "webkitSpeechRecognition" in window ||
  "SpeechRecognition" in window
) {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


  recognition =
    new SpeechRecognition();


  recognition.continuous = false;

  recognition.interimResults = false;

  recognition.lang = "en-US";



  recognition.onstart = function () {

    document
      .getElementById("mic-btn")
      .classList.add("listening");

  };



  recognition.onend = function () {

    document
      .getElementById("mic-btn")
      .classList.remove("listening");

  };



  recognition.onresult = function (event) {

    const transcript =
      event.results[0][0].transcript;


    document
      .getElementById("user-input")
      .value = transcript;


    sendMessage();

  };



}
else {

  console.warn(
    "Speech Recognition not supported"
  );

}



function startVoice() {

  if (recognition)
    recognition.start();

}
