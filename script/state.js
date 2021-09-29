import { SETTINGS } from "/script/settings.js";

export default {
    car: {
        x: 0,
        y: 0,
        direction: Math.PI * 0.1,
        steering: 0,
        speed: 2,
        primarySteerDirection: 1,
        primarySteerDirectionLocked: false,
    },
    rays: [...Array(SETTINGS.physics.rays.count).fill(false)],
    map: () => false,
}