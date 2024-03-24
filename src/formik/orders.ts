import { OrderType } from 'snakicz-types';
import * as Yup from 'yup';

export type OrderTypeWithoutExtraFields = Omit<
  OrderType,
  | 'isStatisted'
  | 'createdAt'
  | 'updatedAt'
  | 'op_isConfirmationOrderSended'
  | 'op_isConfirmationPaymentSended'
  | 'op_isPacNumberSended'
  | 'op_isActualize'
  | 'userName'
  | 'userLastName'
> & { userNameAndLastName: string; shipPrice: number };

const initialValues: OrderTypeWithoutExtraFields = {
  userNameAndLastName: '',
  userCountry: '',
  addressPack: '',
  userAddress: '',
  userCity: '',
  userIndexCity: '',
  userNickname: '',
  isCatExist: false,
  orderNumber: '',
  freeDelivery: true,
  totalPrice: 0,
  paymentConfirmPicUrl: '',
  catExistConfirmPicUrl: '',
  activePrice: 'zł',
  phoneNumber: '',
  contactPhoneNumber: '',
  email: '',
  shipPrice: 0,
  totalWeight: 0,
  orderItems: '',
  price: 0,
};

const validationSchema = (selectedAddress: 'pack' | 'user' | 'bielsko', includeCatPic: boolean) =>
  Yup.object().shape({
    userNameAndLastName: Yup.string()
      .matches(/^[a-zA-ZęĘóÓąĄśŚłŁżŻźŹćĆńŃ\s]*$/, "Ім'я повинно містити лише латинські літери")
      .required("Ім'я обов'язкове поле"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]*$/, 'Номер телефону повинен містити лише цифри')
      .required("Номер телефону обов'язковий")
      .min(9, 'Номер повинен містити 9 символів'),
    contactPhoneNumber: Yup.string()
      .matches(/^[0-9]*$/, 'Номер телефону повинен містити лише цифри')
      .required("Номер телефону обов'язковий")
      .min(9, 'Номер повинен містити 9 символів'),
    email: Yup.string()
      .email('Некоректна адреса електронної пошти')
      .required("Електронна пошта обов'язкове поле"),
    userNickname: Yup.string().required('Нік обовʼязковий'),
    userCity: Yup.string()
      .matches(/^[a-zA-ZęĘóÓąĄśŚłŁżŻźŹćĆńŃ\s-]*$/, 'Місто повинно містити лише латинські літери')
      .required("Місто обов'язкове поле"),
    userIndexCity: Yup.string().required('Ви повинні ввести індекс'),
    orderNumber: Yup.string().required('Ви повинні ввести номер замовлення'),
    addressPack: Yup.string().when([], {
      is: () => selectedAddress === 'pack',
      then: (schema) =>
        schema
          .min(5, 'Мінімальна кількість символів 5')
          .matches(
            /^[a-zA-Z0-9ęĘóÓąĄśŚłŁżŻźŹćĆńŃ\s-]*$/,
            'Адреса повинна містити лише латинські літери'
          )
          .required("Адреса пачкомату обов'язкова"),
      otherwise: (schema) => schema.min(0).notRequired(),
    }),
    userCountry: Yup.string().required("Країна обов'язкова"),
    userAddress: Yup.string().when([], {
      is: () => selectedAddress === 'user' || selectedAddress === 'bielsko',
      then: (schema) =>
        schema
          .min(5)
          .matches(
            /^[a-zA-Z0-9ęĘóÓąĄśŚłŁżŻźŹćĆńŃ\s-]*$/,
            'Ваша адреса повинна містити лише латинські літери'
          )
          .required("Ваша адреса обов'язкова"),
      otherwise: (schema) => schema.min(0).notRequired(),
    }),
    catExistConfirmPicUrl: Yup.mixed().when([], {
      is: () => includeCatPic,
      then: (schema) => schema.required('Вишліть фото кота'),
      otherwise: (schema) => schema.notRequired(),
    }),
    orderItems: Yup.array()
      .test(
        'is-not-empty',
        'Order items array must not be empty',
        (value) => value && value.length > 0
      )
      .required('Мають бути товари'),
  });

export const FormikOrders = { initialValues, validationSchema };
