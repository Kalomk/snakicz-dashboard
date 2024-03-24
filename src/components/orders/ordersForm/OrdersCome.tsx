import {
  Radio,
  RadioGroup,
  Stack,
  Input,
  Button,
  useRadio,
  Box,
  HStack,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { Icons } from '@/entities/icons';

interface OrderComeFromRadioProps {
  orderComeFrom: string;
  onOrderComeFromChange: (value: string) => void;
}

const OrderComeFromRadio: React.FC<OrderComeFromRadioProps> = ({
  onOrderComeFromChange,
  orderComeFrom,
}) => {
  const options = [
    { value: 'telegram', label: 'Telegram' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tikTok', label: 'TikTok' },
    { value: 'fb', label: 'Facebook' },
    { value: 'web', label: 'Website' },
  ];

  return (
    <RadioGroup value={orderComeFrom} onChange={onOrderComeFromChange}>
      <Stack wrap={'wrap'} direction="row">
        {options.map((option) => {
          const Icon = Icons[option.value as keyof typeof Icons];
          return (
            <Button
              key={option.value}
              colorScheme="teal"
              variant={orderComeFrom === option.value ? 'solid' : 'outline'}
            >
              <Radio value={option.value}>
                <HStack spacing={2}>
                  <Icon />
                  <Text>{option.label}</Text>
                </HStack>
              </Radio>
            </Button>
          );
        })}
      </Stack>
    </RadioGroup>
  );
};

export default OrderComeFromRadio;
