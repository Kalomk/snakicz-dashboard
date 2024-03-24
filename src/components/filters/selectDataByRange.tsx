import React, { useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { OrderType, ProductType, UserDataTypes } from 'snakicz-types';
import { isOrder, isUser } from '.';

const DateRangeComponent: React.FC<{
  getDataByDateRange(startDate: string, endDate: string): Promise<OrderType[] | UserDataTypes[]>;
  setData: React.Dispatch<React.SetStateAction<OrderType[] | UserDataTypes[] | ProductType[]>>;
  data: OrderType[] | UserDataTypes[] | ProductType[];
}> = ({ getDataByDateRange, setData, data }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFetchData = async () => {
    const fetchedData = await getDataByDateRange(startDate, endDate);
    if (isUser(data[0]) || isUser(fetchedData[0])) {
      setData(fetchedData);
    } else if (isOrder(data[0]) || isOrder(fetchedData[0])) {
      setData(fetchedData);
    }
  };

  return (
    <Box whiteSpace={'normal'}>
      <Flex
        flexDirection={['column', 'column', 'column', 'row']}
        justifyContent="center"
        alignItems={'center'}
        mt={8}
      >
        <Stack spacing={3} direction={['column', 'column', 'column', 'row']}>
          <FormControl>
            <FormLabel>З якого числа:</FormLabel>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>По яке число:</FormLabel>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </FormControl>
        </Stack>
        <Button
          colorScheme="blue"
          mt={7}
          ml={4}
          onClick={() => {
            handleFetchData();
          }}
        >
          Знайти
        </Button>
      </Flex>
    </Box>
  );
};

export default DateRangeComponent;
