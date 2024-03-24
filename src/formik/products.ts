import * as Yup from 'yup';

const initialValues = {
  title: '',
  description: '',
  price: { zł: {}, '€': {} },
  weight: [],
  category: 'Всі',
  totalWeightProduct: null,
  totalProductWeightFromProducts: {},
  img: null,
  isEnable: true,
};

const validationSchema = (isSet: boolean) =>
  Yup.object({
    title: Yup.string().required('Title is required'),
    totalWeightProduct: Yup.string()
      .matches(/^[0-9]*$/, 'Вага має бути в цифрах та більше нуля')
      .required('Вага обовʼязкова'),
    img: Yup.mixed().test(
      'is-file-dosent-exist',
      'Вибраний формат не підходить',
      (value) => value && ['image/jpeg', 'image/png', 'image/webp'].includes((value as any).type)
    ),
    category: Yup.string().test(
      'category-must-be-not-zero-point',
      'Оберіть категорію окрім "Всі"',
      (value) => {
        return value != 'Всі';
      }
    ),
    description: Yup.string().when([], {
      is: () => isSet,
      then: (schema) => schema.required('Опис обовʼязковий'),
      otherwise: (schema) => schema.notRequired(),
    }),

    totalProductWeightFromProducts: Yup.object().when([], {
      is: () => isSet,
      then: (schema) =>
        schema.test(
          'is-not-empty',
          'Вага товарів не повинна дорівнювати нулю',
          (obj) => Object.keys(obj).length !== 0
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

export const FormikProducts = { initialValues, validationSchema };
