/*******************************
*********QUIZ CONTROLLER********
*******************************/
var quizController = (function() {

    //*********Question Constructor*********/
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    var questionLocalStorage = {
        setQuestionCollection: function(newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function() {
            return JSON.parse(localStorage.getItem('questionCollection'));
        }, 
        removeQuestionCollection: function() {
            localStorage.removeItem('questionCollection');
        }
    }

    if(questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }

    const quizProgress = {
        questionIndex: 0
    }

    // ******PERSON CONSTRUCTOR**********

    function Person(id, firstName, lastName, score) {
        this.id = id;
        this.firstName = firstName;
        this.lastName  = lastName;
        this.score = score;
    }

    const currentPersonData = {
        fullName: [],
        score: 0
    }

    const adminFullName = ['hemanta', 'sundaray'];

    const personLocalStorage = {

        setPersonData: function(newPersonData) {
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },

        getPersonData: function() {
            return JSON.parse(localStorage.getItem('personData')); 
        },

        removePersonData: function() {
            localStorage.removeItem('personData');
        }
    }
    
    if(personLocalStorage.getPersonData() === null) {
        personLocalStorage.setPersonData([]);
    }


    return {

        getPersonLocalStorage : personLocalStorage,

        getAdminFullName: adminFullName,

        getCurrPersonData: currentPersonData,

        getQuizProgress: quizProgress,

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: function(newQuestText, opts) {

            let optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;

            if(questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }

            isChecked = false;

            optionsArr = [];

            for(let i = 0; i < opts.length; i++) {
                if(opts[i].value !== "") {
                    optionsArr.push(opts[i].value);
                }
                if(opts[i].previousElementSibling.checked && opts[i].value !== "") {
                    corrAns = opts[i].value;
                    isChecked = true;
                }
            }

            if(questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }

            if (newQuestText.value !== "") {

                if (optionsArr.length > 1) { 

                    if (isChecked !== false) {

                        newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
                        getStoredQuests = questionLocalStorage.getQuestionCollection();
                        getStoredQuests.push(newQuestion);
                        questionLocalStorage.setQuestionCollection(getStoredQuests);
            
                        newQuestText.value = "";
            
                        for (let x = 0; x < opts.length; x++) {
                            opts[x].value = "";
                            opts[x].previousElementSibling.checked = false;
                        }

                        return true;
    
                    } else {
                        alert('You missed to check a correct answer or you checked answer without value.');
                        return false;
                    }
                } else {
                    alert('You must enter at least two options.');
                    return false;
                }
            } else {
                alert('You must enter a question.');
                return false;
            }

        },

        checkAnswer: function (ans) {

            if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {

                currentPersonData.score++;

                return true;

            } else {

                return false;
            }
        },

        isFinished: function() {
            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
        },

        addPerson: function() {

            let newPerson, personId, personData;

            if(personLocalStorage.getPersonData().length > 0)  {
                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
            } else {
                personId = 0;
            }

            newPerson = new Person(personId, currentPersonData.fullName[0], currentPersonData.fullName[1], currentPersonData.score );

            personData = personLocalStorage.getPersonData();

            personData.push(newPerson);

            personLocalStorage.setPersonData(personData);

        }
    };

})();

/*******************************
**********UI CONTROLLER*********
*******************************/
// 2
var UIController = (function() {

    var domItems = {
        //*******Admin Panel Elements********/
        adminPageSection: document.querySelector('.admin-panel-container'),
        questInsertBtn:  document.getElementById('question-insert-btn'), 
        newQuestionText: document.getElementById('new-question-text'), 
        adminOptions:    document.querySelectorAll('.admin-option'),
        adminOptionsContainer: document.querySelector('.admin-options-container'),
        insertedQuestsWrapper: document.querySelector('.inserted-questions-wrapper'),
        questUpdateBtn: document.getElementById('question-update-btn'), 
        questDeleteBtn: document.getElementById('question-delete-btn'),
        questClearBtn:  document.getElementById('questions-clear-btn'),
        resultsListWrapper: document.querySelector('.results-list-wrapper'),
        clearResultsBtn: document.getElementById('results-clear-btn'),
        // **********Quiz Section Elements************
        quizPageSection: document.querySelector('.quiz-container'),
        askedQuestText: document.getElementById('asked-question-text'),
        quizOptionsWrapper: document.querySelector('.quiz-options-wrapper'),
        progressBar: document.querySelector('.progressBar'),
        progressPar: document.getElementById('progress'),
        instAnsContainer: document.querySelector('.instant-answer-container'),
        instAnsText: document.getElementById('instant-answer-text'),
        instAnsWrapper: document.getElementById('instant-answer-wrapper'),
        emotion: document.getElementById('emotion'),
        nextQuestionBtn: document.getElementById('next-question-btn'),
        // *********Landing Page Elements ************
        landPageSection: document.querySelector('.landing-page-container'),
        startQuizBtn: document.getElementById('start-quiz-btn'),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),
        // ***********Final score section Elements**********
        finalresultsSection: document.querySelector('.final-result-container'),
        finalScoreText: document.getElementById('final-score-text'),
    }

    return {
        getDomItems: domItems,
        
        addInputsDynamically: function() {

            const addInput = function () {

                let inputHTML, z;

                z = document.querySelectorAll('.admin-option').length;

                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + z + '" name="answer" value="' + z + '"><input type="text" class="admin-option admin-option-' + z + '" value=""></div>';
            
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);

                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);

           }

            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },

        createQuestionList: function(getQuestions) {

            let questHTML, numberingArr;

            numberingArr = [];
            
            domItems.insertedQuestsWrapper.innerHTML = "";

            for (let i = 0; i <getQuestions.getQuestionCollection().length; i++ ) {

                numberingArr.push(i + 1);

                questHTML = '<p><span>' + numberingArr[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';

                domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);

            }

        },

        editQuestionList: function(event, storageQuestionList, createQuestsList) {

            let getId, getStorageQuestionList, foundItem, locationInArr, optionHTML;

            if(event.target.id.includes('question-')) {

                getId = parseInt(event.target.id.split('-')[1]);

                getStorageQuestionList = storageQuestionList.getQuestionCollection();
                
                for(let i=0; i < getStorageQuestionList.length; i++) {

                    if (getStorageQuestionList[i].id === getId) {

                        foundItem = getStorageQuestionList[i];

                        locationInArr = i;

                    }
                }

                domItems.newQuestionText.value = foundItem.questionText;

                domItems.adminOptionsContainer.innerHTML = "";

                optionHTML = '';

                for (let x = 0; x < foundItem.options.length; x ++) {

                    optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>';
  
                }

                domItems.adminOptionsContainer.innerHTML = optionHTML;

                domItems.questUpdateBtn.style.visibility = 'visible';
                domItems.questDeleteBtn.style.visibility = 'visible';
                domItems.questInsertBtn.style.visibility = 'hidden';
                domItems.questClearBtn.style.pointerEvents = 'none';

                this.addInputsDynamically();

                
                const backDefaultView = function () {

                    let newOptions;

                    newOptions = document.querySelectorAll('.admin-option');

                    domItems.newQuestionText.value = "";

                    for (let x = 0; x < newOptions.length; x++) {

                        newOptions[x].value = "";
                        newOptions[x].previousElementSibling.checked = false;
                    }

                    domItems.questUpdateBtn.style.visibility = 'hidden';
                    domItems.questDeleteBtn.style.visibility = 'hidden';
                    domItems.questInsertBtn.style.visibility = 'visible';
                    domItems.questClearBtn.style.pointerEvents = '';

                    createQuestsList(storageQuestionList);
                }

                const updateQuestion = function() {

                    let newOptions, optionEls;
                   
                    foundItem.questionText = domItems.newQuestionText.value;

                    foundItem.correctAnswer = "";

                    newOptions = [];

                    optionEls = document.querySelectorAll('.admin-option');

                    for (let i=0; i < optionEls.length; i++) {

                        if(optionEls[i].value !== "") {

                            newOptions.push(optionEls[i].value);

                            if (optionEls[i].previousElementSibling.checked) {

                                foundItem.correctAnswer = optionEls[i].value;
                            }

                        }

                    }

                    foundItem.options = newOptions;

                    if (foundItem.questionText !== "") {

                        if (foundItem.options.length > 1) {

                            if (foundItem.correctAnswer !== "") {
                                
                                getStorageQuestionList.splice(locationInArr, 1, foundItem);

                                storageQuestionList.setQuestionCollection(getStorageQuestionList);

                                backDefaultView();

                            } else {
                                alert('You missed to check a correct answer or you checked answer without value.');
                            }
    
                        } else {
                            alert('You must enter at least two options.');
                        }

                    } else {
                        alert('You must enter a question.');
                    }

                }
                
                domItems.questUpdateBtn.onclick = updateQuestion;

                const deleteQuestion = function () {

                    getStorageQuestionList.splice(locationInArr, 1);

                    storageQuestionList.setQuestionCollection(getStorageQuestionList);

                    backDefaultView();
                };

                domItems.questDeleteBtn.onclick = deleteQuestion;
            }
        },

        clearQuestionList: function(storageQuestList) {

            if (storageQuestList.getQuestionCollection() !== null) {
                if (storageQuestList.getQuestionCollection().length > 0) {

                    const conf = confirm('Warning! You will lose entire question list.');
    
                    if(conf) {
        
                        storageQuestList.removeQuestionCollection();
        
                        domItems.insertedQuestsWrapper.innerHTML = "";
                    }
                }
            }
            
        },

        displayQuestions: function(storageQuestionList, progress) {

            let newOptionHTML, characterArr;

            characterArr = ['A', 'B', 'C', 'D', 'E', 'F'];

            if(storageQuestionList.getQuestionCollection().length > 0) {

                domItems.askedQuestText.textContent = storageQuestionList.getQuestionCollection()[progress.questionIndex].questionText;
                
                domItems.quizOptionsWrapper.innerHTML = "";

                for (let i=0; i <storageQuestionList.getQuestionCollection()[progress.questionIndex].options.length; i++ ) {

                    newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + characterArr[i] +'</span><p  class="choice-' + i + '">' + storageQuestionList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';
                    
                    domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }
            }
        },

        displayProgress: function (storageQuestionList, progress) {

            domItems.progressBar.max = storageQuestionList.getQuestionCollection().length;

            domItems.progressBar.value = progress.questionIndex + 1;

            domItems.progressPar.textContent = domItems.progressBar.value + '/' + domItems.progressBar.max;
        },

        newDesign: function(answerResult, selectedAns) {

            let twoOptions, index;

            index = 0;

            if (answerResult) {
                index = 1;
            }

            twoOptions = {
                instAnswerText: ['This is a wrong answer', 'This is a correct answer'],
                instWrapperBg: ['red', 'green'],
                optionSpanBg: ['red', 'green']
            };

            domItems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none;";

            domItems.instAnsContainer.style.opacity = '1';

            domItems.instAnsText.textContent = twoOptions.instAnswerText[index];

            domItems.instAnsWrapper.className = twoOptions.instWrapperBg[index];

            selectedAns.previousElementSibling.style.backgroundColor = twoOptions.optionSpanBg[index];

            console.log(selectedAns);
        },

        resetDesign: function() {

            domItems.quizOptionsWrapper.style.cssText = "";

            domItems.instAnsContainer.style.opacity = '0';

        },

        getFullName: function(currPerson, storageQuestionList, admin) {

            if (domItems.firstNameInput.value !== "" && domItems.lastNameInput.value !== "") {

                if(!(domItems.firstNameInput.value === admin[0] &&  domItems.lastNameInput.value === admin[1])) {

                    if (storageQuestionList.getQuestionCollection().length > 0) {

                        currPerson.fullName.push(domItems.firstNameInput.value);
        
                        currPerson.fullName.push(domItems.lastNameInput.value);
            
                        domItems.landPageSection.style.display = 'none';
            
                        domItems.quizPageSection.style.display = 'block';

                    } else {
                        alert('Quiz is not ready. Pls contact the administrator');
                    }
                } else {
    
                    domItems.landPageSection.style.display = 'none';
    
                    domItems.adminPageSection.style.display = 'block ';

                } 
            } else {
                alert('Please, enter your firstname & lastname');
            }
        },

        finalResult: function(currPerson) {

            domItems.finalScoreText.textContent = currPerson.fullName[0] + ' ' + currPerson.fullName[1] + ', Your final score is ' + currPerson.score;
        
            domItems.quizPageSection.style.display = 'none';

            domItems.finalresultsSection.style.display = 'block';
        },

        // ******* display results on admin panel **********
        displayResultsOnAdmin: function(personLocalData) {

            let resultHTML; 

            domItems.resultsListWrapper.innerHTML = "";

            for (let i = 0; i < personLocalData.getPersonData().length; i++) {

                resultHTML = '<p class="person person-' + i +'"><span class="person-' + i +'">' + personLocalData.getPersonData()[i].firstName + ' ' + personLocalData.getPersonData()[i].lastName + ' - ' + personLocalData.getPersonData()[i].score + ' Points</span><button id="delete-result-btn_' + personLocalData.getPersonData()[i].id + '" class="delete-result-btn">Delete</button></p>';
        
                domItems.resultsListWrapper.insertAdjacentHTML('afterbegin', resultHTML);
            }

        },
        //******* delete results from admin panel ********

        deleteResult: function(event, userData) {

            let getId, personArr;

            personArr = userData.getPersonData();

            if (event.target.id.includes('delete-result-btn_')) {

                getId = parseInt(event.target.id.split('_')[1]);
            }

            for (let i =0; i < personArr.length; i++) {

                if(personArr[i].id === getId) {

                    personArr.splice(i, 1);

                    userData.setPersonData(personArr);

                }
            }
        },

        clearResultList: function(userData) {

            if (userData.getPersonData() !== null) {

                if(userData.getPersonData().length > 0) {

                    let conf;
    
                    conf = confirm('Warning: You will lose entire results list');
        
                    if (conf) {
        
                        userData.removePersonData();
        
                        domItems.resultsListWrapper.innerHTML = "";
                    }
                }
            }
        }
    }

})();

