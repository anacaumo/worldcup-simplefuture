let firstRound = true;

let answered = false;

let totalRounds = 0;

let currentRound = 1;

let feedbackRevealed = false;

let pendingFeedback = "";

let rankingActive = false;

/* ========= TEAMS ========= */

let teams = [];
let currentTeamIndex = 0;

/* ========= SETUP ========= */

function generateNameInputs() {
  let count = parseInt(document.getElementById("teamCount").value);
  let container = document.getElementById("teamNames");

  // Save existing names
  let existingNames = [];
  let inputs = container.querySelectorAll("input");

  inputs.forEach(input => {
    existingNames.push(input.value);
  });

  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Team " + (i + 1);
    input.id = "teamName" + i;

    // Restore previous values
    if (existingNames[i]) {
      input.value = existingNames[i];
    }

    // Character limit
    input.maxLength = 12;

    input.className = "team-input";

    container.appendChild(input);
  }
}

function startGame() {
  let count = parseInt(document.getElementById("teamCount").value);

  teams = [];

  for (let i = 0; i < count; i++) {
    let input = document.getElementById("teamName" + i);

    // 🛡️ safety check
    if (!input) {
      alert("Something went wrong. Try selecting the number of teams again.");
      return;
    }

    let nameInput = input.value;
    let teamName = nameInput.trim() !== "" ? nameInput : "Team " + (i + 1);

    teams.push({
      name: teamName,
      score: 0
    });

    totalRounds = parseInt(document.getElementById("roundCount").value);
currentRound = 1;
    
  }

  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";

  updateScoreboard();

  // reset rotation properly
  currentTeamIndex = 0;
  firstRound = true;

  nextRound();
}
/* ========= QUESTIONS ========= */

