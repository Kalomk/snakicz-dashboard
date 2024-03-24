import { Button, FormControl, FormLabel, Textarea } from '@chakra-ui/react';
import { PostInput } from '.';
import { ProductType } from 'snakicz-types';
import { countSets } from '@/utils/countSets';

type DescFiledProps = PostInput & {
  handleChange: (e: React.ChangeEvent<any>) => void;
  setField: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  value: any;
  items: { [ttile: string]: number };
  productItems: ProductType[];
};

export const DescField = ({
  name,
  label,
  handleChange,
  value,
  items,
  productItems,
  setField,
}: DescFiledProps) => {
  const handleChangeDesc = () => {
    if (typeof items !== undefined && typeof items !== null) {
      const obj = Object.entries(items).map(([title, item]) => {
        const filteredItems = productItems.filter((p) => p.title === title);

        return filteredItems.map(
          (product, index, array) =>
            `${product.title} ${item} г${index !== array.length - 1 ? ',' : ''}`
        );
      });
      setField('description', obj.map((ar) => ar.join('')).join(','));
    }
  };

  return (
    <>
      <FormLabel>{label}</FormLabel>
      <Textarea
        size={'sm'}
        placeholder="Опис пишеться за кліком на кнопку"
        name={name as string}
        value={value}
        onChange={handleChange}
      />
      <Button marginTop={2} onClick={handleChangeDesc}>
        Створити опис
      </Button>
    </>
  );
};

export const CountSetsButton = ({
  productItems,
  items,
  setField,
}: Pick<DescFiledProps, 'productItems' | 'items' | 'setField'>) => {
  // Filter product items based on the keys present in the items object
  const filteredProductItems = productItems.filter((item) => {
    if (items !== undefined && items !== null) {
      return Object.keys(items).includes(item.title);
    }
  });

  //count the sets
  const handleCountSets = (arr: ProductType[], amount: { [title: string]: number }): number => {
    const setCount = countSets(arr, amount);
    setField('totalWeightProduct', setCount);

    return setCount;
  };
  return (
    <Button onClick={() => handleCountSets(filteredProductItems, items)} marginTop={2}>
      Порахувати сети
    </Button>
  );
};
