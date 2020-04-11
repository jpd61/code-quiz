var initialTime = 75;
var time = 75;
var score = 0;
var quizCount = 0;
var setTime;
var answers = document.querySelectorAll('#quizHolder button');
var clock;
var recordsArray = [];

var pageContentEl = function(element) {
	return document.querySelector(element);
};

var myTimer = function() {
	if (time > 0) {
		time = time - 1;
		pageContentEl('#time').innerHTML = time;
	} else {
		clearInterval(clock);
		pageContentEl('#score').innerHTML = score;
		onlyDisplaySection("#finish");
	}
};

var onlyDisplaySection = function(element) {
	let sections = document.querySelectorAll("section");
	Array.from(sections).forEach(function(userItem) {
		userItem.classList.add('hide');
	});
	pageContentEl(element).classList.remove('hide');
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
// https://www.w3schools.com/js/js_arrow_function.asp
var recordsHtmlReset = function() {
	pageContentEl('#highScores div').innerHTML = "";
	let i = 1;
	recordsArray.sort((a, b) => b.score - a.score);
	Array.from(recordsArray).forEach(check =>
	{
		var scores = document.createElement("div");
		scores.innerHTML = i + ". " + check.initialRecord + " - " + check.score;
		pageContentEl('#highScores div').appendChild(scores);
		i = i + 1;
	});
	i = 0;
	Array.from(answers).forEach(answer => {
		answer.classList.remove('disable');
	});
};

//nth-of-type is working better than assigning an individual button id: https://www.w3schools.com/cssref/sel_nth-of-type.asp
var setQuestionData = function() {
	pageContentEl('#quizHolder p').innerHTML = questions[quizCount].title;
	pageContentEl('#quizHolder button:nth-of-type(1)').innerHTML = `1. ${questions[quizCount].choices[0]}`;
	pageContentEl('#quizHolder button:nth-of-type(2)').innerHTML = `2. ${questions[quizCount].choices[1]}`;
	pageContentEl('#quizHolder button:nth-of-type(3)').innerHTML = `3. ${questions[quizCount].choices[2]}`;
	pageContentEl('#quizHolder button:nth-of-type(4)').innerHTML = `4. ${questions[quizCount].choices[3]}`;
};

var quizUpdate = function(answerCopy) {
	pageContentEl('#scoreAlert p').innerHTML = answerCopy;
	pageContentEl('#scoreAlert').classList.remove('invisible', scoreAlert());
	Array.from(answers).forEach(answer =>
	{
		answer.classList.add('disable');
	});

	setTimeout(function() {
		if (quizCount === questions.length) {
			onlyDisplaySection("#finish");
			time = 0;
			pageContentEl('#time').innerHTML = time;
		} else {
			setQuestionData();
			Array.from(answers).forEach(answer => {
				answer.classList.remove('disable');
			});
		}
	}, 1000);
};

var scoreAlert = function() {
	clearTimeout(setTime);
	setTime = setTimeout(function() {
		pageContentEl('#scoreAlert').classList.add('invisible');
	}, 1000);
};

// submit high scores
var errorAlert = function() {
	clearTimeout(setTime);
	setTime = setTimeout(function() {
		pageContentEl('#errorAlert').classList.add('invisible');
	}, 3000);
};

var enterInitials = function() {
	let initialsRecord = pageContentEl('#initials').value;
	if (initialsRecord === ''){
		pageContentEl('#errorAlert p').innerHTML = "You need at least 1 character";
		pageContentEl('#errorAlert').classList.remove('invisible', errorAlert());
	} else if (initialsRecord.match(/[[A-Za-z]/) === null) {
		pageContentEl('#errorAlert p').innerHTML = "Only letters for initials allowed.";
		pageContentEl('#errorAlert').classList.remove('invisible', errorAlert());
	} else if (initialsRecord.length > 5) {
		pageContentEl('#errorAlert p').innerHTML = "Maximum of 5 characters allowed.";
		pageContentEl('#errorAlert').classList.remove('invisible', errorAlert());
	} else {
		recordsArray.push({
			"initialRecord": initialsRecord,
			"score": score
		});
		
		localStorage.setItem('recordsArray', JSON.stringify(recordsArray));
		pageContentEl('#highScores div').innerHTML = '';
		onlyDisplaySection("#highScores");
		recordsHtmlReset();
		pageContentEl("#initials").value = '';
		}
};

// found where I can use ? in lieu of an if statement: https://medium.com/javascript-in-plain-english/what-does-the-question-mark-mean-in-javascript-code-353cfadcf760
(localStorage.getItem('recordsArray')) ? recordsArray = JSON.parse(localStorage.getItem('recordsArray')): recordsArray = [];

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
Array.from(answers).forEach(check => {
	check.addEventListener('click', function (event) {
		if (this.innerHTML.substring(3, this.length) === questions[quizCount].answer) {
			score = score + 1;
			quizCount = quizCount + 1;
			quizUpdate("Correct");
		}else{
			time = time - 5;
			quizCount = quizCount + 1;
			quizUpdate("Incorrect");
		}
	});
});

pageContentEl("#intro button").addEventListener("click", function(e) {
    setQuestionData();
	onlyDisplaySection("#quizHolder");
	clock = setInterval(myTimer, 1000);
});

pageContentEl("#records button").addEventListener("click", enterInitials);

pageContentEl("#clearScores").addEventListener("click", function() {
	recordsArray = [];
	pageContentEl('#highScores div').innerHTML = "";
	localStorage.removeItem('recordsArray');
});

// quiz reset
pageContentEl("#reset").addEventListener("click", function() {
	time = initialTime;
	score = 0;
	quizCount = 0;
	onlyDisplaySection("#intro");
});

// pause quiz for high score view
pageContentEl("#scores").addEventListener("click", function(e) {
	e.preventDefault();
	clearInterval(clock);
	pageContentEl('#time').innerHTML = 0;
	time = initialTime;
	score = 0;
	quizCount = 0;
	onlyDisplaySection("#highScores");
	recordsHtmlReset();
});

