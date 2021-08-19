export const rand = (max) => Math.floor(Math.random() * max);

export const randRgb = () => `rgb(${rand(256)},${rand(256)},${rand(256)})`; 