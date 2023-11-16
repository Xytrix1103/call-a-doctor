import { Box, Flex, Text, Popover, PopoverTrigger, PopoverContent, Divider, Avatar } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export const BarChart = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const data = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9'],
            datasets: [
                {
                    barPercentage: 0.5,
                    barThickness: 24,
                    maxBarThickness: 48, 
                    minBarLength: 2,
                    label: 'Sales',
                    data: [540, 325, 702, 620, 212, 980, 1200, 400, 800],
                    backgroundColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                      ],
                }
            ]
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <Box p={3} w='full'>
            <Chart type="bar" data={chartData} options={chartOptions} />
        </Box>
    )
}