import { CartItem, ProductType } from 'snakicz-types';
import { countSets } from './countSets';

type UpdatedWeightsType = (
  amounts: Record<string, number>,
  products: ProductType[],
  CartItems?: CartItem[]
) => ProductType[];

const filteredSets: UpdatedWeightsType = (amounts, products) => {
  return products.filter((p) => p.category && amounts[p.title] !== undefined);
};

const duplicateElementsWithWeights: UpdatedWeightsType = (amounts, arr) => {
  let result: any[] = [];

  arr.forEach((obj) => {
    const title = obj.title;
    const weight = amounts[title] || 1; // Default to 1 if no weight is provided

    result = result.concat(Array(weight).fill(obj));
  });

  return result;
};

const updateWeights: UpdatedWeightsType = (amounts, products, cartItems) => {
  return products.map((item) => {
    const { totalWeightProduct, totalBuyCount, ...rest } = item;
    const subtractedValue = amounts[rest.title] ?? 0;
    const updatedValue = totalWeightProduct - subtractedValue;

    let matchingCount = 0;

    // Iterate over the amounts array
    cartItems!.forEach((amount) => {
      // Check if the title includes the amount's title property
      if (rest.title.includes(amount.title)) {
        // Increment the matching count by the amount's count property
        matchingCount += amount.count;
      }
    });

    // Calculate the updated total buy count
    const updatedTotalBuyCount = totalBuyCount + matchingCount;

    return { ...rest, totalWeightProduct: updatedValue, totalBuyCount: updatedTotalBuyCount };
  });
};

export const updateProductWeightFromProductTotalWeight: UpdatedWeightsType = (
  amounts,
  products
) => {
  //init array data of old products
  let initialArr = [...products];

  //find sets from array
  const sets = filteredSets(amounts, products);

  //if sets exits replace their calculated data with old products
  if (sets.length > 0) {
    const dublicatedSets = duplicateElementsWithWeights(amounts, sets);
    initialArr = flattenSets(dublicatedSets, initialArr);
  }

  // calculate single products
  const updatedSingleWeights = updateWeights(amounts, initialArr);

  //update count of each sets
  const updatedSetsWeight = updatedSingleWeights.map((product, _, arr) => {
    const { totalProductWeightFromProducts, totalWeightProduct, ...rest } = product;

    if (product.category === 3 && Object.keys(totalProductWeightFromProducts).length > 0) {
      const filteredItems = arr.filter((p) =>
        Object.keys(totalProductWeightFromProducts).includes(p.title)
      );

      return {
        ...rest,
        totalProductWeightFromProducts,
        totalWeightProduct: countSets(filteredItems, totalProductWeightFromProducts),
      };
    }

    return product;
  });

  return updatedSetsWeight;
};

const flattenSets = (sets: ProductType[], products: ProductType[]): ProductType[] => {
  return sets.reduce(
    (flattened, set) => updateWeights(set.totalProductWeightFromProducts, flattened),
    products
  );
};

// Example usage:
// const updatedProducts = updateProductWeightFromProductTotalWeight(amounts, yourProductsArray);
