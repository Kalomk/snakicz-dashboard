import { Auth } from '@/components/auth';
import { Box, Flex } from '@chakra-ui/react';

const AuthPage = () => {
  return (
    <Flex mt={50} justifyContent={'center'} alignContent={'center'}>
      <Auth />
    </Flex>
  );
};

export default AuthPage;
