const retina = window.devicePixelRatio;

const speed = 50;
const duration = (1.0 / speed);
const confettiRibbonCount = 11;
const confettiPaperCount = 95;
const DEG_TO_RAD = Math.PI / 180;

const colors = [
	["#df0049", "#660671"],
	["#00e857", "#005291"],
	["#2bebbc", "#05798a"],
	["#ffd200", "#b06c00"]
];

class Vector {
	constructor(_x, _y) {
		this.x = _x,
		this.y = _y;
	}
	length() {
		return Math.sqrt(this.squareLength());
	}
	squareLength() {
		return this.x * this.x + this.y * this.y;
	}
	add({ x, y }) {
		this.x += x;
		this.y += y;
	}
	subtract({ x, y }) {
		this.x -= x;
		this.y -= y;
	}
	divide(denominator) {
		this.x /= denominator;
		this.y /= denominator;
	}
	multiply(factor) {
		this.x *= factor;
		this.y *= factor;
	}
	normalize() {
		const sqrLen = this.squareLength();
		if (sqrLen != 0) {
			this.multiply(1.0 / Math.sqrt(sqrLen));
		}
	}
	static Sub({ x1, y1, z1 }, { x2, y2, z2 }) {
		return new Vector(x1 - x2, y1 - y2, z1 - z2);
	}
}

class EulerMass {
	constructor(x, y, mass, drag) {
		this.mass = mass;
		this.drag = drag;

		this.position = new Vector(x, y);
		this.force = new Vector(0, 0);
		this.velocity = new Vector(0, 0);
	}
	addForce(force) {
		this.force.add(force);
	}
	integrate(_dt) {
		const posDelta = new Vector(this.velocity.x, this.velocity.y);
		posDelta.multiply(_dt);
		this.position.add(posDelta);

		const acc = this.currentForce;
		acc.divide(this.mass);
		acc.multiply(_dt);
		this.velocity.add(acc);

		this.force = new Vector(0, 0);
	}
	get currentForce() {
		const totalForce = new Vector(this.force.x, this.force.y);
		const speed = this.velocity.length();
		const dragVel = new Vector(this.velocity.x, this.velocity.y);
		dragVel.multiply(this.drag * this.mass * speed);
		totalForce.subtract(dragVel);
		return totalForce;
	}
}

class ConfettiPaper {
	constructor(_x, _y) {
		const ci = Math.round(Math.random() * (colors.length - 1));
		this.frontColor = colors[ci][0];
		this.backColor = colors[ci][1];

		this.pos = new Vector(_x, _y);
		this.rotationSpeed = (Math.random() * 600 + 800);
		this.angle = DEG_TO_RAD * Math.random() * 360;
		this.rotation = DEG_TO_RAD * Math.random() * 360;
		this.cosA = 1.0;
		this.size = 5.0;
		this.oscillationSpeed = (Math.random() * 1.5 + 0.5);
		this.xSpeed = 40.0;
		this.ySpeed = (Math.random() * 60 + 50.0);
		this.time = Math.random();

		this.corners = new Array(4);
		for (let i = 0; i < 4; i++) {
			const dx = Math.cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
			const dy = Math.sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
			this.corners[i] = new Vector(dx, dy);
		}
	}
	update(_dt) {
		this.time += _dt;
		this.rotation += this.rotationSpeed * _dt;
		this.cosA = Math.cos(DEG_TO_RAD * this.rotation);
		this.pos.x += Math.cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt
		this.pos.y += this.ySpeed * _dt;

		if (this.pos.y > ConfettiPaper.bounds.y) {
			this.pos.x = Math.random() * ConfettiPaper.bounds.x;
			this.pos.y = 0;
		}
	}
	draw(_g) {
		if (this.cosA > 0) {
			_g.fillStyle = this.frontColor;
		} else {
			_g.fillStyle = this.backColor;
		}
		_g.beginPath();
		_g.moveTo((this.pos.x + this.corners[0].x * this.size) * retina, (this.pos.y + this.corners[0].y * this.size * this.cosA) * retina);
		for (let i = 1; i < 4; i++) {
			_g.lineTo((this.pos.x + this.corners[i].x * this.size) * retina, (this.pos.y + this.corners[i].y * this.size * this.cosA) * retina);
		}
		_g.closePath();
		_g.fill();
	}
}
ConfettiPaper.bounds = new Vector(0, 0);

