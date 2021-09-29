import { render, setCarImage } from "/script/renderer.js";
import { step } from "/script/simulation.js";
import state from "/script/state.js";
import { SETTINGS } from "/script/settings.js";

step();
setInterval(step, SETTINGS.physics.timeBetweenSteps);

const callRender = () => requestAnimationFrame(() => {
    render(state);
    callRender();
});
callRender();

const loadIamge = async () => new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = './car.png';
})

const image = await loadIamge();
setCarImage(image);