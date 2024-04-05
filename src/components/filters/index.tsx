'use client';
import {
  Tabs,
  TabPanels,
  TabPanel,
  TabList,
  Tab,
  Grid,
  Box,
  Text,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import { OrderType, UserDataTypes } from 'snakicz-types';
import { ProductType } from 'snakicz-types';
import ProductItem from '../products/ProductItem';
import UserComponent from '../users/UserItem';
import OrderComponent from '../orders/OrderItem';
import DateRangeComponent from './selectDataByRange';
import { Users } from '@/api/users';
import { useState } from 'react';
import { Orders } from '@/api/orders';
import { filterSchemaOrders, filterSchemaProducts, filterSchemaUsers } from '@/schemas';
import { LoadMore } from '../loadMore';
import { Icons } from '@/entities/icons';
import { ModalComponent } from '../modal';

//types
export type DataType = OrderType | UserDataTypes | (ProductType | undefined);
export type DataTypeArr = OrderType[] | UserDataTypes[] | ProductType[];

//types narrowing functions
export const isProduct = (item: DataType): item is ProductType => {
  return item ? (item as ProductType).title !== undefined : false;
};
export const isUser = (item: ProductType | UserDataTypes | OrderType): item is UserDataTypes => {
  return item ? (item as UserDataTypes).ordersCount !== undefined : false;
};
export const isOrder = (item: ProductType | UserDataTypes | OrderType): item is OrderType => {
  return item ? (item as OrderType).orderNumber !== undefined : false;
};

//schema checking obj

const schemas = {
  users: filterSchemaUsers,
  orders: filterSchemaOrders,
  products: filterSchemaProducts,
};

function FilteredData({
  filterSchemaType,
  dataToFilter,
  productItems,
}: {
  dataToFilter: DataTypeArr;
  filterSchemaType: 'orders' | 'users' | 'products';
  productItems?: ProductType[];
}) {
  const [data, setData] = useState(dataToFilter);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const CalendarMobile = Icons.calendar;
  const SerachMobile = Icons.search;

  const filteredArrays = schemas[filterSchemaType].map(({ filterFunc }) =>
    data.filter(filterFunc as (data: DataType) => boolean)
  );

  //render date range component

  const renderDateRange = () => {
    if (filterSchemaType === 'users') {
      return (
        <DateRangeComponent
          data={data}
          setData={setData}
          getDataByDateRange={Users.getUsersByDateRange}
        />
      );
    }
    if (filterSchemaType === 'orders') {
      return (
        <DateRangeComponent
          data={data}
          setData={setData}
          getDataByDateRange={Orders.getOrdersByDateRange}
        />
      );
    }

    return <></>;
  };

  //render load more component

  const renderLoadMore = () => {
    const fetchData = () => {
      if (filterSchemaType === 'users') {
        return Users.getUsers;
      } else if (filterSchemaType === 'orders') {
        return Orders.getOrders;
      }
    };

    const getData = fetchData();

    if (isUser(data[0]) || isOrder(data[0])) {
      return <LoadMore setData={setData} data={data} getDataByPage={getData!} />;
    }
  };

  const dataItems = schemas[filterSchemaType];

  return (
    <Tabs variant="enclosed" position="relative">
      <Box pos={'sticky'}>
        <TabList flexWrap={'wrap'}>
          {schemas[filterSchemaType].map((item) => (
            <Tab key={item.name}>{item.name}</Tab>
          ))}
        </TabList>
        {filterSchemaType === 'users' || filterSchemaType === 'orders' ? (
          <>
            <Box display={['none', 'none', 'none', 'none', 'block', 'block']}>
              {renderDateRange()}
            </Box>
            <Box
              display={['flex', 'flex', 'flex', 'flex', 'none', 'none']}
              justifyContent={'space-around'}
              mt={2}
              p={3}
            >
              <CalendarMobile size={22} onClick={onOpen} />
              <ModalComponent isOpen={isOpen} onClose={onClose}>
                {renderDateRange()}
              </ModalComponent>
              <SerachMobile size={22} />
            </Box>
          </>
        ) : null}
      </Box>

      <TabPanels>
        {data.length === 0 || dataItems.length === 0 ? (
          <Flex alignItems={'center'} justifyContent={'center'} mt={10}>
            <Text fontSize={25}>Нема даних</Text>
          </Flex>
        ) : (
          dataItems.map((item, index) => {
            const filteredArray = filteredArrays[index];
            return (
              <TabPanel key={item.name + '_panel'}>
                {filteredArray.length === 0 ? (
                  <Flex alignItems={'center'} justifyContent={'center'} mt={10}>
                    <Text fontSize={25}>Нема даних</Text>
                  </Flex>
                ) : (
                  <Box overflow={'scroll'} maxHeight={'1450px'}>
                    <Grid
                      templateColumns={['1fr', '1fr', '1fr', '1fr', 'repeat(2, 1fr)']}
                      gap={4}
                      mt={8}
                      mx="auto"
                      overflowX="auto" // Use overflowX to allow horizontal overflow
                      whiteSpace="nowrap" // Prevent wrapping of grid items
                    >
                      {filteredArray.map((item) => {
                        if (isProduct(item)) {
                          return (
                            <ProductItem
                              key={item.title}
                              data={item}
                              productItems={productItems ? productItems : []}
                            />
                          );
                        } else if (isUser(item)) {
                          return <UserComponent key={item.uniqueId} data={item} />;
                        } else if (isOrder(item)) {
                          return <OrderComponent key={item.orderNumber} data={item} />;
                        }
                      })}
                    </Grid>
                    {renderLoadMore()}
                  </Box>
                )}
              </TabPanel>
            );
          })
        )}
      </TabPanels>
    </Tabs>
  );
}

export default FilteredData;
