const replaceParamsInString = (str, params) => {
  const items = Array.isArray(params) ? params : [params];

  return str.split(/%\d/).reduce((accumulator, currentValue, index) => {
    const item = items[index];

    accumulator.push(currentValue);
    accumulator.push(item);

    return accumulator;
  }, []);
};

export {replaceParamsInString};
