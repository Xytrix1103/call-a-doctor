import { Box, Flex, Text, Popover, PopoverTrigger, PopoverContent, Divider, Avatar } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export const BarChart = ({ data, options }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        setChartData(data);
        setChartOptions(options);
    }, [data, options]);

    return (
        <Box p={3} w="full">
            <Chart type="bar" data={chartData} options={chartOptions} />
        </Box>
    );
};