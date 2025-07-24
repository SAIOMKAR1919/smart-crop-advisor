const form = document.getElementById('input-form');
const cropName = document.getElementById('crop-name');
const resultBox = document.getElementById('result');
const fertilizerTips = document.getElementById('fertilizer-tips');
const chatInput = document.getElementById('chat-input');
const chatBox = document.getElementById('chat-box');

const cropDatabase = {
  Rice: { N: 90, P: 40, K: 40 },
  Wheat: { N: 80, P: 50, K: 40 },
  Maize: { N: 100, P: 50, K: 50 },
  Cotton: { N: 120, P: 60, K: 60 },
  Sugarcane: { N: 150, P: 75, K: 70 },
  Groundnut: { N: 20, P: 60, K: 30 },
  Chickpea: { N: 30, P: 60, K: 40 },
  Lentil: { N: 25, P: 50, K: 30 },
  Mustard: { N: 100, P: 40, K: 40 },
  Potato: { N: 120, P: 60, K: 100 },
  Tomato: { N: 100, P: 50, K: 100 },
  Onion: { N: 120, P: 60, K: 60 },
  Bajra: { N: 60, P: 30, K: 30 },
  Jowar: { N: 80, P: 40, K: 40 },
  Soybean: { N: 30, P: 60, K: 40 },
  Barley: { N: 60, P: 30, K: 40 },
  Pea: { N: 20, P: 40, K: 30 },
  Sorghum: { N: 75, P: 40, K: 40 },
  BlackGram: { N: 20, P: 50, K: 30 },
  GreenGram: { N: 25, P: 45, K: 35 },
  Cabbage: { N: 100, P: 60, K: 90 },
  Cauliflower: { N: 90, P: 55, K: 85 },
  Brinjal: { N: 90, P: 45, K: 80 },
  Okra: { N: 60, P: 35, K: 40 }
};

// 🚜 Crop Recommendation
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const N = parseInt(data.N), P = parseInt(data.P), K = parseInt(data.K);
  const pH = parseFloat(data.pH);
  const temp = parseFloat(data.temperature);
  const humidity = parseFloat(data.humidity);
  const rainfall = parseFloat(data.rainfall);

  let recommendedCrop = "Maize";

  if (N < 40 && pH < 6) recommendedCrop = "Wheat";
  else if (N > 100 && rainfall > 200) recommendedCrop = "Rice";
  else if (pH >= 6.5 && pH <= 7.5 && temp > 25) recommendedCrop = "Cotton";
  else if (humidity > 60 && rainfall > 300) recommendedCrop = "Sugarcane";
  else if (K > 90 && temp < 20) recommendedCrop = "Potato";
  else if (P < 30 && pH < 6) recommendedCrop = "BlackGram";
  else if (temp > 28 && rainfall > 200 && pH < 6.5) recommendedCrop = "Groundnut";
  else if (pH > 7.5) recommendedCrop = "Barley";
  else if (temp >= 20 && temp <= 30 && rainfall >= 300) recommendedCrop = "Soybean";
  else if (N < 30 && P > 50) recommendedCrop = "Chickpea";

  cropName.textContent = recommendedCrop;
  resultBox.classList.remove("hidden");

  const ideal = cropDatabase[recommendedCrop];
  fertilizerTips.innerHTML = `<h3>Fertilizer Suggestions for <strong>${recommendedCrop}</strong>:</h3>`;
  if (N < ideal.N) fertilizerTips.innerHTML += `<p>🧪 Add Urea or Organic Compost (Nitrogen)</p>`;
  if (P < ideal.P) fertilizerTips.innerHTML += `<p>🧪 Add DAP or Bone Meal (Phosphorus)</p>`;
  if (K < ideal.K) fertilizerTips.innerHTML += `<p>🧪 Add MOP or Wood Ash (Potassium)</p>`;
});

// 🎙️ Voice Input
function startListening() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new SR();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    chatInput.value = text;
    handleChat();
  };

  recognition.onerror = (e) => {
    alert("Voice input error: " + e.error);
  };

  recognition.start();
}

// 🔊 Text-to-speech
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-IN';
  window.speechSynthesis.speak(utter);
}

// 💬 Chatbot Replies
const chatbotReplies = {
  "hi": "Hey! How can I help you?",
  "hello": "Hello! How can I assist you today?",
  "how are you": "I'm just a program, but thanks for asking! How can I help you?",
  "what is the best crop": "It depends on your soil and weather conditions. Try using the crop advisor tool above!",
  "what crop should i grow": "It depends on your soil values. Try using the crop advisor tool above!",
  "how to improve nitrogen": "Apply Urea or compost to boost Nitrogen levels.",
  "ok": "Thank you for using our service! If you have more questions, feel free to ask.",
  "best crop for acidic soil": "Rice and Potato are good options for slightly acidic soil.",
  "when to plant rice": "Rice is usually sown before the monsoon (June-July).",
  "ideal ph for wheat": "Wheat grows best in slightly alkaline to neutral pH (6.5 - 7.5).",
  "rainfall required for maize": "Maize needs 500mm to 800mm rainfall during its growth.",
  "can i grow sugarcane": "Sugarcane requires high sunlight, water, and fertile loamy soil.",
  "best crop in low phosphorus": "Try Legumes like Chickpea or Black Gram—they fix phosphorus well.",
  "what is dap": "DAP stands for Diammonium Phosphate, rich in nitrogen and phosphorus.",
  "what is mop": "MOP is Muriate of Potash, rich in potassium, good for root growth."
};

// 💡 Handle Chat (from input or voice)
function handleChat() {
  const question = chatInput.value.trim().toLowerCase();
  if (!question) return;

  const reply = chatbotReplies[question] || "Hey! How can I help you?.";

  chatBox.innerHTML += `<p><strong>👨‍🌾 You:</strong> ${question}</p><p><strong>🤖 Bot:</strong> ${reply}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
  chatInput.value = "";
  speak(reply);
}















