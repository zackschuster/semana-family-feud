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

			const confetti = generateConfetti();
			confetti.start();

			return { current, confetti };
		},
		methods: {
			toggleAnswer(index, allowConfetti = true) {
				const answers = document.getElementById(`answers`);
				answers.classList.toggle(`show-answer-${index}`);

				if (answers.classList.contains(`show-answer-${index}`)) {
					new Audio('assets/ding.mp3').play();
				}

				if (allowConfetti && [1,2,3,4,5].slice(0, this.current.answers.length - 1).every(x => answers.classList.contains(`show-answer-${x}`))) {
					const confettiCanvas = document.getElementById('confetti');
					confettiCanvas.hidden = false;
					new Audio('assets/cheer.mp3').play();
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
			reset() {
				const answers = document.getElementById(`answers`);
				for (let i = 0; i < this.current.answers.length; i++) {
					if (answers.classList.contains(`show-answer-${i}`)) {
						this.toggleAnswer(i, false);
					}
				}
				new Audio('assets/crank.mp3').play();
			},
			stop() {
				document.getElementById(`theme`).remove();
				document.getElementById(`game`).remove();
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
var retina = window.devicePixelRatio,

    // Math shorthands
    PI = Math.PI,
    sqrt = Math.sqrt,
    round = Math.round,
    random = Math.random,
    cos = Math.cos,
    sin = Math.sin,

    // Local WindowAnimationTiming interface
    rAF = window.requestAnimationFrame,
    cAF = window.cancelAnimationFrame || window.cancelRequestAnimationFrame,
    _now = Date.now || function () {return new Date().getTime();};

// Local WindowAnimationTiming interface polyfill
(function (w) {
  /**
				* Fallback implementation.
				*/
  var prev = _now();
  function fallback(fn) {
    var curr = _now();
    var ms = Math.max(0, 16 - (curr - prev));
    var req = setTimeout(fn, ms);
    prev = curr;
    return req;
  }

  /**
				* Cancel.
				*/
  var cancel = w.cancelAnimationFrame
  || w.webkitCancelAnimationFrame
  || w.clearTimeout;

  rAF = w.requestAnimationFrame
  || w.webkitRequestAnimationFrame
  || fallback;

  cAF = function(id){
    cancel.call(w, id);
  };
}(window));

function generateConfetti() {
  var speed = 50,
      duration = (1.0 / speed),
      confettiRibbonCount = 11,
      ribbonPaperCount = 30,
      ribbonPaperDist = 8.0,
      ribbonPaperThick = 8.0,
      confettiPaperCount = 95,
      DEG_TO_RAD = PI / 180,
      RAD_TO_DEG = 180 / PI,
      colors = [
        ["#df0049", "#660671"],
        ["#00e857", "#005291"],
        ["#2bebbc", "#05798a"],
        ["#ffd200", "#b06c00"]
      ];

  function Vector2(_x, _y) {
    this.x = _x, this.y = _y;
    this.Length = function() {
      return sqrt(this.SqrLength());
    }
    this.SqrLength = function() {
      return this.x * this.x + this.y * this.y;
    }
    this.Add = function(_vec) {
      this.x += _vec.x;
      this.y += _vec.y;
    }
    this.Sub = function(_vec) {
      this.x -= _vec.x;
      this.y -= _vec.y;
    }
    this.Div = function(_f) {
      this.x /= _f;
      this.y /= _f;
    }
    this.Mul = function(_f) {
      this.x *= _f;
      this.y *= _f;
    }
    this.Normalize = function() {
      var sqrLen = this.SqrLength();
      if (sqrLen != 0) {
        var factor = 1.0 / sqrt(sqrLen);
        this.x *= factor;
        this.y *= factor;
      }
    }
    this.Normalized = function() {
      var sqrLen = this.SqrLength();
      if (sqrLen != 0) {
        var factor = 1.0 / sqrt(sqrLen);
        return new Vector2(this.x * factor, this.y * factor);
      }
      return new Vector2(0, 0);
    }
  }
  Vector2.Lerp = function(_vec0, _vec1, _t) {
    return new Vector2((_vec1.x - _vec0.x) * _t + _vec0.x, (_vec1.y - _vec0.y) * _t + _vec0.y);
  }
  Vector2.Distance = function(_vec0, _vec1) {
    return sqrt(Vector2.SqrDistance(_vec0, _vec1));
  }
  Vector2.SqrDistance = function(_vec0, _vec1) {
    var x = _vec0.x - _vec1.x;
    var y = _vec0.y - _vec1.y;
    return (x * x + y * y + z * z);
  }
  Vector2.Scale = function(_vec0, _vec1) {
    return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
  }
  Vector2.Min = function(_vec0, _vec1) {
    return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
  }
  Vector2.Max = function(_vec0, _vec1) {
    return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
  }
  Vector2.ClampMagnitude = function(_vec0, _len) {
    var vecNorm = _vec0.Normalized;
    return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
  }
  Vector2.Sub = function(_vec0, _vec1) {
    return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
  }

  function EulerMass(_x, _y, _mass, _drag) {
    this.position = new Vector2(_x, _y);
    this.mass = _mass;
    this.drag = _drag;
    this.force = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
    this.AddForce = function(_f) {
      this.force.Add(_f);
    }
    this.Integrate = function(_dt) {
      var acc = this.CurrentForce(this.position);
      acc.Div(this.mass);
      var posDelta = new Vector2(this.velocity.x, this.velocity.y);
      posDelta.Mul(_dt);
      this.position.Add(posDelta);
      acc.Mul(_dt);
      this.velocity.Add(acc);
      this.force = new Vector2(0, 0);
    }
    this.CurrentForce = function(_pos, _vel) {
      var totalForce = new Vector2(this.force.x, this.force.y);
      var speed = this.velocity.Length();
      var dragVel = new Vector2(this.velocity.x, this.velocity.y);
      dragVel.Mul(this.drag * this.mass * speed);
      totalForce.Sub(dragVel);
      return totalForce;
    }
  }

  function ConfettiPaper(_x, _y) {
    this.pos = new Vector2(_x, _y);
    this.rotationSpeed = (random() * 600 + 800);
    this.angle = DEG_TO_RAD * random() * 360;
    this.rotation = DEG_TO_RAD * random() * 360;
    this.cosA = 1.0;
    this.size = 5.0;
    this.oscillationSpeed = (random() * 1.5 + 0.5);
    this.xSpeed = 40.0;
    this.ySpeed = (random() * 60 + 50.0);
    this.corners = new Array();
    this.time = random();
    var ci = round(random() * (colors.length - 1));
    this.frontColor = colors[ci][0];
    this.backColor = colors[ci][1];
    for (var i = 0; i < 4; i++) {
      var dx = cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
      var dy = sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
      this.corners[i] = new Vector2(dx, dy);
    }
    this.Update = function(_dt) {
      this.time += _dt;
      this.rotation += this.rotationSpeed * _dt;
      this.cosA = cos(DEG_TO_RAD * this.rotation);
      this.pos.x += cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt
      this.pos.y += this.ySpeed * _dt;
      if (this.pos.y > ConfettiPaper.bounds.y) {
        this.pos.x = random() * ConfettiPaper.bounds.x;
        this.pos.y = 0;
      }
    }
    this.Draw = function(_g) {
      if (this.cosA > 0) {
        _g.fillStyle = this.frontColor;
      } else {
        _g.fillStyle = this.backColor;
      }
      _g.beginPath();
      _g.moveTo((this.pos.x + this.corners[0].x * this.size) * retina, (this.pos.y + this.corners[0].y * this.size * this.cosA) * retina);
      for (var i = 1; i < 4; i++) {
        _g.lineTo((this.pos.x + this.corners[i].x * this.size) * retina, (this.pos.y + this.corners[i].y * this.size * this.cosA) * retina);
      }
      _g.closePath();
      _g.fill();
    }
  }
  ConfettiPaper.bounds = new Vector2(0, 0);

  function ConfettiRibbon(_x, _y, _count, _dist, _thickness, _angle, _mass, _drag) {
    this.particleDist = _dist;
    this.particleCount = _count;
    this.particleMass = _mass;
    this.particleDrag = _drag;
    this.particles = new Array();
    var ci = round(random() * (colors.length - 1));
    this.frontColor = colors[ci][0];
    this.backColor = colors[ci][1];
    this.xOff = (cos(DEG_TO_RAD * _angle) * _thickness);
    this.yOff = (sin(DEG_TO_RAD * _angle) * _thickness);
    this.position = new Vector2(_x, _y);
    this.prevPosition = new Vector2(_x, _y);
    this.velocityInherit = (random() * 2 + 4);
    this.time = random() * 100;
    this.oscillationSpeed = (random() * 2 + 2);
    this.oscillationDistance = (random() * 40 + 40);
    this.ySpeed = (random() * 40 + 80);
    for (var i = 0; i < this.particleCount; i++) {
      this.particles[i] = new EulerMass(_x, _y - i * this.particleDist, this.particleMass, this.particleDrag);
    }
    this.Update = function(_dt) {
      var i = 0;
      this.time += _dt * this.oscillationSpeed;
      this.position.y += this.ySpeed * _dt;
      this.position.x += cos(this.time) * this.oscillationDistance * _dt;
      this.particles[0].position = this.position;
      var dX = this.prevPosition.x - this.position.x;
      var dY = this.prevPosition.y - this.position.y;
      var delta = sqrt(dX * dX + dY * dY);
      this.prevPosition = new Vector2(this.position.x, this.position.y);
      for (i = 1; i < this.particleCount; i++) {
        var dirP = Vector2.Sub(this.particles[i - 1].position, this.particles[i].position);
        dirP.Normalize();
        dirP.Mul((delta / _dt) * this.velocityInherit);
        this.particles[i].AddForce(dirP);
      }
      for (i = 1; i < this.particleCount; i++) {
        this.particles[i].Integrate(_dt);
      }
      for (i = 1; i < this.particleCount; i++) {
        var rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y);
        rp2.Sub(this.particles[i - 1].position);
        rp2.Normalize();
        rp2.Mul(this.particleDist);
        rp2.Add(this.particles[i - 1].position);
        this.particles[i].position = rp2;
      }
      if (this.position.y > ConfettiRibbon.bounds.y + this.particleDist * this.particleCount) {
        this.Reset();
      }
    }
    this.Reset = function() {
      this.position.y = -random() * ConfettiRibbon.bounds.y;
      this.position.x = random() * ConfettiRibbon.bounds.x;
      this.prevPosition = new Vector2(this.position.x, this.position.y);
      this.velocityInherit = random() * 2 + 4;
      this.time = random() * 100;
      this.oscillationSpeed = random() * 2.0 + 1.5;
      this.oscillationDistance = (random() * 40 + 40);
      this.ySpeed = random() * 40 + 80;
      var ci = round(random() * (colors.length - 1));
      this.frontColor = colors[ci][0];
      this.backColor = colors[ci][1];
      this.particles = new Array();
      for (var i = 0; i < this.particleCount; i++) {
        this.particles[i] = new EulerMass(this.position.x, this.position.y - i * this.particleDist, this.particleMass, this.particleDrag);
      }
    }
    this.Draw = function(_g) {
      for (var i = 0; i < this.particleCount - 1; i++) {
        var p0 = new Vector2(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
        var p1 = new Vector2(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);
        if (this.Side(this.particles[i].position.x, this.particles[i].position.y, this.particles[i + 1].position.x, this.particles[i + 1].position.y, p1.x, p1.y) < 0) {
          _g.fillStyle = this.frontColor;
          _g.strokeStyle = this.frontColor;
        } else {
          _g.fillStyle = this.backColor;
          _g.strokeStyle = this.backColor;
        }
        if (i == 0) {
          _g.beginPath();
          _g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
          _g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
          _g.lineTo(((this.particles[i + 1].position.x + p1.x) * 0.5) * retina, ((this.particles[i + 1].position.y + p1.y) * 0.5) * retina);
          _g.closePath();
          _g.stroke();
          _g.fill();
          _g.beginPath();
          _g.moveTo(p1.x * retina, p1.y * retina);
          _g.lineTo(p0.x * retina, p0.y * retina);
          _g.lineTo(((this.particles[i + 1].position.x + p1.x) * 0.5) * retina, ((this.particles[i + 1].position.y + p1.y) * 0.5) * retina);
          _g.closePath();
          _g.stroke();
          _g.fill();
        } else if (i == this.particleCount - 2) {
          _g.beginPath();
          _g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
          _g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
          _g.lineTo(((this.particles[i].position.x + p0.x) * 0.5) * retina, ((this.particles[i].position.y + p0.y) * 0.5) * retina);
          _g.closePath();
          _g.stroke();
          _g.fill();
          _g.beginPath();
          _g.moveTo(p1.x * retina, p1.y * retina);
          _g.lineTo(p0.x * retina, p0.y * retina);
          _g.lineTo(((this.particles[i].position.x + p0.x) * 0.5) * retina, ((this.particles[i].position.y + p0.y) * 0.5) * retina);
          _g.closePath();
          _g.stroke();
          _g.fill();
        } else {
          _g.beginPath();
          _g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
          _g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
          _g.lineTo(p1.x * retina, p1.y * retina);
          _g.lineTo(p0.x * retina, p0.y * retina);
          _g.closePath();
          _g.stroke();
          _g.fill();
        }
      }
    }
    this.Side = function(x1, y1, x2, y2, x3, y3) {
      return ((x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2));
    }
  }
  ConfettiRibbon.bounds = new Vector2(0, 0);
  confetti = {};
  confetti.Context = function(id) {
    var i = 0;
    var canvas = document.getElementById(id);
    var canvasParent = canvas.parentNode;
    var canvasWidth = canvasParent.offsetWidth;
    var canvasHeight = canvasParent.offsetHeight;
    canvas.width = canvasWidth * retina;
    canvas.height = canvasHeight * retina;
    var context = canvas.getContext('2d');
    var interval = null;
    var confettiRibbons = new Array();
    ConfettiRibbon.bounds = new Vector2(canvasWidth, canvasHeight);
    for (i = 0; i < confettiRibbonCount; i++) {
      confettiRibbons[i] = new ConfettiRibbon(random() * canvasWidth, -random() * canvasHeight * 2, ribbonPaperCount, ribbonPaperDist, ribbonPaperThick, 45, 1, 0.05);
    }
    var confettiPapers = new Array();
    ConfettiPaper.bounds = new Vector2(canvasWidth, canvasHeight);
    for (i = 0; i < confettiPaperCount; i++) {
      confettiPapers[i] = new ConfettiPaper(random() * canvasWidth, random() * canvasHeight);
    }
    this.resize = function() {
      canvasWidth = canvasParent.offsetWidth;
      canvasHeight = canvasParent.offsetHeight;
      canvas.width = canvasWidth * retina;
      canvas.height = canvasHeight * retina;
      ConfettiPaper.bounds = new Vector2(canvasWidth, canvasHeight);
      ConfettiRibbon.bounds = new Vector2(canvasWidth, canvasHeight);
    }
    this.start = function() {
      this.stop()
      var context = this;
      this.update();
    }
    this.stop = function() {
      cAF(this.interval);
    }
    this.update = function() {
      var i = 0;
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (i = 0; i < confettiPaperCount; i++) {
        confettiPapers[i].Update(duration);
        confettiPapers[i].Draw(context);
      }
      for (i = 0; i < confettiRibbonCount; i++) {
        confettiRibbons[i].Update(duration);
        confettiRibbons[i].Draw(context);
      }
      this.interval = rAF(function() {
        confetti.update();
      });
    }
  }
  var confetti = new confetti.Context('confetti');
  window.addEventListener('resize', function(event){
    confetti.resize();
	});
	return confetti;
};
