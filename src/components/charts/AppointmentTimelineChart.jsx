import { Box, Flex, Text, Popover, PopoverTrigger, PopoverContent, Divider, Avatar } from '@chakra-ui/react';
import { FaEarthAsia } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";

const TimelineItem = ({ title, date, description }) => (
    <Flex mb={4}>
        <Box justifyContent='center' alignItems='center' mb={5}>
            <Box bgColor="blue.500" w="2px" h="40%" my={3} ml={'6px'}/>
            <FaEarthAsia size='15' color='blue'/>
            <Box bgColor="blue.500" w="2px" h="40%" my={3} ml={'6px'}/>
        </Box>
        <Box ml={5} mt={3} p={2} borderWidth="1px" borderRadius="md" w='90%'>
            <Flex alignItems='center' mb={1} gap={2} maxW='350px' >
                <Text fontSize="xs" color="gray.700">
                    {date}
                </Text>  
                <GoDotFill size='7' color='gray'/>
                <Text fontSize="xs" color="gray.700">
                    10:00 AM
                </Text>  
                <GoDotFill size='7' color='gray'/>
                <Text fontSize="xs" color="gray.700" maxW='150px' isTruncated>
                    Klinik Menara
                </Text>  
            </Flex>
            <Flex>
                <Avatar src="\src\assets\images\Default_User_Profile.png" size='sm' mt={1}/>
                <Box>
                    <Flex alignItems='center'>
                        <Box ml={2}>
                            <Text fontSize="sm" fontWeight="semibold" maxW='300px' isTruncated>
                                Doctor Name 
                            </Text>       
                            <Text fontSize='xs' fontWeight='medium' maxW='300px' isTruncated>
                                Cardiologist
                            </Text>        
                            <Divider my={1} w='290px' />
                            <Text fontSize='xs' fontWeight='medium' maxW='300px'>
                                Description  Description  Description  Description  Description  Description  Description  Description  Description  Description  Description  Description
                            </Text>               
                        </Box>                    
                    </Flex>                    
                </Box>
            </Flex>
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