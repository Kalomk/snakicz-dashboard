import { Products } from '@/api/products';
import RenderList from '@/components/RenderList';
import FilteredData from '@/components/filters';

import AddProductItemForm from '@/components/products/productForm';
import { filterSchemaProducts } from '@/schemas';

const ProductPage = async () => {
  const products = await Products.getAllProducts();

  return (
    <RenderList
      dataComponent={
        <FilteredData
          dataToFilter={products}
          productItems={products}
          filterSchemaType={'products'}
        />
      }
      formComponent={<AddProductItemForm productItems={products} />}
    />
  );
};

export default ProductPage;
