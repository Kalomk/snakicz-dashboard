import React, { useState } from 'react';
import { Box, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { ActualPriceType } from 'snakicz-types';

export const CurrencySwitcher = ({ onChange }: { onChange: (arg: any) => void }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<ActualPriceType>('zł');

  const handleCurrencyChange = (value: ActualPriceType) => {
    setSelectedCurrency(value);
    onChange(value);
  };

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Активна валюта:
      </Text>
      <RadioGroup value={selectedCurrency} onChange={handleCurrencyChange} mb={4}>
        <Stack direction={'row'}>
          <Radio size="lg" value="zł">
            zł
          </Radio>
          <Radio size="lg" value="€">
            €
          </Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
};
