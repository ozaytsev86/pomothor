export const formatToTwoNumbers = (number) => number.toString().length === 1 ? `0${number}` : number;

export const getHours = (time) => Math.floor((time / 3600) % 24);
export const getMinutes = (time) => Math.floor((time / 60) % 60);
export const getSeconds = (time) => Math.floor(time % 60);

export const calculateTime = (t) => {
  if (t) {
    const startTimeStamp = new Date(t).getTime();
    const total = Math.round(
      parseFloat(
        (Math.max(0, startTimeStamp - Date.now()) / 1000).toFixed(
          Math.max(0, Math.min(20, 0))
        )
      ) * 1000
    );

    return total / 1000;
  }

  return null;
};