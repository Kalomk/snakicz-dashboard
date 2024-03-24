import { Orders } from '@/api/orders';
import { Products } from '@/api/products';
import RenderList from '@/components/RenderList';
import FilteredData from '@/components/filters';
import OrderAddForm from '@/components/orders/ordersForm';

const OrderPage = async () => {
  const [orders, products] = await Promise.all([
    Orders.getOrders('1', '10'),
    Products.getAllProducts(),
  ]);
  return (
    <RenderList
      dataComponent={
        <FilteredData filterSchemaType={'orders'} dataToFilter={orders} productItems={products} />
      }
      formComponent={<OrderAddForm productItems={products} />}
    />
  );
};

export default OrderPage;
