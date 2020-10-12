const formatToTwoNumbers = (number) => number.toString().length === 1 ? `0${number}` : number;

export {formatToTwoNumbers};
