'use client';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Card,
  Flex,
  Tabs,
  Text,
  TabPanels,
  TabPanel,
  TabList,
  Tab,
  TabIndicator,
  useColorMode,
  Switch,
  IconButton,
  Image,
  Button,
} from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import logo from '/public/snakicz-logo.png';

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

  //change display of mobile burger
  const [display, changeDisplay] = useState('none');

  //find index
  const currentIndex = filterType.findIndex((item) => item.label === currentEndpoint);

  return (
    <Box>
      <Card color="black">
        <Box display={['none', 'none', 'block', 'block']} m={3}>
          <Text>Включити нічний режим</Text>
          <Switch color="green" isChecked={isDark} onChange={toggleColorMode} />
        </Box>
        {/* Mobile */}
        <Box mb={75} display={['flex', 'flex', 'none', 'none']}>
          <Flex
            justifyContent={'space-between'}
            alignContent={'center'}
            pos={'fixed'}
            top={0}
            zIndex={10}
            left={0}
            bgColor={'black'}
            right={0}
          >
            <Box>
              <IconButton
                aria-label="Open Menu"
                size="lg"
                mb={3}
                variant={'ghost'}
                icon={<HamburgerIcon color={'white'} />}
                onClick={() => changeDisplay('flex')}
              />
            </Box>
            <Box>
              <Image mr={3} width={'50px'} height={'50px'} src={logo.src} alt="snakicz" />
            </Box>
          </Flex>
        </Box>

        {/* Mobile Content */}
        <Flex
          w="100vw"
          display={display}
          bgColor="gray.50"
          zIndex={20}
          h="100vh"
          pos="fixed"
          top="0"
          left="0"
          overflowY="auto"
          flexDir="column"
        >
          <Flex justify="flex-end">
            <IconButton
              mt={2}
              aria-label="Open Menu"
              size="lg"
              icon={<CloseIcon />}
              onClick={() => changeDisplay('none')}
            />
          </Flex>
          <Flex flexDir="column" align="center">
            {filterType.map((item) => (
              <Link
                href={item.label === 'analitics' ? `/${item.label}` : `/dashboard/${item.label}`}
                passHref
                onClick={() => changeDisplay('none')}
              >
                <Box my={5}> {item.name}</Box>
              </Link>
            ))}
          </Flex>
        </Flex>
        <Box display={['flex', 'flex', 'none', 'none']} overflow={'scroll'}>
          {children}
        </Box>
        {/* Desktop */}
        <Box display={['none', 'none', 'block', 'block']}>
          <Tabs defaultIndex={currentIndex} position="relative" variant="unstyled">
            <TabList>
              {filterType.map((item) => {
                return (
                  <Tab
                    onClick={() =>
                      router.push(
                        item.label === 'analitics' ? `/${item.label}` : `/dashboard/${item.label}`
                      )
                    }
                    key={item.name}
                  >
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
