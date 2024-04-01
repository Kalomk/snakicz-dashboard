'use client';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Tabs,
  Text,
  TabPanels,
  TabPanel,
  TabList,
  Tab,
  TabIndicator,
  useColorMode,
  Switch,
} from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';

const DasboardLayout = ({ children }: { children: React.ReactNode }) => {
  const filterType = [
    { label: 'products', name: 'товари' },
    { label: 'users', name: 'клієнти' },
    { label: 'orders', name: 'замовлення' },
    { label: 'analitics', name: 'аналітика' },
  ];

  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const router = useRouter();
  const pathname = usePathname();
  const currentEndpoint = pathname.split('/')[2];

  //find index
  const currentIndex = filterType.findIndex((item) => item.label === currentEndpoint);

  return (
    <Box>
      <Card color="black">
        <Box m={3}>
          <Text>Включити нічний режим</Text>
          <Switch color="green" isChecked={isDark} onChange={toggleColorMode} />
        </Box>

        <Box>
          <Tabs defaultIndex={currentIndex} position="relative" variant="unstyled">
            <TabList>
              {filterType.map((item) => {
                if (item.label === 'analitics') {
                  return (
                    <Tab onClick={() => router.push(`/${item.label}`)} key={item.name}>
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </Tab>
                  );
                }
                return (
                  <Tab onClick={() => router.push(`/dashboard/${item.label}`)} key={item.name}>
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </Tab>
                );
              })}
            </TabList>
            <TabIndicator mt="-1.5px" height="2px" bg="blue.500" borderRadius="1px" />
            <TabPanels>
              {filterType.map((item) => (
                <TabPanel key={item.label}>
                  <Box maxH={['87vh', '85vh', '80vh']} overflow={'scroll'}>
                    {children}
                  </Box>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </Card>
    </Box>
  );
};

export default DasboardLayout;
