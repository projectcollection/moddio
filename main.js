import {
  getRandomInt,
  convertAngle,
  getVecComponents,
  getAngle,
  getQuadrant,
  distance,
} from "./helpers.js";

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1099bb,
  resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const Character = class {
  static population = [];
  static quadrants = {
    1: (a) => convertAngle(-a),
    2: (a) => convertAngle(270 - convertAngle(a)),
    3: (a) => convertAngle(180 - a),
    4: (a) => convertAngle(a),
  };

  constructor(id, app, speed, textures) {
    this.id = id;
    this.app = app;
    this.speed = speed;
    this.container = new PIXI.Container();
    this.texture = PIXI.Texture.from(
      textures[getRandomInt(0, textures.length)]
    );

    //x and y vector component
    this._x = 0;
    this._y = 0;

    this.initialize();
  }

  initialize() {
    let container = this.container;
    let charSprite = new PIXI.Sprite(this.texture);

    charSprite.anchor.set(0.5, 0.5);
    container.addChild(charSprite);
    //this is more useful than view.width/height because it handles resolution
    container.position.set(
      getRandomInt(0, app.screen.width),
      getRandomInt(0, app.screen.height)
    );

    // Center prite in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
    container.angle = convertAngle(getRandomInt(0, 360));

    //set vector components from initial angle
    ({ x: this._x, y: this._y } = getVecComponents(
      convertAngle(container.angle)
    ));

    this.app.stage.addChild(container);
    Character.population.push(this);
  }

  move() {
    let app = this.app;
    let container = this.container;
    let speed = this.speed;

    if (container.x < 0 || container.x > app.view.width) {
      this._x = -this._x;
      this.rotate();
    } else if (container.y < 0 || container.y > app.view.height) {
      this._y = -this._y;
      this.rotate();
    }

    container.position.set(
      container.x + speed * this._x,
      container.y + speed * this._y
    );

    this.collision();
  }

  rotate() {
    let speed = this.speed;
    let _x = this._x;
    let _y = this._y;
    let quadrants = Character.quadrants;
    let reflectAngle = getAngle(_x * speed, _y * speed);
    if (_x == 0 || _y == 0) {
      this.container.angle += 180;
    } else {
      this.container.angle = quadrants[getQuadrant(_x, _y)](reflectAngle);
    }
  }

  collision() {
    let otherChars = Character.population.filter((char) => char.id != this.id);

    otherChars.forEach((char) => {
      if (distance(this.container, char.container) < 20) {
        let tint = getRandomInt(5, 20);
        char.container.children[0].tint = tint;
        this.container.children[0].tint = tint;

        this._x *= -1;
        this._y *= -1;
        char._x *= -1;
        char._y *= -1;
        //debugger;
      }
    });
  }
};

const bg_container = new PIXI.Container();
app.stage.addChild(bg_container);

// ENVIRONMENT consts
// -----------------------------------------------------------------------------
const CHARACTERS = 10;
const MIN_SPEED = 3;
const MAX_SPEED = 20;

const BG_TEXTURE = PIXI.Texture.from("./imgs/bg.png");
const CHAR_TEXTURES = [
  "./imgs/manOld_stand.png",
  "./imgs/manBlue_stand.png",
  "./imgs/soldier1_reload.png",
  "./imgs/hitman1_silencer.png",
  "./imgs/survivor1_reload.png",
  "./imgs/zoimbie1_hold.png",
];

// Create a new texture
const bg_sprite = new PIXI.Sprite(BG_TEXTURE);
bg_sprite.width = app.screen.width;
bg_sprite.height = app.screen.height;
bg_container.addChild(bg_sprite);

let chars = [...Array(CHARACTERS)].map((_, idx) => {
  return new Character(
    idx,
    app,
    getRandomInt(MIN_SPEED, MAX_SPEED),
    CHAR_TEXTURES
  );
});

// loop
app.ticker.add((delta) => {
  chars.forEach((char) => {
    char.move();
  });
});

// Resize window
const resize = () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  bg_container.position.set(0, 0);
  if (bg_sprite.width < app.screen.width) {
    bg_sprite.width = app.screen.width;
  }
  if (bg_sprite.height < app.screen.height) {
    bg_sprite.height = app.screen.height;
  }
};
resize();
window.addEventListener("resize", resize);
