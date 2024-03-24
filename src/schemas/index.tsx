import { OrderType, ProductType, UserDataTypes } from 'snakicz-types';
import { FilterSchemaType } from '../../mainTypes';

export const filterSchemaUsers: FilterSchemaType<UserDataTypes>[] = [
  { name: 'Всі', filterFunc: (data) => !!data },
  { name: 'Купує вперше', filterFunc: (data) => data.isFirstTimeBuy },
];

export const filterSchemaOrders: FilterSchemaType<OrderType>[] = [
  { name: 'Всі', filterFunc: (data) => !!data },
  { name: 'Оплачені', filterFunc: (data) => data.paymentConfirmPicUrl !== '' },
  { name: 'З кицею', filterFunc: (data) => data.isCatExist },
  { name: 'Не оплачені', filterFunc: (data) => data.paymentConfirmPicUrl == '' },
  { name: 'З Бота', filterFunc: (data) => data.orderComeFrom === 'telegram_bot' },
];

export const filterSchemaProducts: FilterSchemaType<ProductType>[] = [
  { name: 'Всі', filterFunc: (data) => data.category !== 0 },
  { name: 'Сушена риба', filterFunc: (data) => data.category === 1 },
  { name: 'Кальмари', filterFunc: (data) => data.category === 2 },
  { name: 'Сети', filterFunc: (data) => data.category === 3 },
];
