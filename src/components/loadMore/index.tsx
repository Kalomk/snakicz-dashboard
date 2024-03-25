import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Box, Spinner } from '@chakra-ui/react';
import { DataTypeArr, isOrder, isUser } from '../filters';
import { OrderType, UserDataTypes } from 'snakicz-types';

export function LoadMore({
  data,
  setData,
  getDataByPage,
}: {
  getDataByPage(page: string, pageSize?: string): Promise<OrderType[] | UserDataTypes[]>;

  data: DataTypeArr;
  setData: React.Dispatch<React.SetStateAction<DataTypeArr>>;
}) {
  const [page, setPage] = useState('2');
  const [isFullLoaded, setIsFullLoaded] = useState(false);

  const { ref, inView } = useInView();
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const loadMoreData = async () => {
    // Once the page 8 is reached, repeat the process all over again.
    await delay(2000);
    const nextPage = ((Number(page) % 7) + 1).toString();
    const newItems = (await getDataByPage(nextPage)) ?? [];

    if (newItems.length == 0) {
      return setIsFullLoaded(true);
    }

    if (isUser(newItems[0])) {
      setData([
        ...(data as unknown as UserDataTypes[]),
        ...(newItems as unknown as UserDataTypes[]),
      ]);
    } else if (isOrder(newItems[0])) {
      setData([...(data as unknown as OrderType[]), ...(newItems as unknown as OrderType[])]);
    }
    setPage(nextPage);
  };

  useEffect(() => {
    if (inView) {
      loadMoreData();
    }
  }, [inView]);

  return (
    <Box
      className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
      ref={ref}
    >
      {!isFullLoaded || data.length === 0 ? <Spinner /> : null}
    </Box>
  );
}
