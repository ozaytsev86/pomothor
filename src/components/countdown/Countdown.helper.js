export const formatToTwoNumbers = (number) => typeof number === 'number' ? number.toString().length === 1 ? `0${number}` : number : '-';
