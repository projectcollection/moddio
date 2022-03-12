import {
  getRandomInt,
  convertAngle,
  getVecComponents,
  getAngle,
  getQuadrant,
} from "./helpers.js";

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1099bb,
  resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const container = new PIXI.Container();
const bg_container = new PIXI.Container();

app.stage.addChild(bg_container);
app.stage.addChild(container);

// Create a new texture
const texture = PIXI.Texture.from("imgs/manBlue_stand.png");
const bg = PIXI.Texture.from("imgs/bg.png");

const bg_sprite = new PIXI.Sprite(bg);
bg_sprite.width = app.screen.width;
bg_sprite.height = app.screen.height;
bg_container.addChild(bg_sprite);

const bunny = new PIXI.Sprite(texture);
bunny.anchor.set(0.5, 0.5);
container.addChild(bunny);

// Move container to the center
container.position.set(app.screen.width / 2, app.screen.height / 2);

// Center bunny sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

container.angle = convertAngle(240);
let speed = 10;

let quadrants = {
  1: (a) => convertAngle(-a),
  2: (a) => convertAngle(270 - convertAngle(a)),
  3: (a) => convertAngle(180 - a),
  4: (a) => convertAngle(a),
};

let { x, y } = getVecComponents(convertAngle(container.angle));
// Listen for animate update
app.ticker.add((delta) => {
  if (container.x < 0 || container.x > app.view.width) {
    x = -x;
    let reflectAngle = getAngle(x * speed, y * speed);
    container.angle = quadrants[getQuadrant(x, y)](reflectAngle);
  } else if (container.y < 0 || container.y > app.view.height) {
    y = -y;
    let reflectAngle = getAngle(x * speed, y * speed);
    container.angle = quadrants[getQuadrant(x, y)](reflectAngle);
  }

  // Listen for animate update
  container.position.set(container.x + speed * x, container.y + speed * y);
});

window.addEventListener("resize", resize);
// Resize function window
function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);

  // You can use the 'screen' property as the renderer visible
  // area, this is more useful than view.width/height because
  // it handles resolution
  //container.position.set(app.screen.width / 2, app.screen.height / 2);
  bg_container.position.set(0, 0);

  if (bg_sprite.width < app.screen.width) {
    bg_sprite.width = app.screen.width;
  }
  if (bg_sprite.height < app.screen.height) {
    bg_sprite.height = app.screen.height;
  }
}
resize();
