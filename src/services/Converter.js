// #FFFFFF
// 0123456
export const hexToRgb = (hex) => {
    const r = hexToDec(`${hex[1]}${hex[2]}`);
    const g = hexToDec(`${hex[3]}${hex[4]}`);
    const b = hexToDec(`${hex[5]}${hex[6]}`);

    return `rgb(${r}, ${g}, ${b})`;
}

export const rgbToHex = (s) => {
    const rgb = s.substring(4, s.length-1).split(',');
    const hex = rgb.map(val => decToHex(val)).join('');
    return '#' + hex;
}

export const decToHex = (n) => {
    const val1 = Math.floor(n / 16) % 16;
    const val2 = n % 16;

    return charToHex(val1) + charToHex(val2);
}

export const hexToDec = (hex) => {
    let dec = 0;
    let pow = hex.length - 1;

    for(let i=0; i < hex.length; i++,pow--) {
        const val = hexToChar(hex[i]);
        dec += val * Math.pow(16, pow);
    }

    return dec;
}

export const charToHex = (c) => {
    if(c <= 9) return c;

    switch(c) {
        case 10: return 'A';
        case 11: return 'B';
        case 12: return 'C';
        case 13: return 'D';
        case 14: return 'E';
        case 15: return 'F';
    }
}

export const hexToChar = (hex) => {
    if(hex <= 9) return hex;

    switch(hex.toUpperCase()) {
        case 'A': return 10;
        case 'B': return 11;
        case 'C': return 12;
        case 'D': return 13;
        case 'E': return 14;
        case 'F': return 15;
    }
}