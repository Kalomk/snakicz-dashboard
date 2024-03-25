import axios from '../../core/axios';
import { Orders } from '../orders';

const webData = async (data: any) => {
  try {
    await axios.post(`/bot/webData`, data);
  } catch (error) {
    console.error('Error sending web data:', error);
  }
};

const confirmOrder = async (uniqueId: string) => {
  try {
    await axios.post(`/bot/confirmOrder`, { uniqueId });
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

const sendOrderConfirmation = async (data: any) => {
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
  orderId: string
) => {
  switch (op1) {
    case 'isConfirmationOrderSended':
      await confirmOrder(uniqueId);
      break;
    case 'isConfirmationPaymentSended':
      await paymentConfirm(uniqueId);
      break;
    case 'isPacNumberSended':
      // You need to provide orderNumber along with uniqueId for actualizeInfo
      throw new Error('Provide orderNumber for actualizeInfo');
    case 'isActualize':
      // You need to provide data along with sendOrderConfirmation
      throw new Error('Provide data for sendOrderConfirmation');
    default:
      throw new Error('Invalid operation');
  }

  const statusUpdated = await Orders.updateUserOrderStatusAxios(orderId, op1);

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
