import { Box, Flex, Text, Popover, PopoverTrigger, PopoverContent, Divider, Avatar } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export const DoughnutChart = ({ data, options, colors }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        setChartData(data);
        setChartOptions(options);

        if (colors) {
            const updatedData = {
                ...data,
                datasets: [
                    {
                        ...data.datasets[0],
                        backgroundColor: colors,
                        hoverBackgroundColor: colors.map(color => lightenDarkenColor(color, 20)), // Adjust hover color
                    },
                ],
            };
            setChartData(updatedData);
        }
    }, [data, options, colors]);

    const lightenDarkenColor = (col, amt) => {
        let usePound = false;

        if (col[0] === '#') {
            col = col.slice(1);
            usePound = true;
        }

        const num = parseInt(col, 16);

        let r = (num >> 16) + amt;

        if (r > 255) r = 255;
        else if (r < 0) r = 0;

        let b = ((num >> 8) & 0x00FF) + amt;

        if (b > 255) b = 255;
        else if (b < 0) b = 0;

        let g = (num & 0x0000FF) + amt;

        if (g > 255) g = 255;
        else if (g < 0) g = 0;

        return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
    };

    return (
        <Box p={3} w="full" display="flex" alignItems="center" justifyContent="center">
            <Chart type="doughnut" data={chartData} options={chartOptions} />
        </Box>
    );
};
