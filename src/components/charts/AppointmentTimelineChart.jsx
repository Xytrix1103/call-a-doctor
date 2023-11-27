import { Box, Flex, Text, Popover, PopoverTrigger, PopoverContent, Divider, Avatar } from '@chakra-ui/react';
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { FaEarthAsia } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";

const TimelineItem = ({ appointment }) => (
    <Flex>
        <Box justifyContent='center' alignItems='center' mb={5}>
            <Box bgColor="blue.500" w="2px" h="50%" my={3} ml={'6px'}/>
            <FaEarthAsia size='15' color='blue'/>
            <Box bgColor="blue.500" w="2px" h="50%" my={3} ml={'6px'}/>
        </Box>
        <Box ml={5} mt={3} p={2} borderWidth="1px" borderRadius="md" w='90%'>
            <Flex alignItems='center' mb={1} gap={2} maxW='350px' >
                <Text fontSize="xs" color="gray.700">
                    {appointment.date}
                </Text>  
                <GoDotFill size='7' color='gray'/>
                <Text fontSize="xs" color="gray.700">
                    {appointment.appointment_time}
                </Text>  
            </Flex>
            <Flex>
                <Box>
                    <Flex alignItems='center'>
                        <Box ml={2}>
                            <Flex alignItems='center' gap={3}>
                                <Avatar src={appointment.doctor.image} size='sm'/>
                                <Text fontSize="sm" fontWeight="semibold" maxW='90%' isTruncated>
                                    {appointment.doctor.name}
                                </Text>                                       
                            </Flex>
                            <Divider my={1} w='95%' />
                            <Flex maxW='95%' alignItems='center' justifyContent='space-between' mb={2}>
                                <Flex alignItems='center' gap={2}>
                                    {appointment.patient ? appointment.patient.gender === "Male" ? <BsGenderMale size={25} color='blue'/> : <BsGenderFemale size={25} color='pink'/> : appointment.gender === "Male" ? <BsGenderMale size={25} color='blue'/> : <BsGenderFemale size={25} color='pink'/>}
                                    <Box>
                                        <Text fontSize="xs" fontWeight="medium" color="gray.500">
                                            Name
                                        </Text>
                                        <Text fontSize="xs" fontWeight="semibold" color="gray.700">
                                            {appointment.patient ? appointment.patient.name : appointment.name}
                                        </Text>
                                    </Box>
                                </Flex>
                                <Box>
                                    <Text fontSize="xs" fontWeight="medium" color="gray.500">
                                        Contact
                                    </Text>
                                    <Text fontSize="xs" fontWeight="semibold" color="gray.700">
                                        {appointment.patient ? appointment.patient.contact : appointment.phone}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="xs" fontWeight="medium" color="gray.500">
                                        Age
                                    </Text>
                                    <Text fontSize="xs" fontWeight="semibold" color="gray.700">
                                        {appointment.age}
                                    </Text>
                                </Box>
                            </Flex>
                            <Text fontSize="xs" fontWeight="medium" color="gray.500">
                                Illness Description
                            </Text>
                            <Text fontSize='xs' fontWeight='medium' maxW='95%' noOfLines={5}>
                                {appointment.illness_description}
                            </Text>               
                        </Box>                    
                    </Flex>                    
                </Box>
            </Flex>
        </Box>
    </Flex>
);
  

const VerticalTimeline = ({ appointments }) => (
    <Flex direction="column" gap={1}>
        {appointments.map((appointment) => (
            <TimelineItem appointment={appointment} />
        ))}
    </Flex>
);

export const AppointmentTimelineChart = ({appointments}) => (
    <Box pt={1} px={4}>
        <VerticalTimeline appointments={appointments} />
    </Box>
);