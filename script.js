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
  text: "Qual destas expressões indica passado?",
  options: [
    { text: "tomorrow", score: 0, type: "Wrong", explanation: "'Tomorrow' significa amanhã, portanto indica futuro. A resposta correta era 'yesterday'." },

    { text: "this year", score: 0, type: "Wrong", explanation: "'This year' significa 'esse ano' e se refere ao presente. A resposta correta era 'yesterday'." },

    { text: "yesterday", score: 1, type: "Correct", explanation: "Correto! 'Yesterday' significa ontem e é uma expressão usada para falar sobre o passado." },

    { text: "today", score: 0, type: "Wrong", explanation: "'Today' significa 'hoje' e se refere ao presente. A resposta correta era 'yesterday'." }
  ]
},

  
{
  text: "A expressão 'five years ago' significa:",
  options: [
    { text: "daqui a cinco anos", score: 0, type: "Wrong", explanation: "Essa expressão indica futuro. 'Five years ago' significa algo que aconteceu no passado." },

    { text: "há cinco anos", score: 1, type: "Correct", explanation: "Correto! 'Five years ago' significa há cinco anos." },

    { text: "durante cinco anos", score: 0, type: "Wrong", explanation: "Essa tradução não corresponde à expressão. 'Five years ago' significa há cinco anos." },

    { text: "em cinco anos", score: 0, type: "Wrong", explanation: "Essa expressão indica futuro. A resposta correta era 'há cinco anos'." }
  ]
},

  {
  text: "Qual destes verbos é REGULAR?",
  options: [
    { text: "won", score: 0, type: "Wrong", explanation: "'Won' é um verbo irregular. O correto era 'watched'." },

    { text: "went", score: 0, type: "Wrong", explanation: "'Went' é um verbo irregular. O correto era 'watched'." },

    { text: "saw", score: 0, type: "Wrong", explanation: "'Saw' é um verbo irregular. O correto era 'watched'." },

    { text: "watched", score: 1, type: "Correct", explanation: "Correto! 'Watched' é um verbo regular porque segue o padrão verbo + ed." }
  ]
},

  {
  text: "Qual destas expressões significa 'há dois dias'?",
  options: [
    { text: "in two days", score: 0, type: "Wrong", explanation: "'In two days' significa daqui a dois dias. A resposta correta era 'two days ago'." },

    { text: "two days ago", score: 1, type: "Correct", explanation: "Correto! 'Two days ago' significa há dois dias." },

    { text: "for two days", score: 0, type: "Wrong", explanation: "'For two days' significa por dois dias. A resposta correta era 'two days ago'." },

    { text: "the next two days", score: 0, type: "Wrong", explanation: "Essa expressão se refere ao futuro. A resposta correta era 'two days ago'." }
  ]
},

  {
  text: "Qual destes verbos é o passado de 'play'?",
  options: [
    { text: "plays", score: 0, type: "Wrong", explanation: "'Plays' está no presente. A resposta correta era 'played'." },

    { text: "playing", score: 0, type: "Wrong", explanation: "'Playing' indica uma ação em andamento. A resposta correta era 'played'." },

    { text: "played", score: 1, type: "Correct", explanation: "Correto! 'Played' é o Simple Past do verbo 'play'." },

    { text: "playd", score: 0, type: "Wrong", explanation: "Está faltando uma letra. A resposta correta era 'played'." }
  ]
},

  {
  text: "Qual destes verbos é IRREGULAR?",
  options: [
    { text: "played", score: 0, type: "Wrong", explanation: "'Played' é um verbo regular. A resposta correta era 'won'." },

    { text: "trained", score: 0, type: "Wrong", explanation: "'Trained' é um verbo regular. A resposta correta era 'won'." },

    { text: "celebrated", score: 0, type: "Wrong", explanation: "'Celebrated' é um verbo regular. A resposta correta era 'won'." },

    { text: "won", score: 1, type: "Correct", explanation: "Correto! 'Won' é o passado de 'win' e é um verbo irregular." }
  ]
},


 {
  text: "Qual frase fala sobre algo que aconteceu no passado?",
  options: [
    { text: "Brazil will win the World Cup.", score: 0, type: "Wrong", explanation: "A palavra 'will' indica futuro. A resposta correta era 'Brazil won the World Cup in 2002.'." },

    { text: "Brazil is playing today.", score: 0, type: "Wrong", explanation: "A frase está falando de uma ação acontecendo agora. A resposta correta era 'Brazil won the World Cup in 2002.'." },

    { text: "Brazil won the World Cup in 2002.", score: 1, type: "Correct", explanation: "Correto! O verbo 'won' está no passado e o ano 2002 indica um evento passado." },

    { text: "Brazil can win the World Cup.", score: 0, type: "Wrong", explanation: "A frase fala sobre possibilidade, não sobre um fato passado. A resposta correta era 'Brazil won the World Cup in 2002.'." }
  ]
},

 {
  text: "Na frase 'Many fans celebrated yesterday.', o que nos diz QUANDO a ação aconteceu?",
  options: [
    { text: "many", score: 0, type: "Wrong", explanation: "'Many' significa muitos. Não indica tempo. A resposta correta era 'yesterday'." },

    { text: "fans", score: 0, type: "Wrong", explanation: "'Fans' significa torcedores. Não indica tempo. A resposta correta era 'yesterday'." },

    { text: "celebrated", score: 0, type: "Wrong", explanation: "'Celebrated' está no passado, mas a pergunta pede a palavra que indica quando aconteceu. A resposta correta era 'yesterday'." },

    { text: "yesterday", score: 1, type: "Correct", explanation: "Correto! 'Yesterday' significa ontem e mostra claramente que a ação aconteceu no passado." }
  ]
},

  {
  text: "Qual destes verbos é o passado de 'win'?",
  options: [
    { text: "winned", score: 0, type: "Wrong", explanation: "'Winned' não existe em inglês. A resposta correta era 'won'." },

    { text: "won", score: 1, type: "Correct", explanation: "Correto! 'Won' é o passado irregular do verbo 'win'." },

    { text: "wins", score: 0, type: "Wrong", explanation: "'Wins' está no presente. A resposta correta era 'won'." },

    { text: "winning", score: 0, type: "Wrong", explanation: "'Winning' indica uma ação em andamento. A resposta correta era 'won'." }
  ]
},

  {
  text: "Na frase 'The fans watched the match last night.', quais são as duas pistas que indicam que a frase está no passado?",
  options: [
    { text: "fans e match", score: 0, type: "Wrong", explanation: "Essas palavras não indicam passado. A resposta correta era 'watched e last night'." },

    { text: "watched e last night", score: 1, type: "Correct", explanation: "Correto! O verbo no passado e a expressão temporal mostram que a ação aconteceu no passado." },

    { text: "fans e watched", score: 0, type: "Wrong", explanation: "'Fans' não indica passado. A resposta correta era 'watched e last night'." },

    { text: "the e match", score: 0, type: "Wrong", explanation: "Essas palavras não indicam tempo. A resposta correta era 'watched e last night'." }
  ]
},

  {
  text: "Na frase 'Brazil played against Haiti.', qual palavra está no Simple Past?",
  options: [
    { text: "Brazil", score: 0, type: "Wrong", explanation: "'Brazil' é o sujeito da frase. A resposta correta era 'played'." },

    { text: "against", score: 0, type: "Wrong", explanation: "'Against' é uma preposição. A resposta correta era 'played'." },

    { text: "Haiti", score: 0, type: "Wrong", explanation: "'Croatia' é um país. A resposta correta era 'played'." },

    { text: "played", score: 1, type: "Correct", explanation: "Correto! 'Played' é o verbo no Simple Past." }
  ]
},

  {
  text: "Na frase 'Germany won the World Cup in 2014.', como sabemos que ela fala do passado?",
  options: [
    { text: "Porque aparece o país Germany", score: 0, type: "Wrong", explanation: "O nome do país não indica tempo. A resposta correta era a alternativa que menciona 'won' e '2014'." },

    { text: "Porque aparece o evento World Cup", score: 0, type: "Wrong", explanation: "World Cup é apenas o assunto da frase. A resposta correta era a alternativa que menciona 'won' e '2014'." },

    { text: "Porque aparece o verbo 'won' e o ano 2014", score: 1, type: "Correct", explanation: "Correto! Tanto o verbo 'won' quanto o ano '2014' mostram que a frase fala do passado." },

    { text: "Porque aparece a palavra 'the'", score: 0, type: "Wrong", explanation: "'The' é apenas um artigo. A resposta correta era a alternativa que menciona 'won' e '2014'." }
  ]
},

  {
  text: "Qual destas frases está INCORRETA no passado?",
  options: [
    { text: "The team won last year.", score: 0, type: "Wrong", explanation: "Essa frase está correta no passado. A resposta correta era 'The fans watch the match yesterday.'." },

    { text: "The fans watch the match yesterday.", score: 1, type: "Correct", explanation: "Correto! A frase está incorreta porque 'watch' deveria estar no passado: 'watched'." },

    { text: "The team trained last week.", score: 0, type: "Wrong", explanation: "Essa frase está correta no passado. A resposta correta era 'The fans watch the match yesterday.'." },

    { text: "Brazil won the World Cup in 2002.", score: 0, type: "Wrong", explanation: "Essa frase está correta no passado. A resposta correta era 'The fans watch the match yesterday.'." }
  ]
},

  {
  text: "Qual destas frases apresenta um verbo irregular E uma expressão de passado?",
  options: [
    { text: "The team won last year.", score: 1, type: "Correct", explanation: "Correto! 'Won' é um verbo irregular e 'last year' é uma expressão de passado." },

    { text: "The team wins every year.", score: 0, type: "Wrong", explanation: "O verbo está no presente. A resposta correta era 'The team won last year.'." },

    { text: "The team will win next year.", score: 0, type: "Wrong", explanation: "A frase está no futuro. A resposta correta era 'The team won last year.'." },

    { text: "The team is winning now.", score: 0, type: "Wrong", explanation: "A frase fala de uma ação em andamento. A resposta correta era 'The team won last year.'." }
  ]
},

 {
  text: "Qual frase contém um verbo REGULAR?",
  options: [
    { text: "Uruguay won the first World Cup.", score: 0, type: "Wrong", explanation: "'Won' é um verbo irregular. A resposta correta era 'Fans watched the final.'." },

    { text: "Fans watched the final.", score: 1, type: "Correct", explanation: "Correto! 'Watched' é um verbo regular formado com -ed." },

    { text: "People went to Qatar.", score: 0, type: "Wrong", explanation: "'Went' é um verbo irregular. A resposta correta era 'Fans watched the final.'." },

    { text: "Many fans saw the match.", score: 0, type: "Wrong", explanation: "'Saw' é um verbo irregular. A resposta correta era 'Fans watched the final.'." }
  ]
},


  {
  text: "Qual frase contém um verbo IRREGULAR?",
  options: [
    { text: "Brazil played very well.", score: 0, type: "Wrong", explanation: "'Played' é um verbo regular. A resposta correta era 'Spain won the World Cup in 2010.'." },

    { text: "Fans celebrated after the match.", score: 0, type: "Wrong", explanation: "'Celebrated' é um verbo regular. A resposta correta era 'Spain won the World Cup in 2010.'." },

    { text: "Spain won the World Cup in 2010.", score: 1, type: "Correct", explanation: "Correto! 'Won' é um verbo irregular." },

    { text: "The team trained every day.", score: 0, type: "Wrong", explanation: "'Trained' é um verbo regular. A resposta correta era 'Spain won the World Cup in 2010.'." }
  ]
},

  {
  text: "Qual destas expressões NÃO indica passado?",
  options: [
    { text: "yesterday", score: 0, type: "Wrong", explanation: "'Yesterday' significa ontem e indica passado. A resposta correta era 'next month'." },

    { text: "last year", score: 0, type: "Wrong", explanation: "'Last year' significa ano passado e indica passado. A resposta correta era 'next month'." },

    { text: "in 2014", score: 0, type: "Wrong", explanation: "Um ano passado indica passado. A resposta correta era 'next month'." },

    { text: "today", score: 1, type: "Correct", explanation: "Correto! 'Today' significa hoje e indica presente." }
  ]
},

  {
  text: "Observe a frase: 'Fans celebrated yesterday.' Quais são as duas pistas que mostram que ela está falando do passado?",
  options: [
    { text: "fans e yesterday", score: 0, type: "Wrong", explanation: "'Fans' não indica passado. A resposta correta era 'celebrated e yesterday'." },

    { text: "celebrated e yesterday", score: 1, type: "Correct", explanation: "Correto! O verbo no passado e a expressão temporal mostram que a frase fala do passado." },

    { text: "fans e celebrated", score: 0, type: "Wrong", explanation: "'Fans' não indica passado. A resposta correta era 'celebrated e yesterday'." },

    { text: "many e fans", score: 0, type: "Wrong", explanation: "Nenhuma dessas palavras indica passado. A resposta correta era 'celebrated e yesterday'." }
  ]
},

  {
  text: "Observe a frase: 'Many people watched the match last week.' O que indica que a frase está no passado?",
  options: [
    { text: "só 'watched'", score: 0, type: "Wrong", explanation: "'Watched' ajuda a indicar passado, mas não é a resposta mais completa. A resposta correta era 'watched e last week'." },

    { text: "só 'last week'", score: 0, type: "Wrong", explanation: "'Last week' ajuda a indicar passado, mas não é a resposta mais completa. A resposta correta era 'watched e last week'." },

    { text: "'watched' e 'last week'", score: 1, type: "Correct", explanation: "Correto! Tanto o verbo quanto a expressão temporal mostram que a frase fala do passado." },

    { text: "match", score: 0, type: "Wrong", explanation: "'Match' significa partida e não indica tempo. A resposta correta era 'watched e last week'." }
  ]
},

  {
  text: "Qual frase mostra um verbo regular no simple past E uma expressão de passado?",
  options: [
    { text: "Fans celebrated yesterday.", score: 1, type: "Correct", explanation: "Correto! 'Celebrated' é um verbo regular e 'yesterday' é uma expressão de passado." },

    { text: "They played soccer.", score: 0, type: "Wrong", explanation: "'Played' está no simple past, mas não temos uma expressão de passado. A resposta correta era 'Fans celebrated yesterday.'." },

    { text: "They are watching the game.", score: 0, type: "Wrong", explanation: "A frase fala de uma ação acontecendo agora. A resposta correta era 'Fans celebrated yesterday.'." },

    { text: "Fans are celebrating now.", score: 0, type: "Wrong", explanation: "A frase fala de uma ação acontecendo agora. 'Now' é uma expressão de tempo, mas não de tempo passado. A resposta correta era 'Fans celebrated yesterday.'." }
  ]
},

 {
  text: "Observe a frase: 'France won the World Cup in 2018.' O verbo 'won' significa:",
  options: [
    { text: "participou", score: 0, type: "Wrong", explanation: "'Participou' está no passado, mas não é o significado correto. A resposta correta era 'ganhou'." },

    { text: "jogou", score: 0, type: "Wrong", explanation: "'Jogou' está no passado, mas não é o significado correto. A resposta correta era 'ganhou'." },

    { text: "ganhou", score: 1, type: "Correct", explanation: "Correto! 'Won' é o passado do verbo 'win' e significa 'ganhou'." },

    { text: "ganhando", score: 0, type: "Wrong", explanation: "'Ganhando' indica uma ação em andamento. A resposta correta era 'ganhou'." }
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
