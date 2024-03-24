import * as Yup from 'yup';
import { UserDataTypes } from 'snakicz-types'; // Importing UserDataTypes interface

const initialValues: UserDataTypes = {
  uniqueId: '',
  phoneNumber: '',
  isFirstTimeBuy: false,
  ordersCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const validationSchema = Yup.object().shape({
  uniqueId: Yup.string().required('Введіть унікальний ідентифікатор'),
  phoneNumber: Yup.string().required('Введіть номер телефону'),
  ordersCount: Yup.number()
    .required('Введіть кількість замовлень')
    .positive('Кількість замовлень має бути додатнім числом'),
});

export const FormikUsers = { initialValues, validationSchema };
