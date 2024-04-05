import axios from '../../core/axios';
import { Orders } from '../orders';

interface SendOrderConfirmationI {
  uniqueId: string;
  orderNumber: string;
  postService: string;
  postNumber: string;
}

const webData = async (data: any) => {
  try {
    await axios.post(`/bot/webData`, data);
  } catch (error) {
    console.error('Error sending web data:', error);
  }
};

const confirmOrder = async (uniqueId: string, orderNumber: string) => {
  try {
    await axios.post(`/bot/confirmOrder`, { uniqueId, orderNumber });
  } catch (error) {
    console.error('Error confirming order:', error);
  }
};

const paymentConfirm = async (uniqueId: string) => {
  try {
    await axios.post(`/bot/paymentConfirm`, { uniqueId });
  } catch (error) {
    console.error('Error confirming payment:', error);
  }
};

const actualizeInfo = async (uniqueId: string, orderNumber: string) => {
  try {
    await axios.post(`/bot/actualizeInfo`, { uniqueId, orderNumber });
  } catch (error) {
    console.error('Error actualizing info:', error);
  }
};

const sendOrderConfirmation = async (data: SendOrderConfirmationI) => {
  try {
    await axios.post(`bot/sendOrderConfirmation`, data);
  } catch (error) {
    console.error('Error sending order confirmation:', error);
  }
};

const performOperations = async (
  op1:
    | 'isConfirmationOrderSended'
    | 'isConfirmationPaymentSended'
    | 'isPacNumberSended'
    | 'isActualize',
  uniqueId: string,
  orderNumber: string,
  postNumber: string,
  postService: string
) => {
  switch (op1) {
    case 'isConfirmationOrderSended':
      await confirmOrder(uniqueId, orderNumber);
      break;
    case 'isConfirmationPaymentSended':
      await paymentConfirm(uniqueId);
      break;
    case 'isPacNumberSended':
      // You need to provide orderNumber along with uniqueId for actualizeInfo
      sendOrderConfirmation({ uniqueId, orderNumber, postNumber, postService });
      break;
    case 'isActualize':
      // You need to provide data along with sendOrderConfirmation
      actualizeInfo(uniqueId, orderNumber);
      break;
    default:
      throw new Error('Invalid operation');
  }

  const statusUpdated = await Orders.updateUserOrderStatusAxios(orderNumber, op1);

  return statusUpdated;
};

export const BotAPI = {
  webData,
  confirmOrder,
  paymentConfirm,
  actualizeInfo,
  sendOrderConfirmation,
  performOperations,
};
