'use client';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { useRef } from 'react';
import catPicThumbNail from '/public/cat_thumbnail.webp';
import paymentPicThumbNail from '/public/payment_thumbnail.png';

import {
  Box,
  Text,
  Image,
  List,
  ListItem,
  Badge,
  Divider,
  Flex,
  Collapse,
  Button,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { OrderType, CartItem } from 'snakicz-types';
import { useDisclosure } from '@chakra-ui/react';
import { Icons } from '@/entities/icons';
import { CustomComponentProps } from '../../../../mainTypes';
import { Orders } from '@/api/orders';

const OrderComponent: React.FC<CustomComponentProps<OrderType>> = ({ data }) => {
  const {
    orderNumber,
    isCatExist,
    catExistConfirmPicUrl,
    paymentConfirmPicUrl,
    isStatisted,
    userAddress,
    userCity,
    userName,
    userCountry,
    userIndexCity,
    userLastName,
    phoneNumber,
    orderComeFrom,
    op_isActualize,
    op_isConfirmationOrderSended,
    op_isConfirmationPaymentSended,
    op_isPacNumberSended,
    totalPrice,
    orderItems,
    totalWeight,
    activePrice,
    addressPack,
    freeDelivery,
  } = data;
  const orderItemsParsed =
    typeof orderItems === 'string'
      ? (JSON.parse(orderItems as unknown as string) as CartItem[])
      : orderItems;
  const { isOpen, onToggle } = useDisclosure();
  const ref = useRef<any>();

  const handleDeleteOrder = async (orderNumber: string) => {
    if (window.confirm('Ви впевнені')) {
      try {
        await Orders.deleteOrder(orderNumber);
      } catch (e) {
        console.log(e);
      } finally {
        window.location.reload();
      }
    }
  };

  //orders come from icons
  const Icon = Icons[orderComeFrom as keyof typeof Icons];

  //direction icons
  const IconForward = Icons.forward;
  const IconBackward = Icons.backward;
  const IconDelete = Icons.delete;

  return (
    <Box whiteSpace={'normal'} p={4} borderWidth="1px" borderRadius="lg">
      {' '}
      <Flex
        flexDirection={['column', 'column', 'column', 'column', 'row']}
        justify="space-between"
        align="center"
      >
        <Text fontWeight="bold">{`Замовлення #${orderNumber}`}</Text>
        <Badge colorScheme={isStatisted ? 'green' : 'red'}>
          {op_isConfirmationPaymentSended ? 'Оплачено' : 'Не оплачено'}
        </Badge>
      </Flex>
      <Divider my={2} />
      <Flippy
        style={{ padding: 5, paddingBot: 3 }}
        flipOnHover={false} // default false
        flipOnClick={false} // default false
        flipDirection="horizontal" // horizontal or vertical
        ref={ref} // to use toggle method like ref.curret.toggle()
      >
        <FrontSide>
          <HStack justifyContent={'space-between'}>
            <Button colorScheme="red" width={'30px'} onClick={() => handleDeleteOrder(orderNumber)}>
              <IconDelete />
            </Button>
            <Button
              width={'30px'}
              onClick={() => {
                ref.current && ref.current.toggle();
              }}
            >
              <IconForward />
            </Button>
          </HStack>

          <Text>{`Клієнт: ${userName} ${userLastName}`}</Text>
          <Text>
            Звідки замовлення: <Icon />
          </Text>
          <Text>{`Контакт: ${phoneNumber}`}</Text>
          <Text>
            {userAddress === 'нема' || userAddress === ''
              ? `Адреса пачкомату: ${addressPack}`
              : `Адреса покупця: ${userAddress}`}{' '}
          </Text>
          <Text>{`Країна: ${userCountry}`}</Text>
          <Text>{`Місто: ${userCity}`}</Text>
          <Text>{`Індекс міста: ${userIndexCity}`}</Text>
          <Text>{`Загальна вага: ${totalWeight}г`}</Text>
          <Divider my={2} />
          <Button onClick={onToggle}>Список</Button>
          <Collapse in={isOpen} transition={{ exit: { delay: 1 }, enter: { duration: 0.5 } }}>
            <List spacing={3}>
              {orderItemsParsed.map((item) => (
                <ListItem
                  key={`${item.title}-${item.count}-${item.weight}`}
                  display="flex"
                  alignItems="center"
                >
                  <Image src={item.imageUrl} alt={item.title} boxSize="50px" mr={4} />
                  <Box>
                    <Text>{item.title}</Text>
                    <Text>{`${item.weight}г | ${item.price} ${item.activePrice}`}</Text>
                    <Text>{`Кількість: ${item.count}`}</Text>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Collapse>
          <Divider my={2} />
          <Flex justify="space-between">
            <Text fontWeight="bold">{`Загальна вартість: ${totalPrice} ${activePrice}`}</Text>
            <Badge
              maxW={[120, '100%', '100%']}
              fontSize={[7, null, null]}
              textAlign={'center'}
              colorScheme={freeDelivery ? 'green' : 'gray'}
            >
              <Text marginTop={'10px'}>
                {' '}
                {freeDelivery ? 'Безкоштовна доставка' : 'Платна доставка'}
              </Text>
            </Badge>
          </Flex>
        </FrontSide>
        <BackSide>
          <Button
            width={'30px'}
            onClick={() => {
              ref.current && ref.current.toggle();
            }}
          >
            <IconBackward />
          </Button>
          {orderComeFrom === 'telegram_bot' || orderComeFrom === 'web' ? (
            <Box>
              <HStack mt={2} justifyContent={'space-around'}>
                <Box>
                  <Image
                    width={'80px'}
                    height={'80px'}
                    src={
                      catExistConfirmPicUrl !== '' ? catExistConfirmPicUrl! : catPicThumbNail.src
                    }
                    alt="cat"
                  />
                  <Text color={catExistConfirmPicUrl !== '' ? 'green' : 'red'}>
                    {' '}
                    {catExistConfirmPicUrl !== '' ? 'є фото' : 'нема фото'}
                  </Text>
                </Box>
                <Box>
                  <Image
                    width={'80px'}
                    height={'80px'}
                    src={
                      paymentConfirmPicUrl !== '' ? paymentConfirmPicUrl! : paymentPicThumbNail.src
                    }
                    alt="payment"
                  />
                  <Text color={paymentConfirmPicUrl !== '' ? 'green' : 'red'}>
                    {' '}
                    {paymentConfirmPicUrl !== '' ? 'є фото' : 'нема фото'}
                  </Text>
                </Box>
              </HStack>
              <VStack marginTop={4}>
                <Button colorScheme="teal" variant={'outline'}>
                  {op_isConfirmationOrderSended ? 'Підтвержено' : 'Підтвердити замовлення'}
                </Button>
                <Button colorScheme="teal" variant={'outline'}>
                  {op_isConfirmationPaymentSended ? 'Оплату підтвержено' : 'Підтвердити оплату'}
                </Button>
                <Button colorScheme="teal" variant={'outline'}>
                  {op_isPacNumberSended ? 'Номер посилки надіслано' : 'Надіслати номер посилки'}
                </Button>
                <Button colorScheme="teal" variant={'outline'}>
                  {op_isActualize ? 'Актуалізовано' : 'Актуалізувати замовлення'}
                </Button>
              </VStack>
            </Box>
          ) : (
            <Box>hy</Box>
          )}
        </BackSide>
      </Flippy>
    </Box>
  );
};

export default OrderComponent;
