export {
  getRandomInt,
  convertAngle,
  getVecComponents,
  getAngle,
  getQuadrant,
  distance,
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

//from PixiAngle to normal and vice versa
const convertAngle = (degree) => {
  return (360 - degree + 90) % 360;
};

//get components of vector given a normal degree angle
const getVecComponents = (angle) => {
  //ref: https://stackoverflow.com/a/23579015/9377904
  let radian = (angle * Math.PI) / 180;

  let x = Math.cos(radian);
  let y = Math.sin(radian);

  if ((180 > angle && angle > 0) || (360 > angle && angle > 180)) {
    y = -y;
  }
  return { x, y };
};

const getAngle = (x, y) => {
  let radian = Math.abs(Math.atan((y * -1) / x));
  return radian * (180 / Math.PI);
};

const getQuadrant = (x, y) => {
  if (x > 0 && y > 0) {
    return 1;
  } else if (x < 0 && y > 0) {
    return 2;
  } else if (x < 0 && y < 0) {
    return 3;
  } else {
    return 4;
  }
};

const distance = (a, b) => {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
};
