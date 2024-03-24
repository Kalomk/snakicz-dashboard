'use client';

import React, { useState, ChangeEvent, useCallback, useRef } from 'react';
import { Box, Image, Text, Button, Input, HStack, Select, Textarea, Flex } from '@chakra-ui/react';
import { ProductType } from 'snakicz-types';
import { Products } from '@/api/products';
import { SelectTitles } from './SelectTitles';
import { calculatePriceInEuro } from '@/utils/calcEuro';
import { CustomComponentPropsWidthProductType } from '../../../../mainTypes';

// Type guard to check if the target element is a select element
function isSelectElement(target: EventTarget): target is HTMLSelectElement {
  return (target as HTMLElement).tagName === 'SELECT';
}

const ProductItem: React.FC<CustomComponentPropsWidthProductType<ProductType>> = ({
  data,
  productItems,
}) => {
  const {
    img,
    title,
    totalProductWeightFromProducts,
    totalWeightProduct,
    price,
    id,
    weight,
    isEnable,
    description,
    category,
  } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ProductType>({} as ProductType);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    setEditData({
      img,
      title,
      totalProductWeightFromProducts,
      totalWeightProduct,
      price,
      weight,
      isEnable,
      description,
      category,
    });
  }, [
    img,
    title,
    totalProductWeightFromProducts,
    totalWeightProduct,
    price,
    weight,
    isEnable,
    description,
    category,
  ]);

  const handleSendUpdatedInfoToServer = useCallback(async () => {
    const { price, ...rest } = editData;

    const updatedEuroPrices = Object.fromEntries(
      Object.entries(price.zł).map(([key, value]) => [key, calculatePriceInEuro(value)])
    );

    const ObjectToSend: ProductType = {
      ...rest,
      price: { zł: price.zł, '€': updatedEuroPrices },
    };

    try {
      await Products.updateProduct(id!, ObjectToSend);
    } catch (e) {
      console.log(e);
    } finally {
      window.location.reload();
    }
  }, [id, editData]);

  const isEditReturn = ({
    edited,
    stable,
  }: {
    edited: JSX.Element | string;
    stable: JSX.Element | string;
  }) => {
    return isEditing ? edited : stable;
  };

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (isSelectElement(e.target)) {
      // Handle select element
      setEditData((prev) => ({ ...prev, isEnable: value === 'В наявності' }));
    } else {
      // Handle input element
      if (name === 'weight' && index !== undefined) {
        setEditData((prev) => {
          const newInputValues = [...prev.weight]; // Create a copy of the inputValues array
          newInputValues[index] = Number(value); // Update the value at the specified index
          return { ...prev, [name]: newInputValues };
        });
      } else if (name === 'price' && index !== undefined) {
        setEditData((prev) => {
          const newInputValues = { ...prev.price['zł'] }; // Create a copy of the inputValues array
          const valueFromWeight = prev.weight[index];
          newInputValues[valueFromWeight] = Number(value); // Update the value at the specified index

          return { ...prev, [name]: { zł: newInputValues, '€': prev.price['€'] } };
        });
      } else if (name === 'totalWeightProduct') {
        setEditData((prev) => {
          return { ...prev, [name]: Number(value) };
        });
      } else {
        setEditData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Ви впевнені')) {
      try {
        await Products.deleteProduct(id);
      } catch (e) {
        console.log(e);
      } finally {
        window.location.reload();
      }
    }
  };

  const handleChangeTotalWeightFromProduct = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    identifier: string | number,
    type: 'key' | 'value'
  ) => {
    const newEditData = { ...editData }; // Create a shallow copy of the state

    if (type === 'key') {
      const updatedKeys = Object.fromEntries(
        Object.entries(newEditData.totalProductWeightFromProducts).map(([key, value]) =>
          key === identifier ? [e.target.value, value] : [key, value]
        )
      );

      newEditData.totalProductWeightFromProducts = updatedKeys;
    } else if (type === 'value') {
      newEditData.totalProductWeightFromProducts[identifier] = +e.target.value;
    }

    setEditData(newEditData);
  };
  return (
    <Flex
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      maxW="md"
    >
      <Image src={img} alt={title} />
      <Box
        mt={2}
        fontWeight="semibold"
        wordBreak={'break-all'}
        whiteSpace={'normal'}
        fontSize="lg"
        textAlign="center"
      >
        {isEditReturn({
          edited: (
            <Input
              value={editData[title as keyof ProductType] as string}
              onChange={(e) => handleChange(e)}
              name={'title'}
              defaultValue={title}
            />
          ),
          stable: title,
        })}
      </Box>

      {category === 3 && (
        <Box mt={2} wordBreak={'break-all'} color="gray.500" fontSize="sm" textAlign="center">
          {isEditReturn({
            edited: (
              <>
                {editData.totalProductWeightFromProducts &&
                  Object.keys(editData.totalProductWeightFromProducts).map((key) => {
                    const value = editData.totalProductWeightFromProducts[key];
                    return (
                      <HStack key={key + value} marginBottom={2}>
                        <SelectTitles
                          handleChangeTotalWeightFromProduct={handleChangeTotalWeightFromProduct}
                          productItems={productItems}
                          name={key}
                        />

                        <Input
                          onChange={(e) => handleChangeTotalWeightFromProduct(e, key, 'value')}
                          value={value}
                          name={`twp-val-${key}`} // Unique name for each input
                          defaultValue={value}
                        />
                      </HStack>
                    );
                  })}
              </>
            ),
            stable: '',
          })}
        </Box>
      )}
      {category === 3 && (
        <Box wordBreak={'break-all'} mt={2} color="gray.500" fontSize="sm" textAlign="center">
          {isEditReturn({
            edited: (
              <Textarea
                onChange={(e) => handleChange(e)}
                value={editData.description}
                name="description"
                defaultValue={description}
              />
            ),
            stable: <Text whiteSpace={'normal'}>{description!}</Text>,
          })}
        </Box>
      )}
      <Box wordBreak={'break-all'} mt={2} fontSize="lg" textAlign="center">
        {isEditReturn({
          edited: (
            <HStack>
              <Text wordBreak={'break-all'} fontSize={'sm'}>
                zł:
              </Text>
              <HStack fontSize={'small'}>
                {Object.values(price['zł']).map((w, i) => {
                  const prices = editData[price as unknown as keyof ProductType] as {
                    zł: { [key: string]: number };
                    '\u20AC': { [key: string]: number };
                  };
                  const priceValue = prices?.zł[weight[i]];
                  return (
                    <Flex
                      flexDirection={'column'}
                      alignContent={'center'}
                      justifyContent={'center'}
                      key={`price_${w}`}
                    >
                      <Text>{price['€'][weight[i]]}€</Text>
                      <Input
                        name="price"
                        value={priceValue}
                        onChange={(e) => handleChange(e, i)}
                        size={'sm'}
                        defaultValue={w}
                      />
                    </Flex>
                  );
                })}
              </HStack>
            </HStack>
          ),
          stable: (
            <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
              {' '}
              <Text>Ціни: {Object.values(price['zł']).join(' ,')} zł,</Text>
              <Text> {Object.values(price['€']).join(' ,')} €</Text>
            </Flex>
          ),
        })}
      </Box>
      <Box wordBreak={'break-all'} mt={2} fontSize="lg" textAlign="center">
        {isEditReturn({
          edited: (
            <HStack>
              <Text fontSize="sm" textAlign="center">
                кг:
              </Text>
              <HStack fontSize={'small'}>
                {weight.map((w, i) => {
                  const ws = editData?.weight && editData.weight[i];
                  return (
                    <Input
                      name="weight"
                      value={ws !== undefined ? ws : ''}
                      key={`weight_${i}-${w}`} // Use a stable key instead of Math.random()
                      onChange={(e) => handleChange(e, i)}
                      size={'sm'}
                      defaultValue={w}
                    />
                  );
                })}
              </HStack>
            </HStack>
          ),
          stable: (
            <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
              {' '}
              <Text>Доступні грамовки:</Text>
              <Text>{weight.join(' ,')}</Text>
            </Flex>
          ),
        })}
      </Box>
      <Box wordBreak={'break-all'} mt={2} fontSize="lg" textAlign="center">
        {isEditReturn({
          edited: (
            <Input
              value={editData.totalWeightProduct}
              name="totalWeightProduct"
              onChange={(e) => handleChange(e)}
              defaultValue={totalWeightProduct}
            />
          ),
          stable: ` Вага: ${totalWeightProduct} г`,
        })}
      </Box>
      <Box wordBreak={'break-all'} mt={2} fontSize="lg" textAlign="center">
        {isEditReturn({
          edited: (
            <Select
              onChange={(e) => handleChange(e)}
              placeholder={isEnable ? 'В наявності' : 'Нема в наявності'}
            >
              <option value={'В наявності'}>В наявності</option>
              <option value={'Нема в наявності'}>Нема в наявності</option>
            </Select>
          ),
          stable: `${isEnable ? 'В наявності' : 'Немає в наявності'}`,
        })}
      </Box>
      {isEditing ? (
        <>
          <Button mt={2} onClick={handleSendUpdatedInfoToServer}>
            Зберегти зміни
          </Button>
          <Button marginTop={2} onClick={() => setIsEditing(false)}>
            Відмінити
          </Button>
        </>
      ) : (
        <>
          <Button mt={2} onClick={handleEditClick}>
            Редагувати
          </Button>
          <Button colorScheme={'red'} marginTop={2} onClick={() => handleDeleteProduct(id!)}>
            Видалити
          </Button>
        </>
      )}
    </Flex>
  );
};

export default ProductItem;
