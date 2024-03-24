import Api from '@/api';
import { Button, Select } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ProductType } from 'snakicz-types';

interface SelectTitlesProps {
  handleChangeTotalWeightFromProduct: (
    e: React.ChangeEvent<HTMLSelectElement>,
    name: string,
    type: 'key' | 'value'
  ) => void;
  name: string;
  productItems: ProductType[];
}

export const SelectTitles = ({
  handleChangeTotalWeightFromProduct,
  name,
  productItems,
}: SelectTitlesProps) => {
  return (
    <Select
      onChange={(e) => handleChangeTotalWeightFromProduct(e, name, 'key')}
      name={`twp-key-${name}`} // Unique name for each input
      defaultValue={name}
      placeholder={name}
    >
      <option value={name}>{name}</option>
      {productItems
        ?.filter((item) => item.category !== 3 && item.title !== name)
        .map((opt) => (
          <option value={opt.title}>{opt.title}</option>
        ))}
    </Select>
  );
};
