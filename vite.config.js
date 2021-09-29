/**
 * @type {import('vite').UserConfig}
 */
export default {
    build: {
        target: 'esnext',
        outDir: '../dist',
        publicDir: './public',
    },
    server: {
        port: 5000,
    }
}