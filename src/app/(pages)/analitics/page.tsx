import { Orders } from '@/api/orders';
import { Products } from '@/api/products';
import ChartComponent from '@/components/chart';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';

const AnaliticsPage = async () => {
  const ordersComeFrom = await Orders.getOrderCountsByType();
  const products = await Products.getAllProducts();
  const chartDataOrders = {
    labels: ordersComeFrom.map((item) => item.orderComeFrom),
    datasets: [
      {
        label: 'Звідки купують найчастіше',
        fill: false,
        tension: 0.1,
        data: ordersComeFrom.map((item) => item._count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  const chartDataProducts = {
    labels: products.map((item) => item.title),
    datasets: [
      {
        label: 'Звідки купують найчастіше',
        fill: false,
        tension: 0.1,
        data: products.map((item) => item.totalBuyCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Flex
      mt={50}
      justifyContent={'space-around'}
      flexDirection={['column', 'column', 'row', 'row']}
      alignItems={'center'}
    >
      <Box>
        <Box>
          <ul>
            {ordersComeFrom.map((item) => (
              <li>
                <HStack>
                  <Text fontSize={'larger'} fontWeight={600}>
                    {item.orderComeFrom}
                  </Text>
                  <Text>{item._count}</Text>
                </HStack>
              </li>
            ))}
          </ul>
        </Box>
        <Box mt={20}>
          <ul>
            {products.map((item) => (
              <li>
                <HStack>
                  <Text fontSize={'larger'} fontWeight={600}>
                    {item.title}
                  </Text>
                  <Text>{item.totalBuyCount}</Text>
                </HStack>
              </li>
            ))}
          </ul>
        </Box>
      </Box>
      <Box>
        <Box>
          <ChartComponent {...chartDataOrders} />
        </Box>
        <Box mt={15}>
          <ChartComponent {...chartDataProducts} />
        </Box>
      </Box>
    </Flex>
  );
};

export default AnaliticsPage;
