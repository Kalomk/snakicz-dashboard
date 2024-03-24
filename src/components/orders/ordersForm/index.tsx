'use client';

import React, { useEffect, useCallback, ChangeEvent, useState, useRef, memo } from 'react';
import { useFormik } from 'formik';
import { Button, Input, Select, FormControl, Checkbox, Text, Flex } from '@chakra-ui/react';
import { useFormikAutoFill } from '../../../hooks/useFormikAutoFill';
import { ActualPriceType, CartItem, OrderType, ProductType } from 'snakicz-types';
import { FormikOrders, OrderTypeWithoutExtraFields } from '@/formik/orders';
import FileUploader from '../../products/productForm/FileUploader';
import CountrySelector, { Countries } from './CountrySelector';
import { CurrencySwitcher } from './CurrencyRadio';
import { TotalWeightFromProduct } from '@/components/products/productForm/inputWeightFileds';
import OrderComeFromRadio from './OrdersCome';
import { updateProductWeightFromProductTotalWeight } from '@/utils/updateProductWeight';
import { mapCartItems } from '@/utils/mapCartItems';
import { calculateShip } from '@/utils/calcShipPrice';
import { Users } from '@/api/users';
import { Orders } from '@/api/orders';
import { Products } from '@/api/products';

const TotalWeightFromProductMemoized = memo(TotalWeightFromProduct);

