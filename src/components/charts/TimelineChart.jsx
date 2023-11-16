import {
	Box,
	Flex,
	Image,
	Text,
    Badge,
    Link,
    Avatar,
    Divider,
    VStack,
} from '@chakra-ui/react';
import React from 'react'; 
import { GoDotFill } from "react-icons/go"
import { Timeline } from 'primereact/timeline';
import { TimelineItem } from 'primereact/timelineitem';


export const TimelineChart = () => {
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

    const timelineContent = (item) => {
        return (
            <Flex mb={4}>
                <Box ml={5} mt={3} p={2} borderWidth="1px" borderRadius="md" w='90%'>
                    <Flex alignItems='center' mb={1} gap={2} maxW='350px' >
                        <Text fontSize="xs" color="gray.700">
                            {item.date}
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
    }
        
    return (
        <Box pt={1} px={4}>
            <Timeline value={events} align="alternate" content={timelineContent} />
        </Box>
    )
}