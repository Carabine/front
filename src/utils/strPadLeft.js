export const strPadLeft = (string, pad, length) => {
    return (new Array(length+1).join(pad)+string).slice(-length);
}