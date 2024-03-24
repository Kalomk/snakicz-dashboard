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
