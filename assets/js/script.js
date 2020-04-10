var initialTime = 75;
var time = 75;
var score = 0;
var quizCount = 0;
var setTime;
var answers = document.querySelectorAll('#quizHolder button');

var recordsArray = [];

// found where I can use ? in lieu of an if statement: https://medium.com/javascript-in-plain-english/what-does-the-question-mark-mean-in-javascript-code-353cfadcf760
(localStorage.getItem('recordsArray')) ? recordsArray = JSON.parse(localStorage.getItem('recordsArray')): recordsArray = [];


var queryElement = (element) => {
	return document.querySelector(element);
}

var onlyDisplaySection = (element) => {
	let sections = document.querySelectorAll("section");
	Array.from(sections).forEach((userItem) => {
		userItem.classList.add('hide');
	});
	queryElement(element).classList.remove('hide');
}

var recordsHtmlReset = () => {
	queryElement('#highScores div').innerHTML = "";
	var i = 1;
	recordsArray.sort((a, b) => b.score - a.score);
	Array.from(recordsArray).forEach(check =>
	{
		var scores = document.createElement("div");
		scores.innerHTML = i + ". " + check.initialRecord + " - " + check.score;
		queryElement('#highScores div').appendChild(scores);
		i = i + 1
	});
	i = 0;
	Array.from(answers).forEach(answer => {
		answer.classList.remove('disable');
	});
}

var setQuestionData = () => {
	queryElement('#quizHolder p').innerHTML = questions[quizCount].title;
	queryElement('#quizHolder button:nth-of-type(1)').innerHTML = `1. ${questions[quizCount].choices[0]}`;
	queryElement('#quizHolder button:nth-of-type(2)').innerHTML = `2. ${questions[quizCount].choices[1]}`;
	queryElement('#quizHolder button:nth-of-type(3)').innerHTML = `3. ${questions[quizCount].choices[2]}`;
	queryElement('#quizHolder button:nth-of-type(4)').innerHTML = `4. ${questions[quizCount].choices[3]}`;
}

var quizUpdate = (answerCopy) => {
	queryElement('#scoreAlert p').innerHTML = answerCopy;
	queryElement('#scoreAlert').classList.remove('invisible', scoreAlert());
	Array.from(answers).forEach(answer =>
	{
		answer.classList.add('disable');
	});

	setTimeout(() => {
		if (quizCount === questions.length) {
			onlyDisplaySection("#finish");
			time = 0;
			queryElement('#time').innerHTML = time;
		} else {
			setQuestionData();
			Array.from(answers).forEach(answer => {
				answer.classList.remove('disable');
			});
		}
	}, 1000);
}

var myTimer = () => {
	if (time > 0) {
		time = time - 1;
		queryElement('#time').innerHTML = time;
	} else {
		clearInterval(clock);
		queryElement('#score').innerHTML = score;
		onlyDisplaySection("#finish");
	}
}

	
var clock;
queryElement("#intro button").addEventListener("click", (e) => {
    setQuestionData();
	onlyDisplaySection("#quizHolder");
	clock = setInterval(myTimer, 1000);
});

var scoreAlert = () => {
	clearTimeout(setTime);
	setTime = setTimeout(() => {
		queryElement('#scoreAlert').classList.add('invisible');
	}, 1000);
}


Array.from(answers).forEach(check => {
	check.addEventListener('click', function (event) {
		if (this.innerHTML.substring(3, this.length) === questions[quizCount].answer) {
			score = score + 1;
			quizCount = quizCount + 1;
			quizUpdate("Correct");
		}else{
			time = time - 5;
			quizCount = quizCount + 1;
			quizUpdate("Wrong");
		}
	});
});

// submit high scores
var errorAlert = () => {
	clearTimeout(setTime);
	setTime = setTimeout(() => {
		queryElement('#errorAlert').classList.add('invisible');
	}, 3000);
}

queryElement("#records button").addEventListener("click", () => {
	let initialsRecord = queryElement('#initials').value;
	if (initialsRecord === ''){
		queryElement('#errorAlert p').innerHTML = "You need at least 1 character";
		queryElement('#errorAlert').classList.remove('invisible', errorAlert());
	} else if (initialsRecord.match(/[[A-Za-z]/) === null) {
		queryElement('#errorAlert p').innerHTML = "Only letters for initials allowed.";
		queryElement('#errorAlert').classList.remove('invisible', errorAlert());
	} else if (initialsRecord.length > 5) {
		queryElement('#errorAlert p').innerHTML = "Maximum of 5 characters allowed.";
		queryElement('#errorAlert').classList.remove('invisible', errorAlert());
	} else {
		recordsArray.push({
			"initialRecord": initialsRecord,
			"score": score
		});
		
		localStorage.setItem('recordsArray', JSON.stringify(recordsArray));
		queryElement('#highScores div').innerHTML = '';
		onlyDisplaySection("#highScores");
		recordsHtmlReset();
		queryElement("#initials").value = '';
		}
});



queryElement("#clearScores").addEventListener("click", () => {
	recordsArray = [];
	queryElement('#highScores div').innerHTML = "";
	localStorage.removeItem('recordsArray');
});

// quiz reset
queryElement("#reset").addEventListener("click", () => {
	time = initialTime;
	score = 0;
	quizCount = 0;
	onlyDisplaySection("#intro");
});

// pause quiz for high score view
queryElement("#scores").addEventListener("click", (e) => {
	e.preventDefault();
	clearInterval(clock);
	queryElement('#time').innerHTML = 0;
	time = initialTime;
	score = 0;
	quizCount = 0;
	onlyDisplaySection("#highScores");
	recordsHtmlReset();
});

