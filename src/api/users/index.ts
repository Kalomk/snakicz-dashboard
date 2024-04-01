import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import axios from '../../core/axios';
import { UserDataTypes } from 'snakicz-types';

const getUsers = async (page: string, pageSize: string = '10') => {
  return (
    await axios.get('/users/getUsers', {
      params: {
        page, // You can change this as needed
        pageSize, // You can change this as needed
      },
    })
  ).data as UserDataTypes[];
};
const deleteUser = async (uniqueId: string) => {
  return await axios.post(`/users/userDelete`, { uniqueId });
};

const getSensetiveData = async (token: string) => {
  return (
    await axios.get('/getMeAdmin', {
      headers: {
        Authorization: token,
      },
    })
  ).data;
};
const getUsersByDateRange = async (
  startDate: string,
  endDate: string
): Promise<UserDataTypes[]> => {
  try {
    const response = await axios.get('/users/getUsersByDateRange', {
      params: {
        startDate,
        endDate,
      },
    });
    return response.data as UserDataTypes[];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

const createOrFindExistUser = async (
  uniqueId: string,
  phoneNumber: string
): Promise<UserDataTypes> => {
  return (
    await axios.post('/users/createOrFindExistUser', {
      uniqueId,
      phoneNumber,
    })
  ).data;
};

export const Users = {
  deleteUser,
  getSensetiveData,
  createOrFindExistUser,
  getUsersByDateRange,
  getUsers,
};
