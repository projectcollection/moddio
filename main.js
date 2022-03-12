//Requirements:
//- Units must move independently from one another
//- Lines of the JS code should be less than 60
//- Legible, cleanly written code
//- Supports all window sizes/resizes
//- When unit collides with an edge of the canvas, it’ll bounce and change its
//  direction and angle appropriately

import { getRandomInt, convertAngle, getVecComponents } from "./helpers.js";
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
const texture = PIXI.Texture.from("imgs/arrow.png");
const bg = PIXI.Texture.from("imgs/bg.png");

const bg_sprite = new PIXI.Sprite(bg);
bg_sprite.width = app.screen.width;
bg_sprite.height = app.screen.height;
bg_container.addChild(bg_sprite);

// Create a 5x5 grid of bunnies
//for (let i = 0; i < 25; i++) {
const bunny = new PIXI.Sprite(texture);
bunny.anchor.set(0.5, 0.5);
//bunny.x = (i % 5) * 40;
//bunny.y = Math.floor(i / 5) * 40;
container.addChild(bunny);
//}

let getAngle = (x, y) => {
  let q = 0;
  if (x > 0 && y > 0) {
    q = 1;
  }
  if (x < 0 && y > 0) {
    q = 2;
  }
  if (x < 0 && y < 0) {
    q = 3;
  }
  if (x > 0 && y < 0) {
    q = 4;
  }

  let radian = Math.atan((y * -1) / x);
  //return (q - 1) * 90 + Math.abs(radian * (180 / Math.PI));
  return radian * (180 / Math.PI);
};

const convertCoord = (x, y) => {
  return { x, y: y * -1 };
};

// Move container to the center
container.position.set(app.screen.width / 2, app.screen.height / 2);

// Center bunny sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

container.angle = convertAngle(45);
let speed = 5;

let { x, y } = getVecComponents(convertAngle(container.angle));
console.log(convertCoord(x, y));
// Listen for animate update
app.ticker.add((delta) => {
  // rotate the container!
  // use delta to create frame-independent transform
  if (container.x < 0 || container.x > app.view.width) {
    console.log("BEFORE Hit", x, y);
    x = -x;
    console.log("x inverse", x, y);
    //console.log("before -", container.angle, x, y);
    let _x = Math.cos(container.angle) * speed;
    let _y = Math.sin(container.angle) * speed;
    let reflectAngle = convertAngle(getAngle(x * speed, y * speed));

    console.log("_x, _y", _x, _y);
    console.log("reflectAngle", reflectAngle, x, y);

    container.angle = convertAngle(reflectAngle);
    console.log("real Angle", container.angle);
    //if (_x > 0 && _y > 0) {
    //  container.angle = convertAngle(180 - reflectAngle);
    //} else if (_x < 0 && _y > 0) {
    //  container.angle = reflectAngle;
    //} else if (_x < 0 && _y < 0) {
    //  container.angle = convertAngle(0 + reflectAngle);
    //} else {
    //  container.angle = convertAngle(180 + reflectAngle);
    //}

    //let newxy = getVecComponents(convertAngle(container.angle));
    //y = newxy.y;

    //console.log("after", container.angle);
  } else if (container.y < 0 || container.y > app.view.height) {
    console.log("BEFORE Hit", convertCoord(x, y));
    y = -y;
    console.log("y inverse", convertCoord(x, y));

    console.log("Y angle before:", convertAngle(container.angle));
    let _x = Math.cos(container.angle) * speed;
    let _y = Math.sin(container.angle) * speed;
    //let reflectAngle = convertAngle(convertAngle(getAngle(_x, _y)));
    console.info("For new angle", getAngle(x * speed, y * speed));

    let reflectAngle = convertAngle(getAngle(x * speed, y * speed));

    console.log("_x, _y", convertCoord(_x, _y));
    console.log("reflectAngle", reflectAngle, convertCoord(x, y));

    container.angle = convertAngle(reflectAngle);
    console.log("real Angle", container.angle);
    //if (_x > 0 && _y > 0) {
    //  container.angle = convertAngle(0 - reflectAngle);
    //} else if (_x < 0 && _y > 0) {
    //  container.angle = convertAngle(180 + reflectAngle);
    //} else if (_x < 0 && _y < 0) {
    //  container.angle = convertAngle(90 + reflectAngle);
    //} else {
    //  container.angle = convertAngle(0 + reflectAngle);
    //}
    //let newxy = getVecComponents(convertAngle(container.angle));
    //x = newxy.x;
  }

  // Listen for animate update
  container.position.set(container.x + speed * x, container.y + speed * y);
});

window.addEventListener("resize", resize);
// Resize function window
function resize() {
  // Resize the renderer
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
