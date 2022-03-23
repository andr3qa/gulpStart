import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./dist`;
const srcFolder = `./src`;

export const path = {
    build: {
        js: `${buildFolder}/js/`,
        css: `${buildFolder}/css/`,
        html: `${buildFolder}/`,
        images: `${buildFolder}/img/`,
        resources: `${buildFolder}/resources/`,
    },
    src: {
        js: `${srcFolder}/js/main.js`,
        scss: `${srcFolder}/scss/main.scss`,
        html: `${srcFolder}/html/*.html`,
        images: `${srcFolder}/img/src/**/*.{jpg, jpeg, png, gif, webp}`,
        svg: `${srcFolder}/img/src/**/*.svg`,
        svgicons: `${srcFolder}/img/svg/*.svg`,
        resources: `${srcFolder}/resources/**/*.*`,
    },
    watch: {
        js: `${srcFolder}/js/**/*.js`,
        scss: `${srcFolder}/scss/**/*.scss`,
        html: `${srcFolder}/html/**/*.html`,
        images: `${srcFolder}/img/src/**/*.{jpg, jpeg, png, gif, webp, svg, ico}`,
        svgicons: `${srcFolder}/img/svg/*.svg`,
        resources: `${srcFolder}/resources/**/*.*`,
    },
    clean: buildFolder,
    buildFolder: buildFolder,
    srcFolder: srcFolder,
    rootFolder: rootFolder,
    ftp: ``
}