/*******************************
***********CONTROLLER***********
*******************************/
var controller = (function(quizCtrl, UICtrl) {

    const selectedDomItems = UICtrl.getDomItems;

    UICtrl.addInputsDynamically();

    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

    selectedDomItems.questInsertBtn.addEventListener('click', function() {

        let adminOptions;

        adminOptions = document.querySelectorAll('.admin-option');
    
        const checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);

        if(checkBoolean) {
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }
    });

    selectedDomItems.insertedQuestsWrapper.addEventListener('click', e => {

        UICtrl.editQuestionList(e, quizCtrl.getQuestionLocalStorage, UICtrl.createQuestionList);
    });

   selectedDomItems.questClearBtn.addEventListener('click', function() {

        UICtrl.clearQuestionList(quizCtrl.getQuestionLocalStorage);

   });

   UICtrl.displayQuestions(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

   UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

   selectedDomItems.quizOptionsWrapper.addEventListener('click', function(e) {

    const updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

    for (let i = 0; i < updatedOptionsDiv.length; i++) {

        if(e.target.className === 'choice-' + i) {
            
            const answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);

            const ansResult = quizCtrl.checkAnswer(answer);

            UICtrl.newDesign(ansResult, answer);

            if(quizCtrl.isFinished()) {
                selectedDomItems.nextQuestionBtn.textContent = 'Finish';
            }
        }

        const nextQuestion = function(questData, progress) {

            if (quizCtrl.isFinished()) {

                // Finish Quiz

                quizCtrl.addPerson();

                UICtrl.finalResult(quizCtrl.getCurrPersonData);

            } else {

                UICtrl.resetDesign();

                quizCtrl.getQuizProgress.questionIndex++;

                UICtrl.displayQuestions(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

            }

        }

        selectedDomItems.nextQuestionBtn.onclick = function() {

            nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
        };
    }

   });
        selectedDomItems.startQuizBtn.addEventListener('click', function() {

            UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName );

        });

        selectedDomItems.lastNameInput.addEventListener('click', function() {
            
            selectedDomItems.lastNameInput.addEventListener('keypress', function(e) {
                    if(e.keyCode === 13) {

                        UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName );

                    }
            });
        });

        UICtrl.displayResultsOnAdmin(quizCtrl.getPersonLocalStorage);

        selectedDomItems.resultsListWrapper.addEventListener('click', function(e) {

            UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);

            UICtrl.displayResultsOnAdmin(quizCtrl.getPersonLocalStorage);

        });

        selectedDomItems.clearResultsBtn.addEventListener('click', function() {

            UICtrl.clearResultList(quizCtrl.getPersonLocalStorage);
        })

})(quizController, UIController);











