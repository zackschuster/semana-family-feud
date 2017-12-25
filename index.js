const seconds = s => s * 1000;

function showDivById(id, animateClass = 'jackInTheBox', swingDelay = 1) {
	const div = document.getElementById(id);
	div.hidden = false;
	div.classList.add('animated', animateClass);

	setTimeout(() => {
		div.classList.add('infinite-swing');
	}, seconds(swingDelay));
}

new Vue({
	el: '#landing',
	created() {
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
			return { current };
		},
		methods: {
			toggleAnswer(index) {
				document.getElementById(`answers`).classList.toggle(`show-answer-${index}`);
				setTimeout(_ => {
					const answerBox = document.getElementById(`answer-box-${index}`)

					const answer = answerBox.querySelector('.answer');
					answer.hidden = !answer.hidden;
					answer.classList.toggle('no-height');

					answerBox
						.querySelector('.preview')
						.classList.toggle('no-height');
				}, 100);
			},
			reset() {
				const answers = document.getElementById(`answers`);
				for (let i = 0; i < this.current.answers.length; i++) {
					if (answers.classList.contains(`show-answer-${i}`)) {
						this.toggleAnswer(i);
					}
				}
			},
			stop() {
				document.getElementById(`game`).remove();
				this.$destroy();
			},
			nextQuestion() {
				this.reset();

				setTimeout(() => {
					let slice = calcSlice();
					console.log(`\npicked question #${slice + 1}`);

					while (slice >= questions.length) {
						console.log(`whoops, that's too big`);
						slice = calcSlice();
						console.log(`*clears throat* picked question #${slice + 1}`);
					}

					while (slice === this.current.slice) {
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
				"Alaska/Canada",
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
				"Political/Politician/Politics",
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
				"Chika/Stories/Kwentuhan",
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
