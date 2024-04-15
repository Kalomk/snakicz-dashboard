'use client';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { useRef, useState } from 'react';
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
  useToast,
  Input,
} from '@chakra-ui/react';
import { OrderType, CartItem } from 'snakicz-types';
import { useDisclosure } from '@chakra-ui/react';
import { Icons } from '@/entities/icons';
import { Concat, CustomComponentProps } from '../../../../mainTypes';
import { Orders } from '@/api/orders';
import { BotAPI } from '@/api/bot';
import { ModalZoomedItem } from './zoomedModal';
import AudioPlayer from './audioComponent';
import { ModalComponent } from '@/components/modal';
import { Products } from '@/api/products';

const OrderComponent: React.FC<CustomComponentProps<OrderType>> = ({ data }) => {
  const {
    orderNumber,
    catExistConfirmPicUrl,
    paymentConfirmPicUrl,
    userAddress,
    userCity,
    userName,
    userCountry,
    userIndexCity,
    userLastName,
    phoneNumber,
    specialOcasionAudioUrl,
    orderComeFrom,
    op_isConfirmationPaymentSended,
    totalPrice,
    orderItems,
    totalWeight,
    activePrice,
    addressPack,
    freeDelivery,
    uniqueId,
  } = data;
  const orderItemsParsed =
    typeof orderItems === 'string'
      ? (JSON.parse(orderItems as unknown as string) as CartItem[])
      : orderItems;

  //open cart list
  const { isOpen, onToggle } = useDisclosure();
  const [orderStatus, setOrderStatus] = useState<OrderType>();
  const [postData, setPostData] = useState({ postService: '', postNumber: '' });
  const [postNumberSend, setPostNumberSend] = useState('');

  const ref = useRef<any>();
  const toast = useToast();

  //open modals funcs
  const {
    isOpen: isModalOpenCatPic,
    onClose: onCloseModalCatPic,
    onOpen: onOpenModalCatPic,
  } = useDisclosure();
  const {
    isOpen: isModalOpenPayment,
    onClose: onCloseModalPayment,
    onOpen: onOpenModalPayment,
  } = useDisclosure();

  const {
    isOpen: isModalOpenSendConfirmation,
    onClose: onCloseModalSendConfirmation,
    onOpen: onOpenModalSendConfirmation,
  } = useDisclosure();

  const {
    isOpen: isModalOpenSendConfirmationMail,
    onClose: onCloseModalSendConfirmationMail,
    onOpen: onOpenModalSendConfirmationMail,
  } = useDisclosure();
  const {
    isOpen: isModalOpenSendPostNumber,
    onClose: onCloseModalSendPostNumber,
    onOpen: onOpenModalSendPostNumber,
  } = useDisclosure();

  const {
    isOpen: isModalOpenAudio,
    onClose: onCloseModalAudio,
    onOpen: onOpenModalAudio,
  } = useDisclosure();
  const {
    isOpen: isModalOpenDelete,
    onClose: onCloseModalDelete,
    onOpen: onOpenModalDelete,
  } = useDisclosure();

  const operationLabelsBot = {
    isConfirmationOrderSended: (status: boolean) =>
      status ? 'Підтвержено' : 'Підтвердити замовлення',
    isConfirmationPaymentSended: (status: boolean) =>
      status ? 'Оплату підтвержено' : 'Підтвердити оплату',
    isPacNumberSended: (status: boolean) =>
      status ? 'Номер посилки надіслано' : 'Надіслати номер посилки',
    isActualize: (status: boolean) => (status ? 'Актуалізовано' : 'Актуалізувати замовлення'),
  };
  const operationLabelsOther = {
    isConfirmationPaymentSended: (status: boolean) =>
      status ? 'Відмічено як оплачений' : 'Відмітити як оплачений',
    isPacNumberSended: (status: boolean) =>
      status ? 'Код підтвердження на пошту вислано' : 'Надіслати код підтвердження на пошту',
  };

  const operationStatus = {
    isConfirmationOrderSended: 'Підтверження замовлення надіслано',
    isConfirmationPaymentSended: 'Підтвердження олати надіслано',
    isPacNumberSended: 'Номер замовлення надіслано',
    isActualize: 'Актуалізувано користувача',
  };

  const handleDeleteOrder = async (orderNumber: string, cartItems: CartItem[]) => {
    try {
      await Orders.deleteOrder(orderNumber);
      await Products.addQuantityOfProducts(cartItems);
    } catch (e) {
      console.log(e);
    } finally {
      window.location.reload();
    }
  };

  // Define a function to handle the button click
  const handleButtonClick = async (
    op1:
      | 'isConfirmationOrderSended'
      | 'isConfirmationPaymentSended'
      | 'isActualize'
      | 'isPacNumberSended',
    uniqueId: string,
    orderNumber: string,
    postNumber?: string,
    postService?: string,
    orderType?: 'bot' | 'other',
    email?: string
  ) => {
    try {
      // Call the performOperations function with the provided operations
      const statusPromiseObject = BotAPI.performOperations(
        op1,
        uniqueId,
        orderNumber,
        postNumber!,
        postService!,
        orderType,
        email
      );

      toast.promise(statusPromiseObject, {
        success: {
          title: 'Повідомлення надіслано',
          description: operationStatus[op1],
          position: 'top-right',
        },
        error: {
          title: 'Повідомлення відхилено',
          description: 'Помилка відправлення',
          position: 'top-right',
        },
        loading: {
          title: 'Відправляється повідомлення',
          description: 'Відправляється',
          position: 'top-right',
        },
      });

      const awaitedStatusObject = await statusPromiseObject;

      setOrderStatus(awaitedStatusObject);
    } catch (error) {
      console.error('Error performing operations:', error);
    }
  };
  //orders come from icons
  const Icon = Icons[orderComeFrom as keyof typeof Icons];

  //direction icons
  const IconForward = Icons.forward;
  const IconBackward = Icons.backward;
  const IconDelete = Icons.delete;
  const AudioPlay = Icons.play;

  const renderModalCat = () => {
    return (
      <>
        {catExistConfirmPicUrl !== '' && (
          <ModalZoomedItem
            fileUrl={catExistConfirmPicUrl!}
            isOpen={isModalOpenCatPic}
            onClose={onCloseModalCatPic}
          >
            <Image
              width={'95%'}
              height={'100%'}
              src={catExistConfirmPicUrl !== '' ? catExistConfirmPicUrl! : catPicThumbNail.src}
              alt="cat"
            />
          </ModalZoomedItem>
        )}
      </>
    );
  };

  const renderPaymentModal = () => {
    return (
      <>
        {paymentConfirmPicUrl !== '' && (
          <ModalZoomedItem
            fileUrl={paymentConfirmPicUrl!}
            isOpen={isModalOpenPayment}
            onClose={onCloseModalPayment}
          >
            <Image
              width={'95%'}
              height={'100%'}
              maxWidth={'300px'}
              maxHeight={'350px'}
              src={paymentConfirmPicUrl !== '' ? paymentConfirmPicUrl! : paymentPicThumbNail.src}
              alt="payment"
            />
          </ModalZoomedItem>
        )}
      </>
    );
  };

  const renderAudioModal = () => {
    return (
      <>
        <ModalZoomedItem
          fileUrl={specialOcasionAudioUrl!}
          isOpen={isModalOpenAudio}
          onClose={onCloseModalAudio}
        >
          <AudioPlayer src={specialOcasionAudioUrl!} />
        </ModalZoomedItem>
      </>
    );
  };
  const renderInputModal = () => {
    return (
      <ModalComponent onClose={onCloseModalSendConfirmation} isOpen={isModalOpenSendConfirmation}>
        <Flex p={4} flexDirection={'column'} alignContent={'center'} justifyContent={'center'}>
          <Input
            mt={10}
            value={postData.postService}
            onChange={(e) => setPostData((prev) => ({ ...prev, postService: e.target.value }))}
            placeholder="Сервіс відправки"
          />
          <Input
            mt={10}
            value={postData.postNumber}
            onChange={(e) => setPostData((prev) => ({ ...prev, postNumber: e.target.value }))}
            placeholder="Номер посилки"
          />
          <Button
            onClick={() =>
              handleButtonClick(
                'isPacNumberSended',
                uniqueId!,
                orderNumber,
                postData.postNumber,
                postData.postService
              )
            }
          >
            Відправити
          </Button>
        </Flex>
      </ModalComponent>
    );
  };

  const renderInputModalMail = () => {
    return (
      <ModalComponent
        onClose={onCloseModalSendConfirmationMail}
        isOpen={isModalOpenSendConfirmationMail}
      >
        <Flex flexDirection={'column'} alignContent={'center'} justifyContent={'center'}>
          <Input
            mt={10}
            value={postData.postService}
            onChange={(e) => setPostData((prev) => ({ ...prev, postService: e.target.value }))}
            placeholder="Сервіс відправки"
          />
          <Input
            mt={10}
            value={postData.postNumber}
            onChange={(e) => setPostData((prev) => ({ ...prev, postNumber: e.target.value }))}
            placeholder="Номер посилки"
          />
          <Button
            onClick={() =>
              handleButtonClick(
                'isPacNumberSended',
                uniqueId!,
                orderNumber,
                postData.postNumber,
                postData.postService,
                'other',
                data.email
              )
            }
          >
            Відправити
          </Button>
        </Flex>
      </ModalComponent>
    );
  };
  const renderInputModalPostNumber = () => {
    return (
      <ModalComponent onClose={onCloseModalSendPostNumber} isOpen={isModalOpenSendPostNumber}>
        <Flex flexDirection={'column'} alignContent={'center'} justifyContent={'center'}>
          <Input
            mt={10}
            value={postNumberSend}
            onChange={(e) => setPostNumberSend(e.target.value)}
            placeholder="Номер посилки"
          />
          <Button onClick={() => Orders.addASendNumberToOrder(orderNumber, postNumberSend)}>
            Відправити
          </Button>
        </Flex>
      </ModalComponent>
    );
  };

  const renderDeleteModal = () => {
    return (
      <ModalComponent onClose={onCloseModalDelete} isOpen={isModalOpenDelete}>
        <Flex p={10} flexDirection={'column'} alignContent={'center'} justifyContent={'center'}>
          <Box textAlign={'center'}>
            <Text fontSize={20}>Видалити замовлення?</Text>
          </Box>
          <Button mt={5} onClick={onCloseModalDelete}>
            Ні, не видаляти
          </Button>
          <Button
            mt={6}
            colorScheme="red"
            onClick={() => handleDeleteOrder(orderNumber, orderItemsParsed)}
          >
            Так, видалити
          </Button>
        </Flex>
      </ModalComponent>
    );
  };

  return (
    <Box p={1} borderWidth="0.4px" borderRadius="lg">
      {' '}
      <Flex
        flexDirection={['column', 'column', 'column', 'column', 'row']}
        justify="space-between"
        align="center"
      >
        <Text fontWeight="bold">{`Замовлення #${orderNumber}`}</Text>
        <Badge colorScheme={op_isConfirmationPaymentSended ? 'green' : 'red'}>
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
        <FrontSide style={{ minHeight: '420px' }}>
          <HStack justifyContent={'space-between'}>
            <Button colorScheme="red" width={'30px'} onClick={onOpenModalDelete}>
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
          {data.postSendNumber && (
            <Text>
              {`Номер відправки:`} <span color="red">{data.postSendNumber}</span>
            </Text>
          )}
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
                    <Text>
                      {item.title}{' '}
                      <Text as="span" color={'red'}>
                        {item.isDivided ? '(окремо)' : ''}
                      </Text>
                    </Text>
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
                    onClick={catExistConfirmPicUrl !== '' ? onOpenModalCatPic : undefined}
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
                    onClick={onOpenModalPayment}
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
              <Flex direction="column" align="center">
                <Button isDisabled={!specialOcasionAudioUrl} onClick={onOpenModalAudio}>
                  <AudioPlay />
                </Button>
              </Flex>
              <VStack marginTop={4}>
                {Object.entries(operationLabelsBot).map(([status, text]) => {
                  const s = `op_${status}` as Concat<['op_', keyof typeof operationLabelsBot]>;
                  const stats =
                    orderStatus && orderStatus[s] !== undefined ? orderStatus[s] : data[s];
                  return (
                    <Button
                      colorScheme={'green'}
                      variant={stats ? 'solid' : 'outline'}
                      onClick={
                        status === 'isPacNumberSended'
                          ? onOpenModalSendConfirmation
                          : () =>
                              handleButtonClick(
                                status as keyof typeof operationLabelsBot,
                                uniqueId!,
                                orderNumber
                              )
                      }
                    >
                      {text(stats!)}
                    </Button>
                  );
                })}
              </VStack>
            </Box>
          ) : (
            <Box mt={20}>
              <Flex
                mt={2}
                flexDirection={'column'}
                alignContent={'center'}
                justifyContent={'center'}
                gap={5}
              >
                {Object.entries(operationLabelsOther).map(([status, text]) => {
                  const s = `op_${status}` as Concat<['op_', keyof typeof operationLabelsOther]>;
                  const stats =
                    orderStatus && orderStatus[s] !== undefined ? orderStatus[s] : data[s];
                  return (
                    <Button
                      colorScheme={'green'}
                      variant={stats ? 'solid' : 'outline'}
                      onClick={
                        status === 'isPacNumberSended'
                          ? onOpenModalSendConfirmationMail
                          : () =>
                              handleButtonClick(
                                status as keyof typeof operationLabelsBot,
                                uniqueId!,
                                orderNumber,
                                undefined,
                                undefined,
                                'other'
                              )
                      }
                    >
                      {text(stats!)}
                    </Button>
                  );
                })}
              </Flex>
            </Box>
          )}
        </BackSide>
      </Flippy>
      {renderModalCat()}
      {renderPaymentModal()}
      {renderAudioModal()}
      {renderInputModal()}
      {renderDeleteModal()}
      {renderInputModalMail()}
    </Box>
  );
};

export default OrderComponent;
