import axios from '../../core/axios';
import { OrderComeFromType, OrderType } from 'snakicz-types';

interface ChartComponentInterface {
  orderComeFrom: OrderComeFromType;
  _count: number;
}
const getOrders = async (page: string, pageSize: string = '10') => {
  return (
    await axios.get('/orders/getOrders', {
      params: {
        page, // You can change this as needed
        pageSize, // You can change this as needed
      },
    })
  ).data as OrderType[];
};

const getOrdersByDateRange = async (startDate: string, endDate: string): Promise<OrderType[]> => {
  try {
    const response = await axios.get('/orders/getOrdersByDateRange', {
      params: {
        startDate,
        endDate,
      },
    });
    return response.data as OrderType[];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

const deleteOrder = async (orderNumber: string) => {
  return await axios.post(`/orders/orderDelete/`, { orderNumber });
};

const createOrder = async (uniqueId: string, orderData: OrderType) => {
  return (await axios.post('/orders/createOrder', { uniqueId, orderData })).data as OrderType;
};

const getOrderCountsByType = async () => {
  return (await axios.get('/orders/getOrderCountsByType')).data as ChartComponentInterface[];
};

const updateUserOrderStatusAxios = async (orderNumber: string, status: string) => {
  try {
    const response = (await axios.post('/orders/updateUserOrderStatus', { orderNumber, status }))
      .data as OrderType;
    console.log('res');
    return response;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

export const Orders = {
  getOrders,
  updateUserOrderStatusAxios,
  deleteOrder,
  createOrder,
  getOrdersByDateRange,
  getOrderCountsByType,
};
