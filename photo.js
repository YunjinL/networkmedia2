let sfx;
let vid;
let photo;
let photos = [];
let font;
let zoom = 0.1;
let ztarget = 1;
let orient, otarget;
let laggymouse;
let stripes, ministripes;
let bg = 0;

function preload() {
	sfx = loadSound('polaroid600.wav');
	font = loadFont('UbuntuMono-Bold.ttf');
	stripes = loadImage('polaroidstripes.jpg');
}

function setup() {
	createCanvas(1112, 834, WEBGL);
	vid = createCapture(VIDEO);
	vid.size(height / 3, 0.75 * height / 3);
	vid.hide();
	textFont(font);
	textSize(vid.height / 10);
	textAlign(CENTER, CENTER);
	orient = createVector(PI/3, 0, 0);
	otarget = createVector((PI/3), 2*TWO_PI, 0);
	laggymouse = createVector(0,0,0);
	stripes.resize(vid.height,0);
	ministripes = stripes.get(0,0,stripes.height*0.85,stripes.height);
	imageMode(CENTER);
}

function draw() {
	orbitControl();
	if(bg>0) bg-=20;
	background(bg);
	ambientLight(100-bg);
	laggymouse.lerp(createVector(mouseX, mouseY,0),0.1);
	pointLight(100-bg, 100-bg, 100-bg, laggymouse.x-width/2, laggymouse.y-height / 2, height);
	if(frameCount>60) {
		zoom = lerp(zoom, ztarget, 0.1);
		orient.lerp(otarget, 0.1);
	}
	scale(zoom);

	rotateY(orient.y);
	rotateX(orient.x);

	push();
	translate(vid.width / 2, -1.38 * vid.height, vid.height * 1.1);
	noStroke();
	specularMaterial(255, 110);
	box(vid.height / 4, vid.height, vid.height / 4);
	pop();
	drawCamera();
	for (let p of photos) {
		p.show();
		p.move();
	}
}

function drawCamera() {
	//Camera body
	push();
	noStroke();
	specularMaterial(0, 10); //Slot
	box(vid.width * 1.2, 8, vid.height / 20);
	specularMaterial('black');
	translate(0, -vid.height, vid.height / 10);
	box(vid.width * 1.5, vid.height * 2, vid.height / 3);
	translate(0, 0, vid.height / 6 + vid.height / 12);
	specularMaterial('cornsilk');
	box(vid.width * 1.5, vid.height * 2, vid.height / 6);
	translate(0, 0, vid.height / 2);
	box(vid.width * 1.5, vid.height / 12, vid.height);
	translate(0, -vid.height / 8 - vid.height / 24, vid.height / 24);
	specularMaterial('black');
	box(vid.width * 1.5, vid.height / 4, vid.height - vid.height / 12);
	translate(0, -vid.height / 2.1, -vid.height/3);
	box(vid.width * 1.5, vid.height / 1.4, vid.height/4);
	pop();

	push();
	noStroke();
	specularMaterial('cornsilk');
	translate(0, -vid.height / 1.9, vid.height / 2.5);
	rotateX(-PI / 12.2);
	box(vid.width * 1.499, vid.height, vid.height / 3);
	push();
	translate(0,0,vid.height/5.99);
	rotateZ(HALF_PI);
	image(stripes,0,0);
	pop();
	push();
	translate(0, vid.height/1.91, vid.height/11.5);
		//rotateX(HALF_PI);

	rotateZ(HALF_PI);
	rotateY(HALF_PI - PI/12.2);
	image(ministripes,0,0);
	pop();
	pop();

	//Camera viewfinder
	push();
	noStroke();
	specularMaterial('black');
	translate(vid.width / 2, -1.4 * vid.height, vid.height * 1.1);
	specularMaterial('black')
	box(vid.height / 3, vid.height, vid.height / 3);
	translate(0, -vid.height / 2, 0);
	box(vid.width / 3, vid.height / 20, vid.height / 3);
	translate(0, -vid.height / 200, 0);
	texture(vid);
	rotateY(PI);
	box(-vid.width / 4, vid.height / 20, vid.height / 4);
	pop();

	//Camera lens
	push();
	translate(0, -vid.height, vid.height);
	translate(0, vid.height / 24 + vid.height / 8, 0);
	noStroke();
	specularMaterial('black');
	cylinder(vid.height / 3, vid.height / 4.1, 24, 1, true, false);
	push();
	translate(0, vid.height / 7.9, 0);
	rotateX(HALF_PI);
	torus((vid.height / 3 - 5), 5, 24, 16);
	pop();
	cone(vid.height / 3 - 5, -vid.height / 5, 24, 1, false);
	translate(0, -vid.height / 12, 0);
	specularMaterial('black');
	shininess(50);
	ellipsoid(vid.height / 4, vid.height / 12);
	pop();

	//Focus knob
	push();
	translate(vid.width / 2 - vid.height/20, -vid.height + vid.height / 20, vid.height * 0.8);
	specularMaterial('black');
	noStroke();
	cylinder(vid.height / 12, vid.height / 4);
	push();
	rotateX(HALF_PI);
	torus(vid.height / 12, vid.height / 50);
	pop();
	pop();
	//Shutter release

	push();
	translate(-vid.width / 2, -vid.height + vid.height / 20, vid.height * 0.9);
	specularMaterial('cornsilk');
	noStroke();
	push();
	rotateX(HALF_PI);
	torus(vid.height / 10, vid.height / 50);
	pop();
	specularMaterial(200, 0, 0);
	cylinder(vid.height / 10, vid.height / 20);
	translate(0, 0, vid.height * 0.2);
	rotateX(HALF_PI);
	specularMaterial('black');
	plane(vid.height/3, vid.height/7);
	translate(0, 2, -1);
	specularMaterial(255);
	rotateX(PI);
	textSize(vid.height / 12);
	text('OneStep', 0, 0);
	pop();

	//Text on front
	push();
	translate(0, 1, vid.height / 8);
	specularMaterial(160);
	rotateX(-HALF_PI);
	text('POLAROID LAND CAMERA', 0, 0);
	pop();
}
  


