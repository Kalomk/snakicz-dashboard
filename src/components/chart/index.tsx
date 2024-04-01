'use client';

import React from 'react';
import { Box } from '@chakra-ui/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartDataI {
  labels: any;
  datasets: {
    label: string;
    data: any;
    fill: boolean;
    borderColor: string[];
    tension: number;
  }[];
}

const ChartComponent = (data: ChartDataI) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Pie data={data} />
    </Box>
  );
};

export default ChartComponent;