class ConfettiRibbon {
	constructor(_x, _y, _thickness = 8.0, _angle = 45) {
		const ci = Math.round(Math.random() * (colors.length - 1));
		this.frontColor = colors[ci][0];
		this.backColor = colors[ci][1];

		this.position = new Vector(_x, _y);
		this.prevPosition = new Vector(_x, _y);

		this.particleDist = 8.0;
		this.particleCount = 30;
		this.particleMass = 1;
		this.particleDrag = 0.05;

		this.xOff = (Math.cos(DEG_TO_RAD * _angle) * _thickness);
		this.yOff = (Math.sin(DEG_TO_RAD * _angle) * _thickness);
		this.ySpeed = (Math.random() * 40 + 80);
		this.oscillationSpeed = (Math.random() * 2 + 2);
		this.oscillationDistance = (Math.random() * 40 + 40);
		this.velocityInherit = (Math.random() * 2 + 4);
		this.time = Math.random() * 100;

		this.particles = new Array(this.particleCoun);
		for (let i = 0; i < this.particleCount; i++) {
			this.particles[i] = new EulerMass(_x, _y - i * this.particleDist, this.particleMass, this.particleDrag);
		}
	}
	update(_dt) {
		this.time += _dt * this.oscillationSpeed;
		this.position.y += this.ySpeed * _dt;
		this.position.x += Math.cos(this.time) * this.oscillationDistance * _dt;
		this.particles[0].position = this.position;
		const dX = this.prevPosition.x - this.position.x;
		const dY = this.prevPosition.y - this.position.y;
		const delta = Math.sqrt(dX * dX + dY * dY);
		this.prevPosition = new Vector(this.position.x, this.position.y);

		for (let i = 1; i < this.particleCount; i++) {
			const dirP = Vector.Sub(this.particles[i - 1].position, this.particles[i].position);
			dirP.normalize();
			dirP.multiply((delta / _dt) * this.velocityInherit);

			const rp2 = new Vector(this.particles[i].position.x, this.particles[i].position.y);
			rp2.subtract(this.particles[i - 1].position);
			rp2.normalize();
			rp2.multiply(this.particleDist);
			rp2.add(this.particles[i - 1].position);

			this.particles[i].position = rp2;
			this.particles[i].addForce(dirP);
			this.particles[i].integrate(_dt);
		}

		if (this.position.y > ConfettiRibbon.bounds.y + this.particleDist * this.particleCount) {
			this.reset();
		}
	}
	reset() {
		const ci = Math.round(Math.random() * (colors.length - 1));
		this.frontColor = colors[ci][0];
		this.backColor = colors[ci][1];

		this.position.y = -Math.random() * ConfettiRibbon.bounds.y;
		this.position.x = Math.random() * ConfettiRibbon.bounds.x;
		this.prevPosition = new Vector(this.position.x, this.position.y);
		this.velocityInherit = Math.random() * 2 + 4;
		this.time = Math.random() * 100;
		this.oscillationSpeed = Math.random() * 2.0 + 1.5;
		this.oscillationDistance = (Math.random() * 40 + 40);
		this.ySpeed = Math.random() * 40 + 80;

		this.particles = new Array(this.particleCount);
		for (let i = 0; i < this.particleCount; i++) {
			this.particles[i] = new EulerMass(this.position.x, this.position.y - i * this.particleDist, this.particleMass, this.particleDrag);
		}
	}
	draw(_g) {
		for (let i = 0; i < this.particleCount - 1; i++) {
			const p0 = new Vector(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
			const p1 = new Vector(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);
			if (this.side(this.particles[i].position.x, this.particles[i].position.y, this.particles[i + 1].position.x, this.particles[i + 1].position.y, p1.x, p1.y) < 0) {
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
	side(x1, y1, x2, y2, x3, y3) {
		return ((x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2));
	}
}
ConfettiRibbon.bounds = new Vector(0, 0);


class Context {
	constructor(id) {
		this.interval = null;

		this.canvas = document.getElementById(id);
		this.context = this.canvas.getContext('2d');

		this.resize();

		this.confettiRibbons = new Array(confettiRibbonCount);
		for (let i = 0; i < confettiRibbonCount; i++) {
			this.confettiRibbons[i] = new ConfettiRibbon(Math.random() * this.canvasWidth, -Math.random() * this.canvasHeight * 2);
		}

		this.confettiPapers = new Array(confettiPaperCount);
		for (let j = 0; j < confettiPaperCount; j++) {
			this.confettiPapers[j] = new ConfettiPaper(Math.random() * this.canvasWidth, Math.random() * this.canvasHeight);
		}
	}
	resize() {
		const { parentNode } = this.canvas;
		const { offsetWidth, offsetHeight } = parentNode;

		this.canvasWidth = offsetWidth;
		this.canvasHeight = offsetHeight;

		this.canvas.width = offsetWidth * retina;
		this.canvas.height = offsetHeight * retina;

		ConfettiPaper.bounds = new Vector(this.canvasWidth, this.canvasHeight);
		ConfettiRibbon.bounds = new Vector(this.canvasWidth, this.canvasHeight);
	}
	start() {
		this.stop();
		this.update();
	}
	stop() {
		(window.cancelAnimationFrame || window.cancelRequestAnimationFrame)(this.interval);
	}
	update() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (let i = 0; i < confettiPaperCount; i++) {
			this.confettiPapers[i].update(duration);
			this.confettiPapers[i].draw(this.context);
		}

		for (let j = 0; j < confettiRibbonCount; j++) {
			this.confettiRibbons[j].update(duration);
			this.confettiRibbons[j].draw(this.context);
		}

		this.interval = window.requestAnimationFrame(() => confetti.update());
	}
}

function generateConfetti() {
	const confetti = new Context('confetti');
	window.addEventListener('resize', e => confetti.resize());
	return confetti;
};
