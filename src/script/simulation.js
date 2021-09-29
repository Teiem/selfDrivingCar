import state from "/script/state.js";
import { simplex2, seedNoise } from "/script/perlin.js";
import { SETTINGS, PRECALCULATED } from "/script/settings.js";

const spotIsFree = ({ x, y }, range = 20) => ![...Array(range ** 2).keys()]
    .map(i => [i % range, Math.floor(i / range)])
    .some(([ offsetX, offsetY ]) => state.map(x + offsetX * SETTINGS.physics.granularity, y + offsetY * SETTINGS.physics.granularity) !== "Street");

const moveCarToFreeSpot = () => {
    while (!spotIsFree({ x: state.car.x - SETTINGS.car.width / 2, y: state.car.y - SETTINGS.car.height / 2})) {
        state.car.y -= 5 * SETTINGS.physics.granularity;
    }
};

const createMap = () => {
    seedNoise(42);

    const getMapValue = (x, y) => {
        x /= 1024;
        y /= 1024;

        const n = simplex2(x, y);
        if (n < 0.4) return "Street";
        if (n < 0.6) return "Hill";
        else return "HillTop"
    }

    state.map = getMapValue;
    moveCarToFreeSpot();
};
createMap();

const castRays = () => {
    const carFront = {
        x: state.car.x + Math.sin(state.car.direction) * SETTINGS.car.height / 2,
        y: state.car.y + Math.cos(state.car.direction) * SETTINGS.car.height / 2
    };

    const collisions = PRECALCULATED.rayDegrees.map(angleOffset => {
        const deg = state.car.direction + angleOffset * Math.PI + Math.PI;

        const cos = Math.cos(deg);
        const sin = Math.sin(deg);

        return rayCast(carFront, {
            x: cos * 0 - sin * SETTINGS.renderer.rays.length + carFront.x,
            y: sin * 0 - cos * SETTINGS.renderer.rays.length + carFront.y
        });

    });

    state.rays = collisions.map(Boolean);
};

const rayCast = (from, to) => {
    const currentPosition = { ...from };
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx ** 2 + dy ** 2);
    const stepX = dx / length * SETTINGS.physics.rays.stepSize;
    const stepY = dy / length * SETTINGS.physics.rays.stepSize;
    const steps = SETTINGS.physics.rays.range / SETTINGS.physics.rays.stepSize;

    for (let i = 0; i < steps; i++) {
        const { x, y } = currentPosition;

        if (state.map(x, y) !== "Street") return { x, y };

        currentPosition.x += stepX;
        currentPosition.y += stepY;
    }
};

const moveCar = () => {
    const { car } = state;

    const dy = Math.cos(car.direction) * car.speed;
    const dx = Math.sin(car.direction) * car.speed;

    car.x += dx;
    car.y += dy;

    car.speed = car.speed * (1 - SETTINGS.physics.speedFalloff);
};

const primarySteer = dir => {
    if (!state.car.primarySteerDirectionLocked) {
        state.car.primarySteerDirection = dir;
        state.car.primarySteerDirectionLocked = true;
    }
};

const steer = () => {
    if (state.rays[1]) {
        state.car.steering += 0.001;
        primarySteer(1);

    }
    if (state.rays[3]) {
        state.car.steering -= 0.001;
        primarySteer(-1);

    }
    if (state.rays[0]) {
        state.car.steering += 0.0005;
        primarySteer(1);

    }
    if (state.rays[4]) {
        state.car.steering -= 0.0005;
        primarySteer(-1);

    }
    if (state.rays[2]) {
        state.car.steering += state.car.primarySteerDirection * 0.0002;

    }
    if (state.rays.every(el => !el)) {
        if (state.car.steering !== 0) {
            state.car.steering = state.car.steering > 0 ? Math.max(state.car.steering - 0.0005, 0) : Math.min(state.car.steering + 0.0005, 0);
        }

        state.car.primarySteerDirectionLocked = false;
    }


    if (!state.rays[2]) {
        state.car.speed += SETTINGS.car.acceleration;

    } else {
        state.car.speed = Math.max(0, state.car.speed - SETTINGS.car.deceleration)
    }


    if (state.car.steering > SETTINGS.car.maxSteering) {
        state.car.steering = SETTINGS.car.maxSteering;

    } else if (state.car.steering < -SETTINGS.car.maxSteering) {
        state.car.steering = -SETTINGS.car.maxSteering;

    }

};

const applySteering = () => {
    state.car.direction += state.car.steering;
};

export const step = () => {
    castRays();
    steer();
    applySteering();
    moveCar();
}