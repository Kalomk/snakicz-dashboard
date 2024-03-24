'use client';

import { Grid, GridItem } from '@chakra-ui/react';

const RenderList = async ({
  dataComponent,
  formComponent,
}: {
  dataComponent: JSX.Element;
  formComponent: JSX.Element;
}) => {
  return (
    <Grid templateColumns={[null, null, null, '62% 38%']} gap={4}>
      <GridItem order={[2, 2, 2, 0, 0]} colSpan={1}>
        {dataComponent}
      </GridItem>
      <GridItem colSpan={1}>{formComponent}</GridItem>
    </Grid>
  );
};

export default RenderList;
