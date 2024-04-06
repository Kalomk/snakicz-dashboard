import { PostInput } from '.';
import {
  Button,
  FormControl,
  FormLabel,
  Checkbox,
  VStack,
  Input,
  IconButton,
  Collapse,
  Box,
  ListItem,
  Text,
  Image,
  List,
  HStack,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';

import { useEffect, useState } from 'react';
import { ActualPriceType, CartItem, ProductType } from 'snakicz-types';
import { Countries } from '../../orders/ordersForm/CountrySelector';
import { filterSchemaProducts } from '@/schemas';

//types
type NewInputCheckBoxValueType = PostInput & CheckboxItemsProps;

type CartTypes =
  | {
      type: 'col';
      activeCountry?: Countries;
      activePrice?: ActualPriceType;
    }
  | {
      type: 'cart';
      activeCountry: Countries;
      activePrice: ActualPriceType;
    };

type TotalWrightFromProductProps = PostInput & {
  productItems: ProductType[];
  setData: (item: CartItem[]) => void;
  condition: boolean;
} & CartTypes;

interface CheckboxItemsProps {
  checkboxItems: string[];
  checkedItems: string[];
  handleCheckboxChange: (arg: string) => void;
  setCheckBoxItems: React.Dispatch<React.SetStateAction<string[]>>;
}

interface SetValueType {
  setValue: (newValue: string) => void;
}

//functions

class ProductTransformer {
  constructor(
    private activeCountry: Countries,
    private activePrice: 'zł' | '\u20AC',
    private currentWeight: number,
    private isDivided: boolean
  ) {}

  transformToCartItem(product: ProductType): CartItem {
    const { title, img: imageUrl, price, id } = product;

    return {
      title,
      imageUrl,
      price: price[this.activePrice][this.currentWeight],
      weight: this.currentWeight, // Assuming there is only one weight
      id: String(id),
      count: 1, // You can set the default count as needed
      activePrice: this.activePrice,
      activeCountry: this.activeCountry,
      isDivided: this.isDivided,
    };
  }
}

export const InputWeightCheckboxes = ({
  name,
  label,
  checkboxItems,
  checkedItems,
  handleCheckboxChange,
  setCheckBoxItems,
}: NewInputCheckBoxValueType) => {
  return (
    <FormControl mt={5} id={`${name}-id`}>
      <FormLabel>{label}</FormLabel>
      <VStack align="start" spacing={2}>
        {checkboxItems.map((item) => (
          <Checkbox
            key={item}
            isChecked={checkedItems.includes(item)}
            onChange={() => handleCheckboxChange(item)}
          >
            {item}
          </Checkbox>
        ))}
        <InputWeightList setValue={(newV) => setCheckBoxItems((prev) => [...prev, newV])} />
      </VStack>
    </FormControl>
  );
};

export const InputWeightList = ({ setValue }: SetValueType) => {
  const [isInputOpen, setIsInputOpen] = useState<boolean>(false);
  const [newInputValue, setNewInputValue] = useState<string>('');
  return (
    <VStack>
      {isInputOpen && (
        <HStack alignItems={'center'} justifyContent={'center'} spacing={2}>
          <FormControl mt={2} id={`newWeight-input-id`}>
            <FormLabel>Нова вага:</FormLabel>
            <Input
              type="number"
              placeholder=" "
              name={`newInputValue`}
              value={newInputValue}
              onChange={(e) => {
                e.preventDefault();
                const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                setNewInputValue(value);
              }}
            />
          </FormControl>
          <IconButton
            colorScheme="teal"
            aria-label="Call Segun"
            size="lg"
            onClick={() => {
              setValue(newInputValue);
              setIsInputOpen(false);
              setNewInputValue('');
            }}
            mt={9}
            icon={<SmallAddIcon />}
          />
        </HStack>
      )}

      <Button
        onClick={() => setIsInputOpen((prev) => !prev)}
        key={'addNewWeightBtn'}
        colorScheme={'gray'}
      >
        {!isInputOpen ? 'Додати вагу' : 'Сховати вагу'}
      </Button>
    </VStack>
  );
};

export const TotalWeightFromProduct = ({
  name,
  label,
  productItems,
  setData,
  condition,
  type = 'col',
  activeCountry = Countries.Poland,
  activePrice = 'zł',
}: TotalWrightFromProductProps) => {
  const [productWeightsMap, setProductWeightsMap] = useState<{ [title: string]: number[] }>({});
  const [products, setProducts] = useState<CartItem[]>([]);
  const { isOpen, onToggle } = useDisclosure();

  //clear array if active price or active country change
  useEffect(() => setProducts([]), [activePrice, activeCountry]);

  //filter or not the array of products
  const sortedItems = [...productItems]
    .sort((a, b) => {
      if (a.category === 3 && b.category !== 3) {
        return 1; // Move item with category 3 to the end
      } else if (a.category !== 3 && b.category === 3) {
        return -1; // Move item with category 3 to the end
      } else {
        return 0; // No change in relative order
      }
    })
    .filter((si) => si.isEnable !== false);
  const rightProductsArray =
    type === 'col' ? sortedItems.filter((item) => item.category !== 3) : sortedItems;

  //component functions

  const incrementOrDecrement = (type: 'dec' | 'inc', cartItem: CartItem) => {
    const newArray = [...products];

    //find index
    const existingItemIndex = newArray.findIndex(
      (obj) => obj.title === cartItem.title && obj.weight === cartItem.weight
    );

    if (existingItemIndex !== -1) {
      // inc or dec element count
      if (type === 'inc') {
        newArray[existingItemIndex].count++;
      } else if (type === 'dec' && newArray[existingItemIndex].count > 0) {
        newArray[existingItemIndex].count--;
      }
    } else {
      console.log('item not exist');
    }

    setProducts(newArray);
    setData(newArray);
  };

  const findCartItem = (title: string, weight: number) => {
    const foundedItem = products.find((item) => item.title === title && item.weight === weight);
    return foundedItem;
  };

  const handleSelectWeightChange = (
    selected: number,
    item: ProductType,
    isDivided: boolean = false
  ) => {
    //initialize object
    const cartItem = new ProductTransformer(
      activeCountry,
      activePrice,
      selected,
      isDivided
    ).transformToCartItem(item);

    const newArray = type === 'col' ? products.filter((p) => p.title !== item.title) : products;

    //find index
    const existingItemIndex = newArray.findIndex(
      (obj) => obj.title === item.title && obj.weight === selected
    );

    if (existingItemIndex !== -1) {
      // Remove existing item
      console.log(`${cartItem.title} not found`);

      newArray.splice(existingItemIndex, 1);
    } else {
      // Add new item
      newArray.push(cartItem);
    }
    setData(newArray);
    setProducts(newArray);
    return newArray;
  };
  const handleProductWeightChange = (title: string, items: number[], value: string) => {
    setProductWeightsMap((prevs) => ({
      ...prevs,
      [title]: [...items, Number(value)],
    }));
  };
  const checkIfSet = (category: number) => (category === 3 ? 'шт' : 'г');
  //calculate total subtracted values

  const calculateTotalSubtractedValues = (title: string, category: number) => {
    const findedItem = products.find((item) => item.title === title);
    if (findedItem) {
      const filteredDataByTtitle = products.filter((item) => item.title === title);

      const reducedValues = filteredDataByTtitle.reduce(
        (acc, val) => acc + val.weight * val.count,
        0
      );

      const reducedSetValues = filteredDataByTtitle.reduce((acc, val) => acc + val.count, 0);
      const rightReducedValues = category === 3 ? reducedSetValues : reducedValues;
      return {
        component: <Text color={'red'}>{`-${rightReducedValues} ${checkIfSet(category)}`}</Text>,
        rightReducedValues,
      };
    }

    return null;
  };

  //change isDivided property
  const onHandleChangeIsDivided = (value: boolean, cartItem: CartItem) => {
    const newArray = [...products];

    //find index
    const existingItemIndex = newArray.findIndex(
      (obj) => obj.title === cartItem.title && obj.weight === cartItem.weight
    );

    newArray[existingItemIndex].isDivided = value;

    setProducts(newArray);
    setData(newArray);
  };

  //cart picker

  // const CartItemPicker = () => {
  //   return (
  //     <Box>
  //       <Box>
  //         <HStack wrap={'wrap'}>
  //           {filterSchemaProducts.map((btn) => (
  //             <Button>{btn.name}</Button>
  //           ))}
  //         </HStack>
  //       </Box>
  //       {rightProductsArray.map((item) => {
  //         const rightWeight =
  //           productWeightsMap[item.title] != undefined
  //             ? productWeightsMap[item.title]
  //             : item.weight;

  //         const settedWeight = [...new Set(rightWeight)];
  //         const subValuesObj = calculateTotalSubtractedValues(item.title, item.category);
  //         return (
  //           <ListItem key={item.id} display="flex" alignItems="center">
  //             <Image src={item.img} alt={item.title} boxSize="50px" mr={4} />
  //             <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
  //               <Text marginBottom={2} fontWeight={'800'} textAlign={'center'}>
  //                 {item.title}
  //               </Text>
  //               <Flex gap={2} justifyContent={'center'} alignContent={'center'}>
  //                 <Text marginBottom={2} fontWeight={'500'} textAlign={'center'}>
  //                   {item.totalWeightProduct} {checkIfSet(item.category)}
  //                 </Text>
  //                 {subValuesObj && subValuesObj.component}
  //               </Flex>
  //               <Flex gap={2} flexWrap={'wrap'} justifyContent={'center'} alignContent={'center'}>
  //                 {settedWeight.map((w) => {
  //                   const selectedProduct = findCartItem(item.title, w);
  //                   const checkWeight = item.category === 3 ? 1 : w;
  //                   return (
  //                     <Flex
  //                       key={w}
  //                       alignItems={'center'}
  //                       justifyContent={'center'}
  //                       flexDirection={'column'}
  //                     >
  //                       <Button
  //                         isDisabled={
  //                           selectedProduct?.weight !== checkWeight && subValuesObj
  //                             ? item.totalWeightProduct < subValuesObj.rightReducedValues ||
  //                               subValuesObj.rightReducedValues + checkWeight >
  //                                 item.totalWeightProduct
  //                             : false || item.totalWeightProduct < checkWeight
  //                         }
  //                         marginTop={2}
  //                         onClick={() => handleSelectWeightChange(w, item)}
  //                         colorScheme={selectedProduct?.weight === w ? 'teal' : 'gray'}
  //                       >
  //                         {w}
  //                       </Button>
  //                       <FormControl mt={2}>
  //                         <Flex justifyContent={'center'} alignContent={'center'}>
  //                           <FormLabel>Окремо?</FormLabel>
  //                           <Checkbox
  //                             isDisabled={!selectedProduct}
  //                             onChange={(e) =>
  //                               onHandleChangeIsDivided(e.target.checked, selectedProduct!)
  //                             }
  //                           />
  //                         </Flex>
  //                       </FormControl>
  //                       {type === 'cart' ? (
  //                         <VStack marginTop={4} align="center">
  //                           <HStack>
  //                             <Button
  //                               isDisabled={!selectedProduct || selectedProduct.count < 2}
  //                               size={'sm'}
  //                               onClick={() => incrementOrDecrement('dec', selectedProduct!)}
  //                             >
  //                               -
  //                             </Button>
  //                             <Text>{selectedProduct?.count ?? 0}</Text>
  //                             <Button
  //                               isDisabled={
  //                                 !selectedProduct ||
  //                                 (subValuesObj
  //                                   ? item.totalWeightProduct <=
  //                                     subValuesObj.rightReducedValues + checkWeight
  //                                   : false)
  //                               }
  //                               size={'sm'}
  //                               onClick={() => incrementOrDecrement('inc', selectedProduct!)}
  //                             >
  //                               +
  //                             </Button>
  //                           </HStack>
  //                         </VStack>
  //                       ) : null}
  //                     </Flex>
  //                   );
  //                 })}
  //               </Flex>
  //               <Box as="div" marginTop={2}>
  //                 <InputWeightList
  //                   setValue={(newV) => handleProductWeightChange(item.title, rightWeight, newV)}
  //                 />
  //               </Box>
  //             </Flex>
  //           </ListItem>
  //         );
  //       })}
  //     </Box>
  //   );
  // };

  return (
    <FormControl mt={5} id={`${name}-id`}>
      <FormLabel>{label}</FormLabel>
      {condition && (
        <Collapse in={isOpen} transition={{ exit: { delay: 1 }, enter: { duration: 0.5 } }}>
          <List marginBottom={4} spacing={3}>
            {!rightProductsArray ? (
              <div>Нема товарів</div>
            ) : (
              rightProductsArray.map((item) => {
                const rightWeight =
                  productWeightsMap[item.title] != undefined
                    ? productWeightsMap[item.title]
                    : item.weight;

                const settedWeight = [...new Set(rightWeight)];
                const subValuesObj = calculateTotalSubtractedValues(item.title, item.category);
                return (
                  <ListItem key={item.id} display="flex" alignItems="center">
                    <Image src={item.img} alt={item.title} boxSize="50px" mr={4} />
                    <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                      <Text marginBottom={2} fontWeight={'800'} textAlign={'center'}>
                        {item.title}
                      </Text>
                      <Flex gap={2} justifyContent={'center'} alignContent={'center'}>
                        <Text marginBottom={2} fontWeight={'500'} textAlign={'center'}>
                          {item.totalWeightProduct} {checkIfSet(item.category)}
                        </Text>
                        {subValuesObj && subValuesObj.component}
                      </Flex>
                      <Flex
                        gap={2}
                        flexWrap={'wrap'}
                        justifyContent={'center'}
                        alignContent={'center'}
                      >
                        {settedWeight.map((w) => {
                          const selectedProduct = findCartItem(item.title, w);
                          const checkWeight = item.category === 3 ? 1 : w;
                          return (
                            <Flex
                              key={w}
                              alignItems={'center'}
                              justifyContent={'center'}
                              flexDirection={'column'}
                            >
                              <Button
                                isDisabled={
                                  selectedProduct?.weight !== checkWeight && subValuesObj
                                    ? item.totalWeightProduct < subValuesObj.rightReducedValues ||
                                      subValuesObj.rightReducedValues + checkWeight >
                                        item.totalWeightProduct
                                    : false || item.totalWeightProduct < checkWeight
                                }
                                marginTop={2}
                                onClick={() => handleSelectWeightChange(w, item)}
                                colorScheme={selectedProduct?.weight === w ? 'teal' : 'gray'}
                              >
                                {w}
                              </Button>
                              <FormControl mt={2}>
                                <Flex justifyContent={'center'} alignContent={'center'}>
                                  <FormLabel>Окремо?</FormLabel>
                                  <Checkbox
                                    isDisabled={!selectedProduct}
                                    onChange={(e) =>
                                      onHandleChangeIsDivided(e.target.checked, selectedProduct!)
                                    }
                                  />
                                </Flex>
                              </FormControl>
                              {type === 'cart' ? (
                                <VStack marginTop={4} align="center">
                                  <HStack>
                                    <Button
                                      isDisabled={!selectedProduct || selectedProduct.count < 2}
                                      size={'sm'}
                                      onClick={() => incrementOrDecrement('dec', selectedProduct!)}
                                    >
                                      -
                                    </Button>
                                    <Text>{selectedProduct?.count ?? 0}</Text>
                                    <Button
                                      isDisabled={
                                        !selectedProduct ||
                                        (subValuesObj
                                          ? item.totalWeightProduct <=
                                            subValuesObj.rightReducedValues + checkWeight
                                          : false)
                                      }
                                      size={'sm'}
                                      onClick={() => incrementOrDecrement('inc', selectedProduct!)}
                                    >
                                      +
                                    </Button>
                                  </HStack>
                                </VStack>
                              ) : null}
                            </Flex>
                          );
                        })}
                      </Flex>
                      <Box as="div" marginTop={2}>
                        <InputWeightList
                          setValue={(newV) =>
                            handleProductWeightChange(item.title, rightWeight, newV)
                          }
                        />
                      </Box>
                    </Flex>
                  </ListItem>
                );
              })
            )}
          </List>
        </Collapse>
      )}
      <Button disabled={!condition} onClick={onToggle}>
        Список товарів
      </Button>
      {!condition && <Text color={'red'}>Заповніть всі інші поля</Text>}
    </FormControl>
  );
};
