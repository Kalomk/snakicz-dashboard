import axios from '../../core/axios';
import { ProductType } from 'snakicz-types';

export const dynamic = 'force-dynamic';

const getAllProducts = async () => {
  return (await axios.get('/products/getProducts')).data as ProductType[];
};

const deleteProduct = async (id: number) => {
  return await axios.post(`products/deleteProduct`, { id });
};

const updateQuantityOfProducts = async (products: ProductType[]) => {
  return await axios.post('/products/changeQuantityOfProduct', { products });
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
  updateQuantityOfProducts,
};
