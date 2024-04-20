import React from 'react';
import { Box, Flex, Image, Text, Badge, Button, useDisclosure } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import { UserDataTypes } from 'snakicz-types';
import { CustomComponentProps } from '../../../../mainTypes';
import { Icons } from '@/entities/icons';
import { ModalComponent } from '@/components/modal';
import { Users } from '@/api/users';

const UserComponent: React.FC<CustomComponentProps<UserDataTypes>> = ({ data }) => {
  const { phoneNumber, ordersCount, isFirstTimeBuy, uniqueId } = data;
  const renderDeleteModal = () => {
    return (
      <ModalComponent onClose={onCloseModalDelete} isOpen={isModalOpenDelete}>
        <Flex p={10} flexDirection={'column'} alignContent={'center'} justifyContent={'center'}>
          <Box textAlign={'center'}>
            <Text fontSize={20}>Видалити юзера?</Text>
          </Box>
          <Button mt={5} onClick={onCloseModalDelete}>
            Ні, не видаляти
          </Button>
          <Button
            mt={6}
            colorScheme="red"
            onClick={async () => {
              try {
                Users.deleteUser(uniqueId);
              } catch (e) {
                console.log(e);
              } finally {
                onCloseModalDelete();
                window.location.reload();
              }
            }}
          >
            Так, видалити
          </Button>
        </Flex>
      </ModalComponent>
    );
  };
  const {
    isOpen: isModalOpenDelete,
    onClose: onCloseModalDelete,
    onOpen: onOpenModalDelete,
  } = useDisclosure();

  const IconDelete = Icons.delete;
  return (
    <Box whiteSpace={'normal'} p={4} maxWidth={'360px'} borderWidth="1px" borderRadius="lg">
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Button colorScheme="red" width={'30px'} onClick={onOpenModalDelete}>
          <IconDelete />
        </Button>
        <Avatar />
      </Flex>
      <Flex align="center">
        <Box>
          <Text fontWeight="bold">{`Номер телефону: ${phoneNumber}`}</Text>
          <Text>{`Кількіть замовлень: ${ordersCount}`}</Text>
          <Badge colorScheme={isFirstTimeBuy ? 'green' : 'gray'}>
            {isFirstTimeBuy ? 'Купує вперше' : 'Вже купував'}
          </Badge>
        </Box>
      </Flex>
      {renderDeleteModal()}
    </Box>
  );
};

export default UserComponent;
