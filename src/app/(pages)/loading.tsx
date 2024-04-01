import logo from '/public/snakicz-logo.png';
import Image from 'next/image';
import { Box, Flex } from '@chakra-ui/react';

const Loader = () => {
  return (
    <Flex minWidth="max-content" alignItems="center">
      <Box m={'auto'} className="animate-pulse">
        <Image
          src={logo}
          alt="logo"
          width={140}
          height={140}
          style={{
            filter:
              'invert(28%) sepia(3%) saturate(300%) hue-rotate(110deg) brightness(80%) contrast(10%)',
          }}
        />
      </Box>
    </Flex>
  );
};

export default Loader;