let allQuestions = [
  {
  text: "Complete: 'Look at those dark clouds! It ____ rain.'",
  options: [
    { text: "will", score: 0, type: "Wrong", explanation: "Há uma evidência clara (as nuvens escuras). Por isso usamos 'is going to'. A resposta correta era 'is going to'." },

    { text: "is going to", score: 1, type: "Correct", explanation: "Correto! Quando existe uma evidência no presente, usamos 'be going to'." },

    { text: "going", score: 0, type: "Wrong", explanation: "'Going' sozinho não forma o futuro. A resposta correta era 'is going to'." },

    { text: "goes to", score: 0, type: "Wrong", explanation: "Essa estrutura está incorreta para falar do futuro. A resposta correta era 'is going to'." }
  ]
},

  
{
  text: "Complete: 'I forgot my pencil!' 'Don't worry. I ____ lend you mine.'",
  options: [
    { text: "am going to", score: 0, type: "Wrong", explanation: "A decisão foi tomada naquele momento. A resposta correta era 'will'." },

    { text: "will", score: 1, type: "Correct", explanation: "Correto! Usamos 'will' para decisões tomadas no momento em que falamos." },

    { text: "going", score: 0, type: "Wrong", explanation: "A estrutura está incompleta. A resposta correta era 'will'." },

    { text: "am", score: 0, type: "Wrong", explanation: "Falta o restante da estrutura. A resposta correta era 'will'." }
  ]
},

  {
  text: "Qual frase fala sobre um plano já decidido?",
  options: [
    { text: "I am going to watch the World Cup final with my friends.", score: 1, type: "Correct", explanation: "Correto! 'Be going to' é usado para planos e intenções já decididos." },

    { text: "I'll answer the phone!", score: 0, type: "Wrong", explanation: "Essa é uma decisão tomada no momento. A resposta correta era 'I am going to watch the World Cup final with my friends.'." },

    { text: "Brazil will win the World Cup.", score: 0, type: "Wrong", explanation: "Essa é uma opinião/previsão. A resposta correta era 'I am going to watch the World Cup final with my friends.'." },

    { text: "I don't think Japan will score.", score: 0, type: "Wrong", explanation: "Essa é uma opinião/previsão. A resposta correta era 'I am going to watch the World Cup final with my friends.'." }
  ]
},

  {
  text: "Qual frase mostra uma decisão tomada NAQUELE MOMENTO?",
  options: [
    { text: "I'm going to visit my grandparents next weekend.", score: 0, type: "Wrong", explanation: "Esse é um plano já decidido. A resposta correta era 'It's raining. I'll buy a rain poncho!'." },

    { text: "We're going to travel next month.", score: 0, type: "Wrong", explanation: "Essa frase fala de um plano futuro. A resposta correta era 'It's raining. I'll buy a rain poncho!'." },

    { text: "It's raining. I'll buy a rain poncho!", score: 1, type: "Correct", explanation: "Correto! A decisão foi tomada no momento em que começou a chover." },

    { text: "They're going to study tonight.", score: 0, type: "Wrong", explanation: "Essa frase fala de um plano já organizado. A resposta correta era 'It's raining. I'll buy a rain poncho!'." }
  ]
},


 {
  text: "Complete a frase no simple future: 'I think Brazil ____ win the next match.'",
  options: [
    { text: "will", score: 1, type: "Correct", explanation: "Correto! Depois de 'I think', normalmente usamos 'will' para fazer previsões baseadas na nossa opinião." },

    { text: "is going to", score: 0, type: "Wrong", explanation: "Aqui estamos dando uma opinião ('I think'), não usando uma evidência. A resposta correta era 'will'." },

    { text: "going", score: 0, type: "Wrong", explanation: "A estrutura está incompleta. A resposta correta era 'will'." },

    { text: "wins", score: 0, type: "Wrong", explanation: "A frase pede futuro. A resposta correta era 'will'." }
  ]
},

 
{
  text: "Qual destas frases está INCORRETA?",
  options: [
    { text: "Look at the clouds! It's going to rain.", score: 0, type: "Wrong", explanation: "Essa frase está correta porque existe uma evidência, então usamos 'going to'." },

    { text: "I think Brazil will win.", score: 0, type: "Wrong", explanation: "Essa frase está correta para uma opinião." },

    { text: "The phone is ringing. I'm going to answer it!", score: 1, type: "Correct", explanation: "Correto! Como a decisão foi tomada naquele momento, o correto seria é 'I'll answer it!'." },

    { text: "We're going to travel next month. The hotel is already booked.", score: 0, type: "Wrong", explanation: "Essa frase está correta porque fala de um plano já organizado." }
  ]
},

 {
  text: "Complete: 'My family already bought the tickets. We ____ watch the opening match.'",
  options: [
    { text: "will", score: 0, type: "Wrong", explanation: "Os ingressos já foram comprados, então existe um plano. A resposta correta era 'are going to'." },

    { text: "are going to", score: 1, type: "Correct", explanation: "Correto! Como o plano já foi feito, usamos 'be going to'." },

    { text: "going", score: 0, type: "Wrong", explanation: "A estrutura está incompleta. A resposta correta era 'are going to'." },

    { text: "is going to", score: 0, type: "Wrong", explanation: "Como falamos em 'we', aqui é 'are', não 'is'. A resposta correta era 'are going to'." }
  ]
},

  {
  text: "Qual destas frases está no Simple Future?",
  options: [
    { text: "Brazil will score first.", score: 1, type: "Correct", explanation: "Correto! A frase usa o futuro com 'will'." },

    { text: "Brazil scored first.", score: 0, type: "Wrong", explanation: "Essa frase está no passado." },

    { text: "Brazil scores first.", score: 0, type: "Wrong", explanation: "Essa frase está no presente." },

    { text: "Brazil is scoring first.", score: 0, type: "Wrong", explanation: "Essa frase está no presente." }
  ]
},

{
  text: "Qual frase fala sobre um PLANO futuro?",
  options: [
    { text: "I'm going to watch the match tonight.", score: 1, type: "Correct", explanation: "Correto! 'Be going to' é usado para planos já decididos." },

    { text: "I'll help you!", score: 0, type: "Wrong", explanation: "Essa é uma decisão tomada no momento. O correto seria 'I'm going to watch the match tonight.'" },

    { text: "I think Brazil will win.", score: 0, type: "Wrong", explanation: "Essa é uma previsão/opinião.  O correto seria 'I'm going to watch the match tonight.'" },

    { text: "I think it will rain tomorrow.", score: 0, type: "Wrong", explanation: "Essa é uma previsão sem evidência. O correto seria 'I'm going to watch the match tonight.'" }
  ]
},

  {
  text: "Complete no simple future: 'The sky is very dark. It ____ rain.'",
  options: [
    { text: "will", score: 0, type: "Wrong", explanation: "Existe uma evidência clara. A resposta correta era 'is going to'." },

    { text: "is going to", score: 1, type: "Correct", explanation: "Correto! Usamos 'be going to' quando vemos uma evidência." },

    { text: "going", score: 0, type: "Wrong", explanation: "A estrutura está incompleta." },

    { text: "is", score: 0, type: "Wrong", explanation: "A frase pede futuro." }
  ]
},

  {
  text: "Qual destas expressões normalmente aparece com planos futuros?",
  options: [
    { text: "next weekend", score: 1, type: "Correct", explanation: "Correto! 'Next weekend' é uma expressão de futuro." },

    { text: "yesterday", score: 0, type: "Wrong", explanation: "'Yesterday' indica passado." },

    { text: "last month", score: 0, type: "Wrong", explanation: "'Last month' indica passado." },

    { text: "ago", score: 0, type: "Wrong", explanation: "'Ago' é usado para falar do passado." }
  ]
},

  {
  text: "Qual frase mostra uma OPINIÃO sobre o futuro?",
  options: [
    { text: "I think Brazil will reach the final.", score: 1, type: "Correct", explanation: "Correto! 'I think' indica uma opinião, então usamos 'will'." },

    { text: "Look at the clouds! It's going to rain.", score: 0, type: "Wrong", explanation: "Essa previsão é baseada em uma evidência." },

    { text: "We're going to visit the stadium tomorrow.", score: 0, type: "Wrong", explanation: "Essa frase fala de um plano." },

    { text: "I'll carry your bag.", score: 0, type: "Wrong", explanation: "Essa frase mostra uma decisão espontânea." }
  ]
},
  
  {
  text: "Qual frase usa corretamente 'be going to'?",
  options: [
    { text: "They are going to visit the stadium.", score: 1, type: "Correct", explanation: "Correto! Essa é a estrutura correta do futuro com 'be going to'." },

    { text: "They going to visit the stadium.", score: 0, type: "Wrong", explanation: "Falta o verbo 'are'." },

    { text: "They are going visit the stadium.", score: 0, type: "Wrong", explanation: "Falta a palavra 'to'." },

    { text: "They are go to visit the stadium.", score: 0, type: "Wrong", explanation: "A estrutura está incorreta. Seria 'going', não 'go.'" }
  ]
},

 {
  text: "Complete no Simple Future: 'I think Argentina ____ play well today.'",
  options: [
    { text: "will not", score: 1, type: "Correct", explanation: "Correto! 'I think' normalmente é seguido de 'will'." },

    { text: "is going to", score: 0, type: "Wrong", explanation: "Aqui estamos dando uma opinião sem evidência." },

    { text: "going", score: 0, type: "Wrong", explanation: "A estrutura está incompleta." },

    { text: "plays", score: 0, type: "Wrong", explanation: "A frase pede futuro." }
  ]
},

  {
  text: "Qual frase mostra uma previsão baseada no que estamos vendo AGORA?",
  options: [
    { text: "Look! The baby is going to cry.", score: 1, type: "Correct", explanation: "Correto! Existe uma evidência clara no momento." },

    { text: "I think the baby will like soccer.", score: 0, type: "Wrong", explanation: "Essa é uma opinião/previsão." },

    { text: "I'm going to visit my cousin next weekend.", score: 0, type: "Wrong", explanation: "Essa frase fala de um plano." },

    { text: "I'll answer the question.", score: 0, type: "Wrong", explanation: "Essa frase mostra uma decisão espontânea." }
  ]
},

 {
  text: "Qual frase está INCORRETA?",
  options: [
    { text: "I will help you.", score: 0, type: "Wrong", explanation: "Essa frase está correta." },

    { text: "She is going to travel next month.", score: 0, type: "Wrong", explanation: "Essa frase está correta." },

    { text: "They going to play tomorrow.", score: 1, type: "Correct", explanation: "Correto! Falta o verbo 'are': 'They are going to play tomorrow.'." },

    { text: "Brazil will win.", score: 0, type: "Wrong", explanation: "Essa frase está correta." }
  ]
},
  
{
  text: "Complete no Simple Future: 'The referee has the red card in his hand. He ____ remove the player from the game.'",
  options: [
    { text: "will", score: 0, type: "Wrong", explanation: "Existe uma evidência clara. A resposta correta era 'is going to'." },

    { text: "is going to", score: 1, type: "Correct", explanation: "Correto! O árbitro já está com o cartão na mão, então usamos 'be going to'." },

    { text: "going", score: 0, type: "Wrong", explanation: "A estrutura está incompleta." },

    { text: "sends", score: 0, type: "Wrong", explanation: "A frase pede futuro." }
  ]
},

 {
  text: "Complete: 'I think the match ____ be exciting.'",
  options: [
    { text: "will", score: 1, type: "Correct", explanation: "Correto! 'I think' normalmente é seguido de 'will'." },

    { text: "is going to", score: 0, type: "Wrong", explanation: "Aqui estamos dando uma opinião, não falando de uma evidência." },

    { text: "going", score: 0, type: "Wrong", explanation: "A estrutura está incompleta." },

    { text: "is", score: 0, type: "Wrong", explanation: "A frase pede futuro." }
  ]
},

  {
  text: "Qual destas expressões indica futuro?",
  options: [
    { text: "last week", score: 0, type: "Wrong", explanation: "'Last week' indica passado." },

    { text: "yesterday", score: 0, type: "Wrong", explanation: "'Yesterday' indica passado." },

    { text: "next month", score: 1, type: "Correct", explanation: "Correto! 'Next month' significa 'mês que vem'." },

    { text: "ago", score: 0, type: "Wrong", explanation: "'Ago' é usado para falar do passado." }
  ]
},

{
  text: "Qual frase está escrita corretamente?",
  options: [
    { text: "She going to study tonight.", score: 0, type: "Wrong", explanation: "Falta o verbo 'is'." },

    { text: "She is going to study tonight.", score: 1, type: "Correct", explanation: "Correto! Essa é a estrutura correta do futuro com 'be going to'." },

    { text: "She is going study tonight.", score: 0, type: "Wrong", explanation: "Falta a palavra 'to'." },

    { text: "She will going study tonight.", score: 0, type: "Wrong", explanation: "Não usamos 'will going'." }
  ]
},

  {
  text: "Complete: 'Our flight leaves in two hours. We ____ travel to Mexico today.'",
  options: [
    { text: "will", score: 0, type: "Wrong", explanation: "A viagem já está planejada. A resposta correta era 'are going to'." },

    { text: "are going to", score: 1, type: "Correct", explanation: "Correto! Existe um plano já organizado." },

    { text: "going", score: 0, type: "Wrong", explanation: "A estrutura está incompleta." },

    { text: "travels", score: 0, type: "Wrong", explanation: "A frase pede futuro." }
  ]
},

{
  text: "Na frase 'We're going to watch the final tomorrow.', quais são as duas pistas de que ela fala sobre o futuro?",
  options: [
    { text: "'going to' e 'tomorrow'", score: 1, type: "Correct", explanation: "Correto! A estrutura do futuro e a expressão de tempo mostram que a frase fala do futuro." },

    { text: "'watch' e 'going to'", score: 0, type: "Wrong", explanation: "'Watch' não indica futuro." },

    { text: "'Tomorrow' e 'watch'", score: 0, type: "Wrong", explanation: "'Watch' não indica futuro." },

    { text: "'the' e 'final'", score: 0, type: "Wrong", explanation: "Essas palavras não indicam tempo." }
  ]
},

 {
  text: "Qual destas frases NÃO fala sobre o futuro?",
  options: [
    { text: "Brazil will play tomorrow.", score: 0, type: "Wrong", explanation: "Essa frase fala do futuro." },

    { text: "They're going to visit the stadium.", score: 0, type: "Wrong", explanation: "Essa frase fala do futuro." },

    { text: "The fans watched the match yesterday.", score: 1, type: "Correct", explanation: "Correto! Essa frase está no passado." },

    { text: "I'm going to buy a new jersey.", score: 0, type: "Wrong", explanation: "Essa frase fala do futuro." }
  ]
},

 {
  text: "Na frase 'I'll help you!', por que usamos 'will'?",
  options: [
    { text: "Porque é um plano feito com antecedência.", score: 0, type: "Wrong", explanation: "Planos normalmente usam 'be going to'." },

    { text: "Porque existe uma evidência.", score: 0, type: "Wrong", explanation: "Evidências normalmente usam 'be going to'." },

    { text: "Porque a decisão foi tomada naquele momento.", score: 1, type: "Correct", explanation: "Correto! 'Will' é muito usado para decisões espontâneas." },

    { text: "Porque a ação aconteceu ontem.", score: 0, type: "Wrong", explanation: "A frase fala do futuro." }
  ]
}
];


