export const calculateArrayOfPriceInEuro = (arr: number[]) =>
  arr.map((price) => Number((price / 4.5).toFixed(2)));

export const calculatePriceInEuro = (value: number) => Number((value / 4.5).toFixed(2));
