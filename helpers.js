export { getRandomInt, convertAngle, getVecComponents };

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
let getVecComponents = (angle) => {
  //ref: https://stackoverflow.com/a/23579015/9377904
  let radian = (angle * Math.PI) / 180;

  let x = Math.cos(radian);
  let y = Math.sin(radian);

  if ((180 > angle && angle > 0) || (360 > angle && angle > 180)) {
    y = -y;
  }
  return { x, y };
};

let getAngle = (x, y) => {
  console.log(x, y);
  return Math.atan(x / y);
};
