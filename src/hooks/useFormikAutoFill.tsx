import { useFormik, FormikValues } from 'formik';

type FieldValuesFromFields<S> = {
  [Key in keyof S]: { setValue: (value: any) => void; getValue: () => any };
};

type FuncType<T> = (valuesFromFields: FieldValuesFromFields<T>) => void;

type BuilderType<T> = {
  [key: string]: FuncType<T>;
};

export function useFormikAutoFill<T extends FormikValues>({
  provider,
  builder,
}: {
  provider: ReturnType<typeof useFormik<T>>;
  builder: BuilderType<T>;
}): (() => void)[] {
  const { setFieldValue, values } = provider;

  const makeNewValuesFromFieldsObject = () => {
    const newValueObject = {} as FieldValuesFromFields<T>;

    Object.keys(values).forEach((key) => {
      if (!newValueObject[key]) {
        newValueObject[key as keyof T] = {
          getValue: () => values[key],
          setValue: (newValue: (typeof values)[typeof key]) => setFieldValue(key, newValue),
        };
      }
    });

    return { newValueObject };
  };

  // Call the function to set values on mount or whenever necessary
  const { newValueObject } = makeNewValuesFromFieldsObject();

  return Object.values(builder).map((func) => {
    return () => func(newValueObject);
  });
}