function keyPressed() {
	if (key == 's') save("img_" + month() + '-' + day() + '_' + hour() + '-' + minute() + '-' + second() + ".jpg");
	if (keyCode == UP_ARROW) ztarget += 0.1;
	if (keyCode == DOWN_ARROW) ztarget -= 0.1;
	if (keyCode == LEFT_ARROW) otarget.y -= PI / 4;
	if (keyCode == RIGHT_ARROW) otarget.y += PI / 4;

	if (keyCode == 32 && frameCount > 100) {
		bg = 200;
		for (let p of photos) {
			p.tpos.x += width;
			if (p.tpos.x > width / 2) p.alive = false;
		}
		sfx.play();
		let pic = vid.get();
		//pic.filter(POSTERIZE, 20)
		let pos = createVector(0, -vid.height / 2, 0);
		let tpos = createVector(0, 20 + (vid.height / 2), 0);
		photos.push(new Photo(pos, tpos, pic));
		setTimeout(eject, 500);
		setTimeout(droop, 1500);
		setTimeout(develop, 2000);
	}
}

function eject() {
	photos[photos.length - 1].moving = true;
	photos = photos.filter(p => p.alive);
}

function droop() {
	photos[photos.length - 1].drooping = true;
}

function develop() {
	photos[photos.length - 1].developing = true;
}

class Photo {
	constructor(pos, tpos, pic) {
		this.pos = pos;
		this.tpos = tpos;
		this.pic = pic;
		this.moving = false;
		this.drooping = false;
		this.developing = false;
		this.alive = true;
		this.angle = 0;
		this.t = 0;
	}
	move() {
		if (this.moving) this.pos.lerp(this.tpos, 0.1);
		if (this.drooping) this.angle = lerp(this.angle, -PI / 4, 0.1);
		if (this.developing) this.t = lerp(this.t, 255, 0.02);
	}
	show() {
		push();
		translate(this.pos.x, this.pos.y - vid.height * 0.55, this.pos.z);
		rotateX(this.angle);
		translate(0, vid.height * 0.55, 0);
		noStroke();
		specularMaterial(255);
		box(vid.width * 1.1, vid.height * 1.2, vid.height * 0.02);
		translate(0, - vid.height * 0.05, vid.height * 0.02);
		texture(this.pic);
		tint(this.t);
		rotateY(PI);
		plane(vid.width, vid.height);
		pop();
	}
}