/* ========= GAME ========= */

let remainingQuestions = allQuestions.slice();
let currentQuestion = null;

/* ========= HELPERS ========= */

function shuffleArray(array) {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


function updateScoreboard() {
  let container = document.getElementById("scoreboard");
  container.innerHTML = "";

  teams.forEach((team, index) => {
    let div = document.createElement("div");
    div.className = "team-box";

    // Highlight current team
    if (index === currentTeamIndex) {
      div.classList.add("active-team");
    }

    div.innerHTML = `
      <div class="team-name">${team.name}</div>
      <div class="team-score">${team.score}</div>
    `;

    container.appendChild(div);
  });
}

/* ========= ROUND ========= */

function nextRound() {

if (currentRound > totalRounds) {
  showRankingScreen();
  return;
}

  answered = false;
  
let nextBtn = document.getElementById("nextBtn");

nextBtn.disabled = true;
nextBtn.style.opacity = "0.5";
nextBtn.style.cursor = "not-allowed";
  
  setTheme("purple");

  // ✅ correct team rotation logic
  if (!firstRound) {
    currentTeamIndex++;
    if (currentTeamIndex >= teams.length) {
      currentTeamIndex = 0;
    }
  } else {
    firstRound = false;
  }

  let index = Math.floor(Math.random() * remainingQuestions.length);
  currentQuestion = remainingQuestions[index];

  document.getElementById("situation").innerText = currentQuestion.text;

  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  let shuffledOptions = shuffleArray(currentQuestion.options);

  shuffledOptions.forEach(option => {
    let btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = option.text;

    btn.onclick = function (event) {
  handleAnswer(option, event);
};

    optionsDiv.appendChild(btn);
  });




  let feedbackBox = document.getElementById("feedback");

feedbackBox.innerText = "Discuss and choose an answer.";
feedbackBox.style.color = "#666";
feedbackBox.style.cursor = "default"; 
feedbackBox.onclick = null;


  updateScoreboard(); // ✅ keeps highlight in sync


  updateRoundDisplay();
}


/* ========= ANSWER ========= */

function handleAnswer(option, event) {
  if (answered) return;

  answered = true;

  // click animation on selected option
let clickedBtn = event.target;
  clickedBtn.classList.add("selected");

clickedBtn.style.transform = "scale(0.92)";

setTimeout(() => {
  clickedBtn.style.transform = "scale(1)";
}, 120);

  clickedBtn.style.filter = "brightness(0.95)";

  

  document.querySelectorAll(".option").forEach(btn => {
    btn.disabled = true;
  });

  teams[currentTeamIndex].score += option.score;

  let feedbackText = "[" + option.type.toUpperCase() + "]\n" + option.explanation;

  // ALWAYS remove question after answering
remainingQuestions = remainingQuestions.filter(q => q !== currentQuestion);

if (option.score === 1) {
  updateScoreboard();
  setTheme("green");
  feedbackText = "✅ " + feedbackText;

} else if (option.score === 0.5) {
  updateScoreboard();
  setTheme("yellow");
  feedbackText = "🟡 " + feedbackText;

} else {
  updateScoreboard();
  setTheme("red");
  feedbackText = "❌ " + feedbackText;
}

  pendingFeedback = feedbackText;
feedbackRevealed = false;

let feedbackBox = document.getElementById("feedback");

feedbackBox.innerText = "Click here to reveal feedback.";
feedbackBox.style.color = "#666";

feedbackBox.style.cursor = "pointer";   
feedbackBox.onclick = revealFeedback;  
feedbackBox.classList.add("clickable");


  updateScoreboard();

let nextBtn = document.getElementById("nextBtn");

nextBtn.disabled = false;
nextBtn.style.opacity = "1";
nextBtn.style.cursor = "pointer";

  // track rounds AFTER a team finishes answering
if (currentTeamIndex === teams.length - 1) {
  currentRound++;
}
}

/* ========= RESTART ========= */

function restartGame() {
  setTheme("purple");

  teams.forEach(team => team.score = 0);

  remainingQuestions = allQuestions.slice();
  currentTeamIndex = 0;
  currentRound = 1;
  firstRound = true;

  // hide everything properly
  document.getElementById("game").style.display = "none";
  document.getElementById("ranking").style.display = "none";
  document.getElementById("setup").style.display = "block";

  // reset ranking UI
  document.getElementById("rankingList").innerHTML = "";

  updateScoreboard();
}
/* ========= INIT ========= */

window.onload = function () {
  generateNameInputs();
  updateRoundOptions();
};


/* ========= HOW MANY ROUNDS ========= */
function updateRoundOptions() {
  let teamCount = parseInt(document.getElementById("teamCount").value);
  let totalQuestions = allQuestions.length;

  let maxRounds = Math.floor(totalQuestions / teamCount);

  let select = document.getElementById("roundCount");
  select.innerHTML = "";

  for (let i = 1; i <= maxRounds; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.text = i + " round" + (i > 1 ? "s" : "");
    select.appendChild(option);
  }
}

/* ========= ROUND DISPLAY ========= */

function updateRoundDisplay() {
  document.getElementById("roundDisplay").innerText =
    "Round " + currentRound + " of " + totalRounds;
}

/* ========= THEME COLORS ========= */

function setTheme(color) {
  const body = document.body;
  const box = document.querySelector(".game-box");
  const dialogue = document.querySelector(".dialogue-box");
  const buttons = document.querySelectorAll(".option");
 const nextBtn = document.getElementById("nextBtn");
  const active = document.querySelector(".active-team");

  let colors = {
    purple: { border: "#8c7ae6", bg: "#f4f1ff", button: "#dcd6ff" },
    green:  { border: "#2ecc71", bg: "#eafaf1", button: "#d5f5e3" },
    yellow: { border: "#f1c40f", bg: "#fff9e6", button: "#fff3cd" },
    red:    { border: "#ff8a8a", bg: "#ffe0e0", button: "#ffd6d6" }
  };

  let c = colors[color];

  // 🌈 BACKGROUND (whole page)
  body.style.backgroundColor = c.bg;

  // 🎮 main box
  box.style.borderColor = c.border;
  box.style.boxShadow = `6px 6px 0px ${c.border}`;

  // 💬 question box
  dialogue.style.borderColor = c.border;

  // 🎯 options
  buttons.forEach(btn => {
    btn.style.backgroundColor = c.button;
    btn.style.borderColor = c.border;
  });

  // ▶️ next button
  if (nextBtn) {
    nextBtn.style.backgroundColor = c.button;
    nextBtn.style.borderColor = c.border;
  }

  // 🧑‍🤝‍🧑 active team
// 🎯 force active team styling AFTER render
setTimeout(() => {
  const active = document.querySelector(".active-team");
  if (active) {
    active.style.border = `2px solid ${c.border}`;
    active.style.backgroundColor = c.bg;
  }
}, 0);

  // 🏆 scoreboard boxes (important!)
  document.querySelectorAll(".team-box").forEach(box => {
    box.style.borderColor = "#ccc"; // reset first
  });

  if (active) {
    active.style.borderColor = c.border;
  }

  //THEME ANIMATIONS
box.classList.remove("theme-flash");
void box.offsetWidth;
box.classList.add("theme-flash");
  
}

//REVEAL FEEDBACK ON CLICK

function revealFeedback() {
  if (feedbackRevealed) return;

  let feedbackBox = document.getElementById("feedback");

  feedbackBox.innerText = pendingFeedback;
  feedbackBox.style.color = "#000";

  feedbackRevealed = true;

  feedbackBox.style.cursor = "default";
feedbackBox.onclick = null;
  feedbackBox.classList.remove("clickable");
}

//RANKING SCREEN

/* ========= RANKING SCREEN ========= */

let ranking = [];
let revealIndex = 0;

function showRankingScreen() {
  setTheme("purple");

  document.getElementById("game").style.display = "none";
  document.getElementById("ranking").style.display = "block";

  let container = document.getElementById("rankingList");
  container.innerHTML = "";

  ranking = [...teams].sort((a, b) => {
  if (b.score !== a.score) return b.score - a.score;
  return a.name.localeCompare(b.name); // tie breaker
});

  revealIndex = ranking.length - 1;

 container.innerHTML = `
  <button id="revealBtn">Click to reveal ranking</button>
`;

  // ✅ USE GLOBAL variable
  rankingActive = true;

  document.getElementById("revealBtn").onclick = function () {
  if (!rankingActive) return;

  // remove button after first click
  this.remove();

  revealNextRank();
};
}

function revealNextRank() {
  let container = document.getElementById("rankingList");

  let hint = document.querySelector(".reveal-hint");
  if (hint) hint.remove();

  if (revealIndex === 0) {
  // next reveal will be winner, so prepare button AFTER
}


 let currentScore = ranking[revealIndex].score;
  let originalRanking = [...ranking];

// get ALL teams with this score
let group = ranking.filter(t => t.score === currentScore);

// remove them from ranking so they aren't reused
ranking = ranking.filter(t => t.score !== currentScore);

// update revealIndex properly
revealIndex = ranking.length - 1;

// determine position
let higherScores = originalRanking.filter(t => t.score > currentScore).length;
let position = higherScores + 1;

// render ALL teams in group
group.forEach(team => {
  let div = document.createElement("div");
  div.className = "rank-card reveal";

  let display = "";

  if (position === 1) display = "🥇";
  else if (position === 2) display = "🥈";
  else if (position === 3) display = "🥉";
  else display = position + (position === 4 ? "th" : "th");

  if (group.length > 1) display += " (tie)";

  div.innerHTML = `
    <div class="rank-emoji">${display}</div>
    <div class="rank-name">${team.name}</div>
    <div class="rank-score">${team.score} pts</div>
  `;

  // medal styling
  if (position === 1) {
  div.classList.add("winner", "gold");
  div.style.background = "#fff7cc";
  div.style.borderColor = "#e1b700";
}
else if (position === 2) {
  div.classList.add("silver");
  div.style.background = "#f2f2f2";
  div.style.borderColor = "#aaa";
}
else if (position === 3) {
  div.classList.add("bronze");
  div.style.background = "#f8e1d4";
  div.style.borderColor = "#c97c4a";
}

  container.prepend(div);

  div.onclick = function () {
  if (!rankingActive) return;

  div.onclick = null;

  setTimeout(() => {
    revealNextRank();
  }, position === 1 ? 1200 : 700);
};

  
});

// 🎉 winner effects (only once)
if (position === 1) {
  setTimeout(() => launchConfetti(), 400);

  setTimeout(() => {
    if (!document.getElementById("playAgainBtn")) {
      let btn = document.createElement("button");
      btn.id = "playAgainBtn";
      btn.innerText = "Restart Game";
      btn.onclick = restartGame;
      btn.style.marginTop = "20px";

      container.appendChild(btn);
    }
  }, 600);
}
}

function getRankEmoji(index, total) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  if (index === 3) return "🎖️";
  if (index === 4) return "👏";
  return "⭐";
}


//CONFETTI FOR WINNER
function launchConfetti() {
  for (let i = 0; i < 40; i++) {
    let confetti = document.createElement("div");
    confetti.className = "confetti";

    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.animationDuration = (Math.random() * 1 + 1) + "s";

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 2000);
  }
}
