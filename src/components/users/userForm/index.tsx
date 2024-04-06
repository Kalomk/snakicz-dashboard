'use client';

import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
  Text,
} from '@chakra-ui/react';
import { UserDataTypes } from 'snakicz-types'; // Importing UserDataTypes interface
import { FormikUsers } from '@/formik/users';
import { Users } from '@/api/users';

const UserForm: React.FC = () => {
  const handleSubmit = async ({ phoneNumber, uniqueId }: UserDataTypes) => {
    await Users.createOrFindExistUser(phoneNumber, uniqueId); // Handle form submission here
  };

  return (
    <Box>
      <Text fontSize={40} fontWeight={'bold'} marginY={5}>
        Додати товар
      </Text>
      <Formik
        initialValues={FormikUsers.initialValues}
        validationSchema={FormikUsers.validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <Field name="uniqueId">
              {({ field, form }: { field: any; form: any }) => (
                <FormControl isInvalid={form.errors.uniqueId && form.touched.uniqueId}>
                  <FormLabel htmlFor="uniqueId">Унікальний ідентифікатор</FormLabel>
                  <Input {...field} id="uniqueId" placeholder="Введіть унікальний ідентифікатор" />
                  <FormErrorMessage>{form.errors.uniqueId}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="phoneNumber">
              {({ field, form }: { field: any; form: any }) => (
                <FormControl isInvalid={form.errors.phoneNumber && form.touched.phoneNumber}>
                  <FormLabel htmlFor="phoneNumber">Номер телефону</FormLabel>
                  <Input {...field} id="phoneNumber" placeholder="Введіть номер телефону" />
                  <FormErrorMessage>{form.errors.phoneNumber}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="isFirstTimeBuy">
              {({ field }: { field: any; form: any }) => (
                <FormControl>
                  <FormLabel htmlFor="isFirstTimeBuy">Перший раз покупає</FormLabel>
                  <input {...field} id="isFirstTimeBuy" type="checkbox" />
                </FormControl>
              )}
            </Field>
            <Field name="ordersCount">
              {({ field, form }: { field: any; form: any }) => (
                <FormControl isInvalid={form.errors.ordersCount && form.touched.ordersCount}>
                  <FormLabel htmlFor="ordersCount">Кількість замовлень</FormLabel>
                  <Input {...field} id="ordersCount" type="number" />
                  <FormErrorMessage>{form.errors.ordersCount}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button mt={4} colorScheme="teal" type="submit">
              Підтвердити
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default UserForm;
