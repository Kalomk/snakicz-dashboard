import { OrderType, ProductType, UserDataTypes } from 'snakicz-types';

export interface CustomComponentProps<T> {
  data: T;
}

export type CustomComponentPropsWidthProductType<T> = {
  productItems: ProductType[];
} & CustomComponentProps<T>;

export type FilterSchemaType<Y> = {
  name: string;
} & FilterFuncType<Y>;

export interface FilterFuncType<Y> {
  filterFunc: (data: Y) => boolean;
}
export type Concat<T extends string[]> = T extends [
  infer F extends string,
  ...infer R extends string[]
]
  ? `${F}${Concat<R>}`
  : '';
