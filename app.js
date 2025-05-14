const quizContainer = document.querySelector(".quiz-container");
const configContainer = document.querySelector(".config-container");
const answerOption = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");

const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "programming";
let currentQuestion = null;
let numberOfQuestion = 10;
const questionIndexHistory = [];
let correctAnswerCount = 0;

const showQuizResult = () => {
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";

  const resultText = `You answered <b>${correctAnswerCount}</b> out of <b>${numberOfQuestion}</b>questions correctly. Great effort!`;
  document.querySelector(".result-message").innerHTML = resultText;
};

const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timerDisplay.textContent = `${currentTime}`;
};

const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`;

    if (currentTime <= 0) {
      clearInterval(timer);
      highlightCorrectAnswer();
      nextQuestionBtn.style.visibility = "visible";
      quizContainer.querySelector(".answer-options").forEach(option => option.style.pointerEvents = "none").style.background = "#cr1402";

      answerOption
        .querySelectorAll(".answer-option")
        .forEach((option) => (option.style.pointerEvents = none));
    }
  }, 1000);
};

const getRandomQuestion = () => {
  const categoryQuestion =
    questions.find(
      (cat) => cat.category.toLowerCase() === quizCategory.toLowerCase()
    ).questions || [];

  if (
    questionIndexHistory.length >=
    Math.min(categoryQuestion.length, numberOfQuestion)
  ) {
    return showQuizResult();
  }

  const availableQuestion = categoryQuestion.filter(
    (_, index) => !questionIndexHistory.includes(index)
  );
  const randomQuestion =
    categoryQuestion[Math.floor(Math.random() * availableQuestion.length)];

  questionIndexHistory.push(categoryQuestion.indexOf(randomQuestion));
  return randomQuestion;
};

const highlightCorrectAnswer = () => {
  const correctOption =
    answerOption.querySelectorAll(".answer-options")[
      currentQuestion.correctAnswer
    ];
  correctOption.classList.add("correct");
  const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;
  correctOption.insertAdjacentHTML("beforeend", iconHTML);
};

const handelAnswer = (option, answerIndex) => {
  clearInterval(timer);
  const isCorrect = currentQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "incorrect");
  !isCorrect ? highlightCorrectAnswer() : correctAnswerCount++;

  const iconHTML = `<span class="material-symbols-rounded">${
    isCorrect ? "check_circle" : "cancel"
  }</span>`;
  correctOption.insertAdjacentHTML("beforeend", iconHTML);

  answerOption
    .querySelectorAll(".answer-option")
    .forEach((option) => (option.style.pointerEvents = none));

  nextQuestionBtn.style.visibility = "visible";
};

const renderQuestion = () => {
  currentQuestion = getRandomQuestion();
  if (!currentQuestion) return;

  resetTimer();
  startTimer();

  answerOption.innerHTML = "";
  nextQuestionBtn.style.visibility = "hidden";
  quizContainer.querySelector(".answer-options").forEach(option => option.style.pointerEvents = "none").style.background = "#32313c"

  document.querySelector(".question-text").textContent =
    currentQuestion.question;
  questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestion}</b> Questions`;

  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-options");
    li.textContent = option;
    answerOption.appendChild(li);
    li.addEventListener("click", () => {
      handelAnswer(li, index);
    });
  });
};

const startQuiz = () =>{
  configContainer.style.display = "none"
  quizContainer.style.display = "block";

   quizCategory = configContainer.querySelector(".category-option.active").textContent;
   numberOfQuestion = paresInt(configContainer.querySelector(".question-option.active").textContent);

  renderQuestion();
}

document.querySelectorAll(".category-options", ".question-options").forEach(option => {
  option.addEventListener("click", () =>{
    option.parentNode.querySelector(".active").classList.remove("active");
    option.classList.add("active");
  })
})

const resetQuiz = () =>{
  resetTimer();
  correctAnswerCount = 0;
  questionIndexHistory.length = 0;
  configContainer.style.display = "block"
  resultContainer.style.display = "none";
}

renderQuestion();

nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".text-again-btn").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);