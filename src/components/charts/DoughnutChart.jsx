import { Box, Flex, Text, Popover, PopoverTrigger, PopoverContent, Divider, Avatar } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export const DoughnutChart = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'), 
                        documentStyle.getPropertyValue('--yellow-500'), 
                        documentStyle.getPropertyValue('--green-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'), 
                        documentStyle.getPropertyValue('--yellow-400'), 
                        documentStyle.getPropertyValue('--green-400')
                    ]
                }
            ]
        };
        const options = {
            cutout: '60%'
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <Box p={3} w='full' display='flex' alignItems='center' justifyContent='center'>
            <Chart type="doughnut" data={chartData} options={chartOptions}/>
        </Box>
    )
}