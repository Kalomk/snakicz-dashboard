import axios from '../../core/axios';
import { CartItem, ProductType } from 'snakicz-types';

const getAllProducts = async () => {
  return (await axios.get('/products/getProducts')).data as ProductType[];
};

const deleteProduct = async (id: number) => {
  return await axios.post(`products/deleteProduct`, { id });
};

const minusQuantityOfProducts = async (
  cartItems: CartItem[]
): Promise<
  | {
      productsWithZeroWeight: ProductType[];
      transaction?: undefined;
    }
  | {
      transaction: ProductType[];
      productsWithZeroWeight?: undefined;
    }
> => {
  return axios.post('/products/minusQuantityOfProduct', cartItems);
};

const addQuantityOfProducts = async (cartItems: CartItem[]) => {
  return axios.post('products/addQuantityOfProduct', cartItems);
};

const updateProduct = async (id: number, data: ProductType) => {
  return (await axios.put(`products/updateProduct`, { id, newData: { ...data } })).data;
};

const addNewProduct = async (newProduct: ProductType) => {
  return await axios.post('products/createANewProduct', { newProduct });
};

export const Products = {
  getAllProducts,
  deleteProduct,
  updateProduct,
  addNewProduct,
  addQuantityOfProducts,
  minusQuantityOfProducts,
};
