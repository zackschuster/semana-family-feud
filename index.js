let confetti;
setTimeout(() => {
	confetti = generateConfetti();
	confetti.start();
});
const seconds = s => s * 1000;
const soundEffect = name => new Audio(`assets/${name}.mp3`).play();

function showDivById(id, animateClass = 'jackInTheBox', swingDelay = 1) {
	const div = document.getElementById(id);
	div.hidden = false;
	div.classList.add('animated', animateClass);

	setTimeout(() =>
		div.classList.add('infinite-swing'), seconds(swingDelay));
}

new Vue({
	el: '#landing',
	created() {
		soundEffect('cheer');
		this.showHeaderText();
	},
	methods: {
		showHeaderText() {
			setTimeout(_ => showDivById('first'));
			setTimeout(_ => showDivById('second'), seconds(1));
			setTimeout(_ => showDivById('third'), seconds(2));
		},
		showRoot() {
			document.getElementById('landing').remove();
			initRoot();
			this.$destroy();
		}
	}
});

function registerGameComponent() {
	const questions = getQuestions();
	const calcSlice = _ => Math.floor(questions.length * Math.round(Math.random() * 100) / 100);

	Vue.component('game', {
		template: '#game-template',
		data() {
			const current = questions[0];
			current.number = 1;
			return { current, showWrongNotification: false };
		},
		mounted() {
			window.addEventListener('keydown', e => {
				switch (e.code) {
					case 'Numpad1':
					case 'Digit1':
						return this.toggleAnswer(0);
					case 'Numpad2':
					case 'Digit2':
						return this.toggleAnswer(1);
					case 'Numpad3':
					case 'Digit3':
						return this.toggleAnswer(2);
					case 'Numpad4':
					case 'Digit4':
						return this.toggleAnswer(3);
					case 'Numpad5':
					case 'Digit5':
						return this.toggleAnswer(4);
					case 'Enter':
						return this.nextQuestion();
					case 'KeyX':
						return this.buzz();
				}
			});
		},
		methods: {
			toggleAnswer(index, allowConfetti = true) {
				if (index >= this.current.answers.length) return;

				const answers = document.getElementById(`answers`);
				answers.classList.toggle(`show-answer-${index}`);

				if (answers.classList.contains(`show-answer-${index}`)) {
					soundEffect('ding');
				} else {
					soundEffect('crank');
				}

				if (allowConfetti && [0, 1, 2, 3, 4].slice(0, this.current.answers.length).every(x => answers.classList.contains(`show-answer-${x}`))) {
					const confettiCanvas = document.getElementById('confetti');
					confettiCanvas.hidden = false;
					soundEffect('cheer');
					setTimeout(() => {
						confettiCanvas.hidden = true;
						this.nextQuestion();
					}, seconds(5));
				}

				setTimeout(_ => {
					const answerBox = document.getElementById(`answer-box-${index}`)

					const answer = answerBox.querySelector('.answer');
					answer.hidden = !answer.hidden;
					answer.classList.toggle('no-height');

					const preview = answerBox.querySelector('.preview')
					preview.hidden = !preview.hidden;
					preview.classList.toggle('no-height');
				}, 100);
			},
			buzz() {
				this.showWrongNotification = true;
				soundEffect('buzz');
				setTimeout(() => {
					this.showWrongNotification = false;
				}, seconds(1));
			},
			reset() {
				const answers = document.getElementById(`answers`);
				for (let i = 0; i < this.current.answers.length; i++) {
					if (answers.classList.contains(`show-answer-${i}`)) {
						this.toggleAnswer(i, false);
					}
				}
				soundEffect('crank');
			},
			stop() {
				document.getElementById('theme').remove();
				document.getElementById('game').remove();
				this.$destroy();
			},
			nextQuestion() {
				if (document.getElementById('confetti').hidden === false) return;

				this.reset();

				setTimeout(() => {
					let slice = calcSlice();
					console.log(`\npicked question #${slice + 1}`);

					while (slice >= questions.length) {
						console.log(`whoops, that's too big`);
						slice = calcSlice();
						console.log(`*clears throat* picked question #${slice + 1}`);
					}

					while (slice === (this.current.number - 1)) {
						console.log(`oops, picked the last question`);
						slice = calcSlice();
						console.log(`*clears throat* picked question #${slice + 1}`);
					}

					this.current = questions[slice];
					this.current.number = slice + 1;
				}, 100);
			}
		}
	});
}

