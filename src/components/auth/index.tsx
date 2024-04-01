'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import axios from '../../core/axios'; // You may need to install axios if you haven't already
import Cookies from 'js-cookie'; // Import Cookies

const Login = () => {
  const [credentials, setCredentials] = useState({ uniqueId: '', password: '' });
  const toast = useToast();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', credentials);
      const token = response.data.token; // Assuming token is returned in the response
      console.log('Token:', token);
      toast({
        title: 'Успішний вхід',
        description: 'Успіх!',
        position: 'top-right',
        status: 'success',
      });
      // Save token in cookies
      Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
      location.href = '/dashboard/products';

      console.log('Token saved in cookies.');
    } catch (error) {
      toast({
        title: 'Неуспішний вхід',
        description: `Провал`,
        position: 'top-right',
        status: 'error',
      });
      console.error('Login error:', error); // Handle login error
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Stack spacing={3}>
        <FormControl id="uniqueId">
          <FormLabel>Unique ID</FormLabel>
          <Input type="text" name="uniqueId" value={credentials.uniqueId} onChange={handleChange} />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </FormControl>
        <Button colorScheme="teal" onClick={handleLogin}>
          Війти
        </Button>
      </Stack>
    </Box>
  );
};

const Register = () => {
  const [userData, setUserData] = useState({
    uniqueId: '',
    password: '',
    phoneNumber: '',
    secretKey: '',
  });

  const toast = useToast();
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    try {
      const token = (await axios.post('/register', userData)).data.token;
      // Save token in cookies
      toast({
        title: 'Успішний вхід',
        description: 'Успіх!',
        position: 'top-right',
        status: 'success',
      });
      Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
      location.href = '/dashboard/products';
      console.log(token); // Handle successful registration response
    } catch (error) {
      toast({
        title: 'Неуспішний вхід',
        description: `Провал`,
        position: 'top-right',
        status: 'error',
      });
      console.error('Registration error:', error); // Handle registration error
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Stack spacing={3}>
        <FormControl id="uniqueId">
          <FormLabel>Unique ID</FormLabel>
          <Input type="text" name="uniqueId" value={userData.uniqueId} onChange={handleChange} />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="secretPassword">
          <FormLabel>SecretPassword</FormLabel>
          <Input type="text" name="secretKey" value={userData.secretKey} onChange={handleChange} />
        </FormControl>
        <FormControl id="secretPassword">
          <FormLabel>PhoneNumber</FormLabel>
          <Input
            type="text"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
          />
        </FormControl>
        <Button colorScheme="teal" onClick={handleRegister}>
          Зареєструватись
        </Button>
      </Stack>
    </Box>
  );
};

const Auth = () => {
  return (
    <Box>
      <Tabs position="relative" variant="unstyled">
        <TabList>
          {authTabs.map((item) => (
            <Tab>{item}</Tab>
          ))}
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="blue.500" borderRadius="1px" />
        <TabPanels>
          <TabPanel>
            <Login />
          </TabPanel>
          <TabPanel>
            <Register />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export { Login, Register, Auth };

const authTabs = ['login', 'register'];
