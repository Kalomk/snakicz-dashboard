'use client';
import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  FormControl,
  FormLabel,
  Text,
  Checkbox,
  VStack,
  Input,
  Switch,
} from '@chakra-ui/react';
import { Form, FormikProvider, useFormik } from 'formik';
import FileUploader from './FileUploader';
import { CartItem, ProductType } from 'snakicz-types';
import { Products } from '@/api/products';
import { useFormikAutoFill } from '@/hooks/useFormikAutoFill';
import { FormikProducts } from '@/formik/products';
import { InputWeightCheckboxes, TotalWeightFromProduct } from './inputWeightFileds';
import { CountSetsButton, DescField } from './SetFields';
import { mapCartItems } from '@/utils/mapCartItems';
import { uploadProductFileImg } from '@/utils/uploadTotheMediaServer';

export interface PostInput {
  name: keyof ProductType;
  label: string;
}

const AddProductItemForm: React.FC<{ productItems: ProductType[] }> = ({ productItems }) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [priceItems, setPriceItems] = useState<{
    zł: { [key: string]: number };
    '€': { [key: string]: number };
  }>({ zł: {}, '€': {} });

  const [isEnable, setIsEnable] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSet, setIsSet] = useState<boolean>(false);

  const handleCheckboxChange = (value: string) => {
    const newCheckedItems = checkedItems.includes(value)
      ? checkedItems.filter((item) => item !== value)
      : [...checkedItems, value];

    setCheckedItems(newCheckedItems);
  };

  const handleTransformData = (data: CartItem[]) => {
    const mappedItems = mapCartItems(data);
    formik.setFieldValue('totalProductWeightFromProducts', mappedItems);
  };

  const handlePriceChange = (value: number, name: string) => {
    const calculatePriceInEuro = (price: number) => price / 4.5;
    const priceInEuro = Number(calculatePriceInEuro(value).toFixed(2));

    setPriceItems((prev) => ({
      zł: { ...prev.zł, [name]: value },
      '€': { ...prev['€'], [name]: priceInEuro },
    }));
  };

  const [checkboxItems, setCheckBoxItems] = useState(['100', '250', '500', '1000']);

  const btnsItems = ['Всі', 'Cушена риба', 'Кальмари', 'Сети'];

  const fileRef = useRef<HTMLInputElement>(null);

  const postInputs: PostInput[] = [
    { name: 'title', label: 'Назва' },
    { name: 'category', label: 'Категорія' },
    { name: 'weight', label: 'Вага' },
    { name: 'price', label: 'Ціна' },
    { name: 'img', label: 'Фото' },
    { name: 'totalProductWeightFromProducts', label: 'До сету входить' },
    { name: 'totalWeightProduct', label: 'Загальна кількість' },
    { name: 'description', label: 'Опис' },
    { name: 'isEnable', label: 'Доступний' },
  ];

  const formik = useFormik({
    initialValues: FormikProducts.initialValues,
    validationSchema: FormikProducts.validationSchema(isSet),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsUploading(true);
        const { addNewProduct } = Products;
        const imgUrl = await uploadProductFileImg(values.img);

        const newProduct: ProductType = {
          title: values.title,
          description: values.description,
          price: priceItems,
          weight: checkedItems.map((item) => Number(item)),
          category: btnsItems.findIndex(
            (itemToFind) => itemToFind === (values.category as unknown as string)
          ),
          totalWeightProduct: Number(values.totalWeightProduct) ?? 0,
          totalProductWeightFromProducts: values.totalProductWeightFromProducts,
          img: imgUrl.imgUrl,
          isEnable: values.isEnable,
        };
        await addNewProduct(newProduct);
      } catch (e) {
        console.log(e);
      } finally {
        setIsUploading(false);
        resetForm();
        setCheckedItems([]);
        window.location.reload();
      }
    },
  });

  const [switchToSet, switchToSingle] = useFormikAutoFill<typeof FormikProducts.initialValues>({
    provider: formik,
    builder: {
      case1: ({ title, category }) => {
        title.setValue('Якийсь сет');
        category.setValue('Сети');
        setCheckedItems(['1000']);
        setIsSet(true);
      },
      case2: ({ title, category }) => {
        title.setValue('');
        category.setValue('Всі');
        setCheckedItems(['100', '250', '500', '1000']);
        setIsSet(false);
      },
    },
  });

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      switchToSingle();
    } else {
      switchToSet();
    }
  };

  const renderFields = ({ name, label }: PostInput) => {
    const fieldName = name as keyof typeof FormikProducts.initialValues; // Explicitly define the type of 'name'
    const value = formik.values[fieldName];
    const error = formik.errors[fieldName]?.toString();
    const touch = formik.touched[fieldName];

    switch (name) {
      case 'img':
        return (
          <FormControl mt={5} id={`${name}-id`}>
            <FormLabel>{label}</FormLabel>
            <FileUploader
              name={name}
              type="file"
              ref={fileRef}
              setFieldValue={formik.setFieldValue}
            />
            {touch && error && <Text color="red.500">{error}</Text>}
          </FormControl>
        );

      case 'weight':
        return (
          <InputWeightCheckboxes
            checkboxItems={checkboxItems}
            checkedItems={checkedItems}
            setCheckBoxItems={setCheckBoxItems}
            handleCheckboxChange={handleCheckboxChange}
            name={name}
            label={label}
          />
        );
      case 'isEnable':
        return (
          <FormControl mt={5} id={`${name}-id`}>
            <FormLabel>{label}</FormLabel>
            <Checkbox
              key={name}
              isChecked={isEnable}
              onChange={() => setIsEnable((value) => !value)}
            />
          </FormControl>
        );
      case 'totalWeightProduct':
        return (
          <FormControl mt={5} id={`${name as string}-id`} isInvalid={!!(touch && error)}>
            <FormLabel>{isSet ? 'Загальна кількість сетів в штуках' : label}</FormLabel>
            <Input
              type="text"
              placeholder=" "
              name={name as string}
              value={typeof value === 'boolean' ? value.toString() : (value as any)}
              onChange={formik.handleChange}
            />
            {touch && error && <Text color="red.500">{error}</Text>}
            {isSet && (
              <CountSetsButton
                setField={formik.setFieldValue}
                productItems={productItems}
                items={formik.values.totalProductWeightFromProducts}
              />
            )}
          </FormControl>
        );
      case 'description':
        return (
          <>
            {isSet && (
              <FormControl mt={5} id={`${name as string}-id`}>
                <DescField
                  productItems={productItems}
                  name={name}
                  value={value}
                  items={formik.values.totalProductWeightFromProducts}
                  label={label}
                  setField={formik.setFieldValue}
                  handleChange={formik.handleChange}
                />
                {touch && error && <Text color="red.500">{error}</Text>}
              </FormControl>
            )}
          </>
        );
      case 'price':
        return (
          <FormControl mt={5} id={`${name}-id`}>
            <FormLabel>{label}</FormLabel>
            {checkedItems.length === 0 ? (
              <div>Нема цін</div>
            ) : (
              checkedItems.map((item) => (
                <FormControl mt={2} id={`${name}-${item}-id`} key={item}>
                  <FormLabel>{item}</FormLabel>

                  <Input
                    type="text"
                    placeholder=" "
                    name={`${name}.${item}`}
                    value={value ? priceItems.zł[item] : ''}
                    onChange={(e) => handlePriceChange(Number(e.target.value), item)}
                  />
                  {touch && error && <Text color="red.500">{error}</Text>}
                </FormControl>
              ))
            )}
          </FormControl>
        );
      case 'totalProductWeightFromProducts':
        return (
          <>
            {isSet && (
              <TotalWeightFromProduct
                setData={(data) => handleTransformData(data)}
                name={name}
                condition={!!formik.values.img}
                type="col"
                label={label}
                productItems={productItems}
              />
            )}
          </>
        );
      case 'category':
        return (
          <FormControl mt={5} id={`${name}-id`} key={name}>
            <FormLabel>{label}</FormLabel>
            <VStack align="start" spacing={2}>
              {btnsItems.map((item) => (
                <Button
                  key={item}
                  colorScheme={value === item ? 'teal' : 'gray'}
                  onClick={() => formik.setFieldValue(name, item)}
                >
                  {item}
                </Button>
              ))}
            </VStack>
            {touch && error && <Text color="red.500">{error}</Text>}
          </FormControl>
        );

      default:
        return (
          <FormControl mt={5} id={`${name as string}-id`} isInvalid={!!(touch && error)}>
            <FormLabel>{label}</FormLabel>
            <Input
              type="text"
              placeholder=" "
              name={name as string}
              value={typeof value === 'boolean' ? value.toString() : (value as any)}
              onChange={formik.handleChange}
            />
            {touch && error && <Text color="red.500">{error}</Text>}
          </FormControl>
        );
    }
  };

  return (
    <Box>
      <Text fontSize={40} fontWeight={'bold'} marginY={5}>
        Додати товар
      </Text>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="email-alerts" mb="0">
          Чи це сет?
        </FormLabel>
        <Switch onChange={(e) => handleSwitchChange(e)} id="email-alerts" />
      </FormControl>
      <FormikProvider value={formik}>
        <Form className="flex flex-col">
          {postInputs.map((input) => (
            <React.Fragment key={input.name as string}>{renderFields({ ...input })}</React.Fragment>
          ))}
          <Button isLoading={isUploading} mt={4} type="submit">
            Зберегти
          </Button>
        </Form>
      </FormikProvider>
    </Box>
  );
};

export default AddProductItemForm;
