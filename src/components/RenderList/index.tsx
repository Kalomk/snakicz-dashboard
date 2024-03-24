'use client';

import {
  Box,
  Grid,
  GridItem,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
} from '@chakra-ui/react';

import { useRef } from 'react';

const RenderList = async ({
  dataComponent,
  formComponent,
}: {
  dataComponent: JSX.Element;
  formComponent: JSX.Element;
}) => {
  // const { colorMode, toggleColorMode } = useColorMode();
  // const isDark = colorMode === 'dark';
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();
  const btnRef = useRef(null);

  return (
    <Grid templateColumns={[null, null, null, '62% 38%']} gap={4}>
      <GridItem order={[2, 2, 2, 0, 0]} colSpan={1}>
        {dataComponent}
      </GridItem>
      {/* Mobile */}
      <Button
        aria-label="Open Menu"
        size="lg"
        m={4}
        ref={btnRef}
        onClick={onOpen}
        display={['flex', 'flex', 'none', 'none']}
      >
        Відкрити форму
      </Button>
      <GridItem colSpan={1}>
        {/* <Switch color="green" isChecked={isDark} onChange={toggleColorMode} /> */}
        <Drawer
          size={'full'}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton marginBottom={4} />
            <DrawerBody>{formComponent}</DrawerBody>
          </DrawerContent>
        </Drawer>
      </GridItem>
    </Grid>
  );
};

export default RenderList;