function initRoot() {
	registerGameComponent();

	const root = document.getElementById('root');
	root.hidden = false;

	new Vue({
		el: '#root',
		created() {
			Promise.resolve().then(() => {
				showDivById('game', 'fadeInDown');

				const html = document.getElementsByTagName('html')[0];
				html.style.overflowY = 'hidden';

				const header = document.getElementById('header');
				header.classList.add('hinge');
				header.style.height = '0px';
				header.style.position = 'absolute';

				setTimeout(() => {
					header.remove();
					html.style.overflowY = null;
				}, seconds(2));
			});
		},
	});
}

function getQuestions() {
	return [
		{
			"question": "​Toy/Game that cousins should bring during family time",
			"answers": [
				"Cards",
				"Family Feud",
				"Xbox",
				"Jackbox Party",
				"Monopoly"
			]
		},
		{
			"question": "Who eats the most ice cream?",
			"answers": [
				"Madi",
				"Dylan",
				"Moe",
				"Dennis",
				"Raymund"
			]
		},
		{
			"question": "Besides noodles, name something that can be found in a bowl of lomi",
			"answers": [
				"Meat",
				"Fishballs",
				"Eggs",
				"Liver"
			]
		},
		{
			"question": "Family’s favorite restaurant",
			"answers": [
				"China Palace",
				"OZ Korean BBQ",
				"That one vietnamese place",
				"Burnie’s",
				"McDonalds"
			]
		},
		{
			"question": "Tagalog word that everyone knows",
			"answers": [
				"Hoy",
				"Kain",
				"Oo",
				"Taba",
				"Lolo/lola"
			]
		},
		{
			"question": "Best family vacation",
			"answers": [
				"Europe",
				"Alaska / Canada",
				"Philippines",
				"Pepper Mill"
			]
		},
		{
			"question": "Fastest driver",
			"answers": [
				"Ed",
				"Jared",
				"Mark",
				"Darlene",
				"Norman"
			]
		},
		{
			"question": "Always early",
			"answers": [
				"Guido",
				"Teddy",
				"Dennis",
				"Matthew"
			]
		},
		{
			"question": "One word that describes Jared",
			"answers": [
				"Political / Politician / Politics",
				"Funny/Wacky/Silly",
				"Smart",
				"Talkative",
				"Passionate"
			]
		},
		{
			"question": "Cutest dog",
			"answers": [
				"Daisy",
				"Coco & Bone",
				"Leia",
				"Sophie",
				"Chloe"
			]
		},
		{
			"question": "Favorite thing during family time",
			"answers": [
				"Food",
				"Jokes",
				"Cousins",
				"Chika / Stories / Kwentuhan",
				"Family"
			]
		},
		{
			"question": "Always gets lost when driving",
			"answers": [
				"Ed",
				"Darlene",
				"Dennis",
				"Nikki",
				"Guido"
			]
		},
		{
			"question": "Tita who always buys luxurious things",
			"answers": [
				"Aggie",
				"Erma",
				"Grace",
				"Marcy",
				"Lalaine"
			]
		},
		{
			"question": "Animal lover",
			"answers": [
				"Mak",
				"Madi",
				"Erma",
				"Moe",
				"Lalaine"
			]
		},
		{
			"question": "Cousin who is always on their phone",
			"answers": [
				"Darlene",
				"Nikki",
				"Dylan",
				"Charmaine"
			]
		},
		{
			"question": "Sleepy cousin",
			"answers": [
				"Darlene",
				"Gio",
				"Moe",
				"Matthew",
				"Jared"
			]
		},
		{
			"question": "Always hungry cousin",
			"answers": [
				"Matthew",
				"Mark",
				"Madi",
				"Jared",
				"Michael"
			]
		},
		{
			"question": "Quiet Tita",
			"answers": [
				"Marcy",
				"Lalaine",
				"Minda",
				"Maridel",
				"Lorna"
			]
		},
		{
			"question": "Smartest cousin",
			"answers": [
				"Cecile",
				"Jared",
				"Darlene",
				"Justin",
				"Mak"
			]
		},
		{
			"question": "Always drunk",
			"answers": [
				"Mark",
				"Teddy",
				"Jec",
				"Dennis"
			]
		},
		{
			"question": "Richest uncle",
			"answers": [
				"Jec",
				"Noel",
				"Norman",
				"Guido"
			]
		},
		{
			"question": "Best cook",
			"answers": [
				"Dennis",
				"Erma",
				"Minang",
				"Marcy",
				"Guido"
			]
		},
		{
			"question": "Sportiest Tito",
			"answers": [
				"Dennis",
				"Noel",
				"Jec",
				"Teddy",
			]
		}
	];
}
