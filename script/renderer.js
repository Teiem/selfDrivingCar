import { SETTINGS, PRECALCULATED } from "/script/settings.js";

const canvas = document.getElementById('canvas');

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const drawCar = ({ direction }) => {
    ctx.save();

    const carCenter = { x: width / 2, y: height / 2 };

    ctx.translate(carCenter.x, carCenter.y);
    ctx.rotate(-direction);
    ctx.translate(-carCenter.x, -carCenter.y);

   if (!carImage) {
        ctx.fillStyle = SETTINGS.car.color;
        ctx.fillRect(carCenter.x - SETTINGS.car.width / 2, carCenter.y - SETTINGS.car.height / 2, SETTINGS.car.width, SETTINGS.car.height);

   } else {
       ctx.drawImage(
            carImage,
            carCenter.x - SETTINGS.car.width / 2,
            carCenter.y - SETTINGS.car.height / 2,
            SETTINGS.car.width,
            SETTINGS.car.height
        );
   }

    ctx.restore();
};

const drawBackground = ({ x: carX, y: carY }) => {
    ctx.fillStyle = SETTINGS.renderer.map.checkerBoardColorA;
    ctx.fillRect(0, 0, width, height);

    const perHeight = 100;
    const perWidth = 100;

    const offsetX = -carX % (perWidth * 2);
    const offsetY = -carY % (perHeight * 2);

    ctx.fillStyle = SETTINGS.renderer.map.checkerBoardColorB;
    for (let y = -2; y * perHeight < height + 2 * perHeight; ++y) {
        for (let x = -2; x * perWidth < width + 2 * perWidth; ++x) {
            if ((x + y) % 2) {
                ctx.fillRect(x * perWidth + offsetX, y * perHeight + offsetY, perHeight, perWidth);
            }
        }
    }
};

const drawMap = (map, { x: carX, y: carY }) => {
    const granularity = SETTINGS.physics.granularity;

    const offsetX = -carX % granularity;
    const offsetY = -carY % granularity;

    const hills = [];
    const hillTops = [];

    for (let y = -granularity; y < height + granularity; y += granularity) {
        for (let x = -granularity; x < width + granularity; x += granularity) {
            const blockX = carX + x - width / 2 + offsetX;
            const blockY = carY + y - height / 2 + offsetY;

            const block = map(blockX, blockY);

            if (block === "Hill") {
                hills.push({ x: x + offsetX, y: y + offsetY });

            } else if (block === "HillTop") {
                hillTops.push({ x: x + offsetX, y: y + offsetY });

            }
        }
    }

    ctx.beginPath();
    ctx.fillStyle = SETTINGS.renderer.map.hillColor;
    hills.forEach(({ x, y }) => ctx.rect(x, y, granularity, granularity));
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = SETTINGS.renderer.map.hillTopColor;
    hillTops.forEach(({ x, y }) => ctx.rect(x, y, granularity, granularity));
    ctx.fill();
    ctx.closePath();
};

const drawRays = ({ direction }, rays) => {
    const cos = Math.cos(direction);
    const sin = Math.sin(direction);

    const carFront = {
        x: width / 2 + sin * SETTINGS.car.height / 2,
        y: height / 2 + cos * SETTINGS.car.height / 2
    };

    PRECALCULATED.rayDegrees.forEach((angleOffset, i) => {
        const rayDirection = direction + angleOffset * Math.PI + Math.PI;

        const cos = Math.cos(rayDirection);
        const sin = Math.sin(rayDirection);

        ctx.strokeStyle = SETTINGS.renderer.rays[rays[i] ? "colorHit" : "colorMiss"];
        ctx.beginPath();
        ctx.moveTo(carFront.x, carFront.y);
        ctx.lineTo(
            cos * 0 - sin * SETTINGS.renderer.rays.length + carFront.x,
            sin * 0 - cos * SETTINGS.renderer.rays.length + carFront.y
        );
        ctx.stroke();
    })
};

let carImage;
export const setCarImage = _image => carImage = _image;

export const render = ({ car, rays, map }) => {
    drawBackground(car);
    drawMap(map, car);
    drawCar(car);
    drawRays(car, rays);
}