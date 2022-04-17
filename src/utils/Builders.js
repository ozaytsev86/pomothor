export const buildUrl = (url, params, values) => {
  const paramsArr = Array.isArray(params) ? params : [params];
  const valuesArr = Array.isArray(values) ? values : [values];

  let newUrl = url;

  paramsArr.forEach((param, index) => {
    newUrl = newUrl.replace(`:${param}`, valuesArr[index]);
  });

  return newUrl;
};
