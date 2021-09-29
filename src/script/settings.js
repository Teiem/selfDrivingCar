export const SETTINGS = {
    car: {
        width: 31 * 3,
        height: 81 * 3,
        color: '#E8D8B9',
        offset: 100,
        maxSteering: 0.01,
        acceleration: 0.1,
        deceleration: 0.2,
    },
    physics: {
        timeBetweenSteps: 1000 / 60 * 1,
        rays: {
            count: 5, // steering is hardcoded to expect 5 rays
            offset: 0.1,
            range: 500,
            stepSize: 0.1,
        },
        granularity: 10,
        speedFalloff: 0.01,
    },
    renderer: {
        rays: {
            length: 500,
            colorHit: '#E0403F',
            colorMiss: '#234',
        },
        map: {
            hillColor: "#424A28",
            hillTopColor: "#282C34",
            checkerBoardColorA: "#456",
            checkerBoardColorB: "#567",
        },
    },
}

export const PRECALCULATED = {
    rayDegrees: [...Array(SETTINGS.physics.rays.count).keys()].map(n => (n - SETTINGS.physics.rays.count / 2 + 0.5) * SETTINGS.physics.rays.offset),
}