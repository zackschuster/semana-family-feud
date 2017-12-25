const { readFileSync, writeFileSync } = require('fs');
const { EOL } = require('os');

const answers = readFileSync('answers.txt')
	.toString()
	.split(`${EOL}${EOL}`)
	.map(answer => {
		answer = answer.split(EOL);
		return {
			question: answer[0],
			answers: answer.slice(1),
		};
	});

writeFileSync('answers.json', JSON.stringify(answers, (k, v) => v, '\t'));
