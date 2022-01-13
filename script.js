const quizUrl = "https://opentdb.com/api.php?amount=10";
const questionDiv = document.querySelector(".question");
const answersDiv = document.querySelector(".container-answers");
const quizScore = document.querySelector(".quiz-score");
const changeColor = document.querySelector(".answer1");
const selects = document.querySelector(".select");
const buttonStart = document.querySelector(".start");
const categoryDiv = document.querySelector(".category");
const finished = document.querySelector(".finish");
let questions = [];
let goodAnswers = 0;

const showQuestion = (num) => {
  const questionText = questions[num].question;
  const correctAnswer = questions[num].correct_answer;
  const incorrectAnswers = questions[num].incorrect_answers;
  const category = questions[num].category;
  const difficulty = questions[num].difficulty;
  let answers = [correctAnswer, ...incorrectAnswers].sort(() => {
    return Math.random() - 0.5;
  });
  questionDiv.innerHTML = questionText;
  answersDiv.innerHTML = answers
    .map((text) => {
      return `<button class="answer" onclick="checkAnswer('${text}', '${correctAnswer}', ${num})">${text}</button>`;
    })
    .join("");
  categoryDiv.innerHTML = category;
};

const checkAnswer = (answer, correctAnswer, questionIndex) => {
  const nodeList = document.querySelectorAll(".answer");
  const answers = [...nodeList];
  const [goodAnswer] = answers.filter((el) => el.textContent === correctAnswer);
  answers.forEach((button) => (button.disabled = true));
  console.log(goodAnswer);
  goodAnswer.classList.add("correct");

  if (answer !== correctAnswer) {
    if (questionIndex + 1 === questions.length) {
      quizScore.textContent = `Koniec ! wynik: ` + quizScore.textContent;
      finished.classList.remove("hidden");
    } else {
      setTimeout(() => {
        showQuestion(questionIndex + 1);
      }, 1000);
    }
  } else if (answer === correctAnswer) {
    goodAnswers++;
    quizScore.innerHTML = `${goodAnswers}/${questions.length}`;
    if (questionIndex + 1 === questions.length) {
      quizScore.textContent = `Koniec ! wynik: ` + quizScore.textContent;
      finished.classList.remove("hidden");
    } else {
      setTimeout(() => {
        showQuestion(questionIndex + 1);
      }, 1000);
    }
  }
};

const fetchQuiz = async (id) => {
  const response = await fetch(quizUrl + `&category=${id}`);
  const data = await response.json();
  console.log(data);
  questions = data.results;
  quizScore.innerHTML = "0/" + questions.length;
  showQuestion(0);
};
const fetchCategories = async () => {
  const response = await fetch("https://opentdb.com/api_category.php");
  const data = await response.json();
  console.log(data);
  selects.innerHTML = data["trivia_categories"].map(
    (el) => `<option value="${el.id}">${el.name}</option>`
  );
  selects.addEventListener("change", (event) => {
    console.log(event.target.value);
    fetchQuiz(event.target.value);
  });
};
fetchCategories();
fetchQuiz(9);

// fetchQuiz();
