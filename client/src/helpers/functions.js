export const changeFormatText = (text) => {
    return (text.charAt(0).toUpperCase() + text.slice(1)).split("_").join(" ");
};

export const createLineFromArray = (array) => {
    return array.map((el, i) =>
        i === array.length - 1 ? `${el.name}` : `${el.name}, `
    );
};
