import React from 'react';
import { Box, Flex, Image, Text, Badge } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import { UserDataTypes } from 'snakicz-types';
import { CustomComponentProps } from '../../../../mainTypes';

const UserComponent: React.FC<CustomComponentProps<UserDataTypes>> = ({ data }) => {
  const { phoneNumber, ordersCount, isFirstTimeBuy, createdAt } = data;
  console.log(data);
  return (
    <Box whiteSpace={'normal'} p={4} maxWidth={'360px'} borderWidth="1px" borderRadius="lg">
      <Avatar />
      <Flex align="center">
        <Box>
          <Text fontWeight="bold">{`Номер телефону: ${phoneNumber}`}</Text>
          <Text>{`Кількіть замовлень: ${ordersCount}`}</Text>
          <Badge colorScheme={isFirstTimeBuy ? 'green' : 'gray'}>
            {isFirstTimeBuy ? 'Купує вперше' : 'Вже купував'}
          </Badge>
        </Box>
      </Flex>
    </Box>
  );
};

export default UserComponent;
