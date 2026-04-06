const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const restartBtn = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");

const scoreDisplay = document.getElementById("score-display");
const historyList = document.getElementById("history-list");


const quizQuestions = [
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language","High Tech","Home Tool","Hyper Tool"],
    correctAnswer: 0
  },
  {
    question: "Which keyword creates constant?",
    options: ["var","let","const","static"],
    correctAnswer: 2
  },
  {
    question: "CSS property for text size?",
    options: ["font-style","font-size","text-size","size"],
    correctAnswer: 1
  },
  {
    question: "Store data in LocalStorage?",
    options: ["save()","setItem()","add()","store()"],
    correctAnswer: 1
  },
  {
    question: "Single line comment in JS?",
    options: ["<!-- -->","//","##","/* */"],
    correctAnswer: 1
  }
];


let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;

function displayQuestion() {
  const q = quizQuestions[currentQuestionIndex];
  questionText.textContent = q.question;
  optionsContainer.innerHTML = "";

  q.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.classList.add("option-btn");

    btn.onclick = () => selectOption(index);

    optionsContainer.appendChild(btn);
  });
}


function selectOption(index) {
  const q = quizQuestions[currentQuestionIndex];
  userAnswers[currentQuestionIndex] = index;

  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;

    if (i === q.correctAnswer) btn.classList.add("correct");
    if (i === index && i !== q.correctAnswer)
      btn.classList.add("incorrect");
  });
}


function nextQuestion() {
  if (userAnswers[currentQuestionIndex] === undefined) {
    alert("Select an answer!");
    return;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < quizQuestions.length)
    displayQuestion();
  else
    showResults();
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}


function showResults() {
  score = 0;

  quizQuestions.forEach((q, i) => {
    if (userAnswers[i] === q.correctAnswer) score++;
  });

  scoreDisplay.textContent =
    `Your Score: ${score}/${quizQuestions.length}`;

  saveScore();
  displayHistory();

  quizScreen.classList.add("hidden");
  resultsScreen.classList.remove("hidden");
}


function saveScore() {
  const scores =
    JSON.parse(localStorage.getItem("scores")) || [];

  scores.push({
    score,
    total: quizQuestions.length,
    percentage: Math.round(score / quizQuestions.length * 100),
    date: new Date().toLocaleString()
  });

  localStorage.setItem("scores", JSON.stringify(scores));
}


function displayHistory() {
  const scores =
    JSON.parse(localStorage.getItem("scores")) || [];

  historyList.innerHTML = "";

  scores.forEach(a => {
    const li = document.createElement("li");
    li.classList.add("history-item");

    li.innerHTML =
      `Score: ${a.score}/${a.total} (${a.percentage}%)<br>${a.date}`;

    historyList.appendChild(li);
  });
}


function clearHistory() {
  if (confirm("Clear history?")) {
    localStorage.removeItem("scores");
    displayHistory();
  }
}


function startQuiz() {
  currentQuestionIndex = 0;
  userAnswers = [];
  score = 0;

  startScreen.classList.add("hidden");
  resultsScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  displayQuestion();
}


function restartQuiz() {
  resultsScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}


startBtn.onclick = startQuiz;
nextBtn.onclick = nextQuestion;
prevBtn.onclick = prevQuestion;
restartBtn.onclick = restartQuiz;
document.getElementById("clear-history-btn").onclick = clearHistory;

document.addEventListener("DOMContentLoaded", displayHistory);