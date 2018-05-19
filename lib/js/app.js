'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Fetching questions
var questions = [];

var fetchQuestions = function fetchQuestions() {
    fetch('https://gist.githubusercontent.com/vergilius/6d869a7448e405cb52d782120b77b82c/raw/2ab0379eb07b2a7cd26c845b26ff5ed2a85b5064/history-flashcards.json').then(function (resp) {
        return resp.json();
    }).then(function (resp) {
        return questions = resp;
    }).then(function (resp) {
        return initApp(questions);
    });
};

fetchQuestions();

//Initializing app
var initApp = function initApp(questions) {
    questions.map(function (question) {

        //New instance for each question
        new Question(question);
    });
};

var allQuestions = [];

//Question class

var Question = function Question(question) {
    _classCallCheck(this, Question);

    this.question = question;

    var questionContainer = document.createElement('div');
    questionContainer.className = 'single-question sg-box';

    //Template fo single question
    questionContainer.innerHTML = '<svg class="sg-subject-icon">\n                                            <use xlink:href="#icon-subject-history"></use>\n                                        </svg>\n                                        <div class="single-question__text">\n                                            <div class="sg-text sg-text--standout sg-text--to-center">\n                                                ' + this.question.question + '\n                                            </div>\n                                        </div>\n                                        <div class = "single-question__button-container">\n                                            <button class="sg-button-primary sg-button-primary--inverse" onclick="validateAnswer(event)">\n                                                ' + this.question.answers[0].answer + '\n                                            </button>\n                                        </div>\n                                        <div class = "single-question__button-container">\n                                            <button class="sg-button-primary sg-button-primary--inverse" onclick="validateAnswer(event)">\n                                                ' + this.question.answers[1].answer + '\n                                            </button>\n                                        </div>\n                                        <div class="response sg-box">\n                                            <div class="response__content">\n                                                <h2 class="sg-text-bit sg-text-bit--xxlarge sg-text-bit--dark sg-text-bit--not-responsive">\n                                                    Great\n                                                </h2>\n                                                <button class="sg-button-primary sg-button-primary--dark">\n                                                    Next qestion\n                                                </button>\n                                            </div>\n                                        </div>\n                                    ';
    //Appending question to app container
    document.querySelector('#root').appendChild(questionContainer);
};

//Answer validation


var validateAnswer = function validateAnswer(e) {

    //Prevent user from fast clicking
    document.querySelectorAll('.sg-button-primary--inverse').forEach(function (element) {
        element.disabled = true;
    });

    var correctFlag = void 0;

    //Finding question based on clicked answer
    var clickedQuestion = questions.filter(function (question) {
        if (question.question === e.target.parentNode.parentNode.children[1].innerText.trim()) {
            return true;
        }
    });

    //Checking if the clicked answer is right
    clickedQuestion[0].answers.map(function (answer) {
        if (answer.answer.trim() === e.target.innerHTML.trim()) {
            correctFlag = answer.correct;
        };
    });

    //Showing response depending on user's answer
    showResponse(correctFlag, clickedQuestion);
};

var showResponse = function showResponse(correctFlag, clickedQuestion) {

    //Clearing array of questions
    allQuestions = [];

    //Adding all questions to array
    document.querySelectorAll('.single-question__text').forEach(function (element) {
        allQuestions.push(element.children[0]);
    });

    if (correctFlag) {
        allQuestions.map(function (singleQuestion) {
            if (singleQuestion.innerText === clickedQuestion[0].question) {

                //Showing response for correct question
                singleQuestion.parentNode.parentNode.children[4].style.display = 'flex';

                //Adding click listener to let user to display next question
                singleQuestion.parentNode.parentNode.children[4].children[0].children[1].addEventListener('click', function () {
                    singleQuestion.parentNode.parentNode.classList.add('single-question--correct');

                    //Removing qestion from html markup after animation is done
                    setTimeout(function () {
                        singleQuestion.parentNode.parentNode.remove();

                        //Checking if all questions were answered correctly
                        if (allQuestions.length === 1) {

                            //Final message markup
                            var finalMessage = document.createElement('div');
                            finalMessage.className = 'final-message';
                            finalMessage.innerHTML = '\n                                                    <h1 class="sg-text-bit sg-text-bit--xlarge sg-text-bit--light sg-text-bit--not-responsive">\n                                                        Congrats!\n                                                    </h1>\n                                                    ';
                            document.querySelector('#root').appendChild(finalMessage);
                        };

                        document.querySelectorAll('.sg-button-primary--inverse').forEach(function (element) {
                            element.disabled = false;
                        });
                    }, 1000);
                });
            }
        });
    } else {
        allQuestions.map(function (singleQuestion) {
            if (singleQuestion.innerText === clickedQuestion[0].question) {

                //Cloning clicked element if answer is incorrect
                var cloned = singleQuestion.parentNode.parentNode.cloneNode(true);

                //Adding cloned element to the beggining of the markup
                document.querySelector('#root').insertAdjacentElement('afterbegin', cloned);

                //Adding animation 
                singleQuestion.parentNode.parentNode.classList.add('single-question--incorrect');

                //Removing question after animation is done
                setTimeout(function () {
                    document.querySelector('.single-question--incorrect').remove();

                    document.querySelectorAll('.sg-button-primary--inverse').forEach(function (element) {
                        element.disabled = false;
                    });
                }, 1000);
            }
        });
    }
};