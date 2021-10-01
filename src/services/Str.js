export const insert = (str, value, pos) => {
    let s1 = str.substring(0, pos);
    let s2 = str.substring(pos);
    return s1 + value + s2;
}