const OrderAddForm = ({ productItems }: { productItems: ProductType[] }) => {
  const [includeCatPic, setIncludeCatPic] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Countries | ''>('');
  const [selectedFee, setSelectedFee] = useState<string>('0');

  const [selectedAddress, setSelectedAddress] = useState<'pack' | 'user' | 'bielsko'>('user');
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<OrderTypeWithoutExtraFields>({
    initialValues: FormikOrders.initialValues,
    validationSchema: FormikOrders.validationSchema(selectedAddress, includeCatPic),
    onSubmit: async (values, { resetForm }) => {
      const { userNameAndLastName, shipPrice, totalPrice, orderItems, ...rest } = values;
      const [userName, userLastName] = userNameAndLastName.split(' ');
      const mappedItems = mapCartItems(values.orderItems as unknown as CartItem[]);

      const updatedProducts = updateProductWeightFromProductTotalWeight(mappedItems, productItems);

      const data: OrderType = {
        ...rest,
        userName,
        userLastName,
        orderItems: JSON.stringify(orderItems),
        totalPrice: shipPrice + values.price,
        isCatExist: includeCatPic,
      };

      try {
        setIsLoading(true);
        const userDataUniqueId = (
          await Users.createOrFindExistUser(values.userNickname, values.phoneNumber)
        ).uniqueId;
        await Orders.createOrder(userDataUniqueId, data);
        await Products.updateQuantityOfProducts(updatedProducts);
      } catch (error) {
        console.error('Error sending data:', error);
      } finally {
        setIsLoading(false);
        resetForm();
        window.location.reload();
      }
    },
  });

  const [setBielskoValues] = useFormikAutoFill<OrderTypeWithoutExtraFields>({
    provider: formik,
    builder: {
      case1: ({ userCity, userIndexCity }) => {
        userCity.setValue('Bielsko-Biala');
        userIndexCity.setValue('43-300');
      },
    },
  });

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress(e.target.value as 'pack' | 'user' | 'bielsko');
    if (e.target.value === 'bielsko') {
      setBielskoValues();
    } else {
      formik.setFieldValue('userCity', '');
      formik.setFieldValue('userIndexCity', '');
    }
  };

  const onSelectCountry = (selected: Countries) => {
    setSelectedCountry(selected);
    formik.setFieldValue('userCountry', selected);
  };

  const onHandleChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target) {
      const { name, value } = e.target;

      // Check if the element is a file input
      if (e.target.type === 'file') {
        const fileInput = e.target as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
          const selectedFile = fileInput.files[0];
          formik.setFieldValue('catPic', selectedFile);
        }
      } else {
        formik.setFieldValue(name, value);
      }
    }
  };

  const handleTransformData = (data: CartItem[]) => {
    const calcPrice = data.reduce((acc, val) => acc + val.price, 0);
    const calcWeight = data.reduce((acc, val) => acc + val.weight * val.count, 0);
    const activePrice = formik.values.activePrice;

    formik.setFieldValue('orderItems', data);
    formik.setFieldValue('price', calcPrice);
    formik.setFieldValue('totalWeight', calcWeight);
    handleCalcTotalPrice(calcWeight, calcPrice, activePrice);
  };

  const generateEightDigitDecimal = () => {
    const min = 199999998; // Minimum 8-digit number
    const max = 999999997; // Maximum 8-digit number
    const genNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    formik.setFieldValue('orderNumber', genNumber.toString());
  };

  const handleCurrencyChange = (selectedCurrency: any) => {
    formik.setFieldValue('activePrice', selectedCurrency);
  };
  const handleCalcTotalPrice = (
    totalWeight: number,
    price: number,
    activePrice: ActualPriceType
  ) => {
    const { shipPrice, freeShip } = calculateShip(price, activePrice, totalWeight, selectedFee);

    const rightShipPrice = freeShip ? 0 : shipPrice;

    formik.setFieldValue('freeDelivery', freeShip);
    formik.setFieldValue('shipPrice', rightShipPrice);
  };
  const handleOrderComeFromChange = (value: string) => {
    formik.setFieldValue('orderComeFrom', value);
  };

  const inputFields = [
    { name: 'userNameAndLastName', label: "Ім'я та Прізвище", type: 'text' },
    { name: 'userCity', label: 'Місто', type: 'text' },
    { name: 'userIndexCity', label: 'Індекс', type: 'text' },
    { name: 'orderNumber', label: 'Номер замовлення', type: 'text' },
    { name: 'phoneNumber', label: 'Номер телефону для відправки', type: 'tel' },
    { name: 'contactPhoneNumber', label: 'Номер телефону для контакту', type: 'tel' },
    { name: 'email', label: 'Емейл', type: 'email' },
    { name: 'activePrice', label: 'Активна валюта', type: 'text' },
    { name: 'userCountry', label: 'Країна', type: 'text' },
    { name: 'orderItems', label: 'Елементи замовлення', type: 'text' },
    { name: 'orderComeFrom', label: 'Звідки замовлення', type: 'text' },
    { name: 'userNickname', label: 'Нік-нейм юзера', type: 'text' },
    { name: 'isCatExist', label: 'Є котик', type: 'checkbox' },
    { name: 'price', label: 'Ціна', type: 'text' },
    { name: 'shipPrice', label: 'Податок на доставку', type: 'text' },
    { name: 'totalWeight', label: 'Вага', type: 'text' },
  ];

  const renderFields = ({ name, label, type }: (typeof inputFields)[0]) => {
    const formikName = name as keyof OrderTypeWithoutExtraFields;
    const val = formik.values[formikName];
    const touched = formik.touched[formikName];
    const error = formik.errors[formikName];

    switch (name) {
      case 'isCatExist':
        return (
          <FormControl
            mt={5}
            key={name}
            display="flex"
            alignItems="center"
            style={{ marginRight: 'auto' }}
          >
            <Checkbox
              type="checkbox"
              name="isCatExist"
              isChecked={includeCatPic}
              onChange={() => setIncludeCatPic(!includeCatPic)}
              mr={2}
            />
            <Text>Має кицю</Text>
            {includeCatPic && (
              <FormControl>
                <FileUploader
                  name={'catPic'}
                  type="file"
                  ref={fileRef}
                  setFieldValue={formik.setFieldValue}
                />
                {formik.touched.catExistConfirmPicUrl && formik.errors.catExistConfirmPicUrl && (
                  <div className="error">{formik.errors.catExistConfirmPicUrl}</div>
                )}
              </FormControl>
            )}
          </FormControl>
        );
      case 'orderNumber':
        return (
          <FormControl mt={5} key={name}>
            <Flex
              flexDirection={['column', 'column', 'column', 'row']}
              gap={2}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Input
                maxWidth={350}
                className="form__orderNumber"
                type={type}
                name={name}
                placeholder={label}
                onChange={onHandleChange}
                value={val as string}
                onBlur={formik.handleBlur}
              />
              <Button fontSize={'xs'} paddingLeft={2} onClick={generateEightDigitDecimal}>
                Генерувати номер
              </Button>
            </Flex>
            {touched && error && (
              <div style={{ color: 'red', marginTop: 5 }} className="error">
                {formik.errors[formikName]}
              </div>
            )}
          </FormControl>
        );
      case 'price':
        return (
          <Text borderBottom="1px" borderColor="black" mt={5} key={name}>
            {' '}
            Ціна {val}
          </Text>
        );
      case 'totalPrice':
        return (
          <Text borderBottom="1px" borderColor="black" mt={5} key={name}>
            {' '}
            Ціна з податком {val}
          </Text>
        );
      case 'totalWeight':
        return (
          <Text borderBottom="1px" borderColor="black" mt={5} key={name}>
            {' '}
            Вага {val}
          </Text>
        );
      case 'shipPrice':
        return (
          <Text borderBottom="1px" borderColor="black" mt={5} key={name}>
            {' '}
            Податок на доставку{' '}
            <span style={{ color: 'red' }}>
              {' '}
              {val === 0 ? 'Нема податку' : `${val} ${formik.values.activePrice}`}
            </span>
          </Text>
        );

      case 'userCountry':
        return (
          <FormControl mt={5} key={name}>
            <CountrySelector
              onSelect={onSelectCountry}
              selected={selectedCountry}
              onSelectFeeIndex={setSelectedFee}
            />
            {touched && error && (
              <div style={{ color: 'red', marginTop: 5 }} className="error">
                {error}
              </div>
            )}
          </FormControl>
        );
      case 'activePrice':
        return (
          <React.Fragment key={name}>
            <CurrencySwitcher onChange={handleCurrencyChange} />
          </React.Fragment>
        );
      case 'orderComeFrom':
        return (
          <FormControl mt={5} key={name}>
            <OrderComeFromRadio
              orderComeFrom={formik.values.orderComeFrom || 'telegram'}
              onOrderComeFromChange={handleOrderComeFromChange}
            />
            {touched && error && (
              <div style={{ color: 'red', marginTop: 5 }} className="error">
                {error}
              </div>
            )}
          </FormControl>
        );
      case 'orderItems':
        return (
          <FormControl mt={5} key={name}>
            <TotalWeightFromProductMemoized
              condition={!!formik.values.userCountry}
              activePrice={formik.values.activePrice}
              activeCountry={Countries.Austria}
              setData={(data) => handleTransformData(data)}
              name={name as keyof ProductType}
              type="cart"
              label={label}
              productItems={productItems}
            />
            {touched && error && (
              <div style={{ color: 'red', marginTop: 5 }} className="error">
                {error}
              </div>
            )}
          </FormControl>
        );
      default:
        return (
          <FormControl mt={5} key={name}>
            <Input
              className="form__street"
              type={type}
              name={name}
              placeholder={label}
              onChange={onHandleChange}
              value={formik.values[formikName] as string}
              onBlur={formik.handleBlur}
            />
            {touched && error && (
              <div style={{ color: 'red', marginTop: 5 }} className="error">
                {error}
              </div>
            )}
          </FormControl>
        );
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form">
        {inputFields.slice(0, 4).map(renderFields)}
        <Select
          disabled={formik.values.addressPack !== '' || formik.values.userAddress !== ''}
          value={selectedAddress}
          onChange={(e) => onSelectChange(e)}
          className="select"
          marginY={5}
        >
          <option value="pack">Пачкомат</option>
          <option value="user">По місту</option>
          <option value="bielsko">Безкоштовна доставка по м. Белсько-Бяла</option>
        </Select>
        {selectedAddress === 'pack' && (
          <>
            <Input
              className="form__street"
              type="text"
              name="addressPack"
              onChange={onHandleChange}
              value={formik.values.addressPack}
              placeholder="Точна адреса пачкомату"
              onBlur={formik.handleBlur}
            />
            {formik.touched.addressPack && formik.errors.addressPack && (
              <div style={{ color: 'red', marginTop: 5 }} className="error">
                {formik.errors.addressPack}
              </div>
            )}
          </>
        )}
        {(selectedAddress === 'user' || selectedAddress === 'bielsko') && (
          <>
            <Input
              className="form__street"
              type="text"
              name="userAddress"
              onChange={onHandleChange}
              value={formik.values.userAddress}
              placeholder="Адреса користувача"
              onBlur={formik.handleBlur}
            />
            {formik.touched.userAddress && (
              <div style={{ color: 'red', marginTop: 5 }} className="error">
                {formik.errors.userAddress}
              </div>
            )}
          </>
        )}
        {inputFields.slice(4).map(renderFields)}
      </div>
      <Button isLoading={isLoading} mt={7} onClick={() => formik.handleSubmit()}>
        Додати замовлення
      </Button>
    </div>
  );
};

export default OrderAddForm;
