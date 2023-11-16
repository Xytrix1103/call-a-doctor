import { Box, Flex, Text, Popover, PopoverTrigger, PopoverContent, Divider } from '@chakra-ui/react';
import { FaEarthAsia } from "react-icons/fa6";

const TimelineItem = ({ title, date, description }) => (
    <Flex mb={4}>
        <Box justifyContent='center' alignItems='center' mb={5}>
            <Box bgColor="blue.500" w="2px" h="40%" my={3} ml={'6px'}/>
            <FaEarthAsia size='15' color='blue'/>
            <Box bgColor="blue.500" w="2px" h="40%" my={3} ml={'6px'}/>
        </Box>
        <Box ml={5} mt={3} p={2} borderWidth="1px" borderRadius="md">
            <Text fontSize="lg" fontWeight="bold" mb={2}>
                {title}
            </Text>
            <Text color="gray.500" mb={2}>
                {date}
            </Text>
        </Box>
    </Flex>
);
  

const VerticalTimeline = ({ events }) => (
    <Flex direction="column">
        {events.map((event, index) => (
            <TimelineItem key={index} {...event} />
        ))}
    </Flex>
);

// Example usage
const events = [
    {
        title: 'Event 1',
        date: '2023-01-01',
        description: 'Description of event 1.',
    },
    {
        title: 'Event 2',
        date: '2023-02-01',
        description: 'Description of event 2.',
    },
    {
        title: 'Event 3',
        date: '2023-03-01',
        description: 'Description of event 3.',
    },
    {
        title: 'Event 4',
        date: '2023-03-01',
        description: 'Description of event 3.',
    },
    {
        title: 'Event 5',
        date: '2023-03-01',
        description: 'Description of event 3.',
    },
    {
        title: 'Event 4',
        date: '2023-03-01',
        description: 'Description of event 3.',
    },
    {
        title: 'Event 5',
        date: '2023-03-01',
        description: 'Description of event 3.',
    },
];

export const AppointmentTimelineChart = () => (
    <Box pt={1} px={4}>
        <VerticalTimeline events={events} />
    </Box>
);