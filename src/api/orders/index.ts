import axios from '../../core/axios';
import { OrderType } from 'snakicz-types';

export const dynamic = 'force-dynamic';

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
  return await axios.post('/orders/createOrder', { uniqueId, orderData });
};
export const Orders = { getOrders, deleteOrder, createOrder, getOrdersByDateRange };
