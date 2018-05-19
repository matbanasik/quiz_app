//Fetching questions
let questions = []

const fetchQuestions = () => {
    fetch('https://gist.githubusercontent.com/vergilius/6d869a7448e405cb52d782120b77b82c/raw/2ab0379eb07b2a7cd26c845b26ff5ed2a85b5064/history-flashcards.json')
        .then(resp => resp.json())
        .then(resp => questions = resp)
        .then(resp => initApp(questions))
}   

fetchQuestions();

//Initializing app
const initApp = (questions) => {
    questions.map(question => {

        //New instance for each question
        new Question(question);
    })
};

let allQuestions = [];

//Question class
class Question{
    constructor(question){
        this.question = question;

        let questionContainer = document.createElement('div')
        questionContainer.className = 'single-question sg-box'

        //Template fo single question
        questionContainer.innerHTML = `<svg class="sg-subject-icon">
                                            <use xlink:href="#icon-subject-history"></use>
                                        </svg>
                                        <div class="single-question__text">
                                            <div class="sg-text sg-text--standout sg-text--to-center">
                                                ${this.question.question}
                                            </div>
                                        </div>
                                        <div class = "single-question__button-container">
                                            <button class="sg-button-primary sg-button-primary--inverse" onclick="validateAnswer(event)">
                                                ${this.question.answers[0].answer}
                                            </button>
                                        </div>
                                        <div class = "single-question__button-container">
                                            <button class="sg-button-primary sg-button-primary--inverse" onclick="validateAnswer(event)">
                                                ${this.question.answers[1].answer}
                                            </button>
                                        </div>
                                        <div class="response sg-box">
                                            <div class="response__content">
                                                <h2 class="sg-text-bit sg-text-bit--xxlarge sg-text-bit--dark sg-text-bit--not-responsive">
                                                    Great
                                                </h2>
                                                <button class="sg-button-primary sg-button-primary--dark">
                                                    Next qestion
                                                </button>
                                            </div>
                                        </div>
                                    `
        //Appending question to app container
        document.querySelector('#root').appendChild(questionContainer);
    };
}


//Answer validation
const validateAnswer = (e) => {

    //Prevent user from fast clicking
    document.querySelectorAll('.sg-button-primary--inverse').forEach((element) =>{
        element.disabled = true;
    });

    let correctFlag;

    //Finding question based on clicked answer
    let clickedQuestion = questions.filter(question => {
        if (question.question === e.target.parentNode.parentNode.children[1].innerText.trim()){
            return true;
        }
    });

    //Checking if the clicked answer is right
    clickedQuestion[0].answers.map(answer => {
        if (answer.answer.trim() === e.target.innerHTML.trim()){
            correctFlag = answer.correct;
        };
    });


    //Showing response depending on user's answer
    showResponse(correctFlag, clickedQuestion);
}


const showResponse = (correctFlag, clickedQuestion) => {

    //Clearing array of questions
    allQuestions = [];

    //Adding all questions to array
    document.querySelectorAll('.single-question__text').forEach((element) => {
        allQuestions.push(element.children[0]);
    });

    


    if (correctFlag){
        allQuestions.map(singleQuestion => {
            if (singleQuestion.innerText === clickedQuestion[0].question){

                //Showing response for correct question
                singleQuestion.parentNode.parentNode.children[4].style.display = 'flex';

                //Adding click listener to let user to display next question
                singleQuestion.parentNode.parentNode.children[4].children[0].children[1].addEventListener('click', () => {
                    singleQuestion.parentNode.parentNode.classList.add('single-question--correct');

                    //Removing qestion from html markup after animation is done
                    setTimeout(() => {
                        singleQuestion.parentNode.parentNode.remove();


                        //Checking if all questions were answered correctly
                        if(allQuestions.length === 1){

                            //Final message markup
                            let finalMessage = document.createElement('div');
                            finalMessage.className = 'final-message';
                            finalMessage.innerHTML = `
                                                    <h1 class="sg-text-bit sg-text-bit--xlarge sg-text-bit--light sg-text-bit--not-responsive">
                                                        Congrats!
                                                    </h1>
                                                    `
                            document.querySelector('#root').appendChild(finalMessage);
                        };

                        document.querySelectorAll('.sg-button-primary--inverse').forEach((element) =>{
                            element.disabled = false;
                        });

                    }, 1000);
                })
            }
        });
        
    }else{
        allQuestions.map(singleQuestion => {
            if (singleQuestion.innerText === clickedQuestion[0].question){

                //Cloning clicked element if answer is incorrect
                let cloned = singleQuestion.parentNode.parentNode.cloneNode(true);

                //Adding cloned element to the beggining of the markup
                document.querySelector('#root').insertAdjacentElement('afterbegin', cloned);
                
                //Adding animation 
                singleQuestion.parentNode.parentNode.classList.add('single-question--incorrect');


                //Removing question after animation is done
                setTimeout(() => {
                    document.querySelector('.single-question--incorrect').remove();

                    document.querySelectorAll('.sg-button-primary--inverse').forEach((element) =>{
                        element.disabled = false;
                    });
                }, 1000);

            }
        });
    }
}