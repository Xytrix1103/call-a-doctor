import {
    Box,
    Center,
    Flex,
    Text,
    Icon,
    IconButton,
} from '@chakra-ui/react'
import {useRef, useState} from "react";
import {BiSolidPhone} from "react-icons/bi";
import {BsCalendarDayFill, BsFillClockFill, BsArrowRight} from "react-icons/bs";
import {FaMapMarkerAlt, FaClinicMedical, FaHospital} from "react-icons/fa";
import {FaX, FaCheck, FaFileSignature} from "react-icons/fa6";
import {GiHospitalCross} from "react-icons/gi";
import { NavLink } from 'react-router-dom';

function ClinicRegistryApproval() {

    return (
        <Center h="auto" bg="#f4f4f4">
            <Box
                w="85%"
                bg="white"
                boxShadow="xl"
                rounded="xl"
                p={5}
                h='100%'
            >
                <Box m={3}>
                    <Text fontSize='xl' fontWeight='bold' letterSpacing='wide'>Clinic Registry Approval</Text>
                </Box>
                <Flex
                    w='full'
                    rounded='lg'
                    background={'#f4f4f4'}
                    my={6}
                    position='relative'
                >
                    <Box
                        minW="64"
                        h="64"
                        bgImage="url('https://source.unsplash.com/random')"
                        bgSize="cover"
                        bgPosition="center"
                        roundedLeft='lg'
                    >
                    </Box>
                    <Box
                        w='full'
                        h='64'
                        rounded='md'
                        gridGap={4}
                        gridTemplateColumns="1fr 1fr"
                        background={'#f4f4f4'}
                    >
                        <Flex px={4} pt={2} direction='column'>
                            <Box mb={2} w='full'>
                                <Flex alignItems='center'>
                                    <FaClinicMedical size={20} color='red'/>
                                    <Text fontSize='lg' letterSpacing='wide' ml={3}>
                                        Clinic Name
                                    </Text>    
                                    <Box ml='auto'>
                                        <NavLink>
                                            <Box display='flex' alignItems='center'>
                                                <Text textDecoration='underline' mr={2}>View Clinic Details</Text>
                                                <Icon as={BsArrowRight} size={20} />
                                            </Box>
                                        </NavLink>
                                    </Box>                                
                                </Flex>
                            </Box>
                            <Box w='full'>
                                <Flex alignItems='center'>
                                    <FaMapMarkerAlt size={20} color='blue'/>
                                    <Text fontSize='lg' letterSpacing='wide' ml={3} >
                                        Jalan Sungai Tiram 8, 11900 Bayan Lepas, Pulau Pinang, Malaysia
                                    </Text>                                    
                                </Flex>
                            </Box>
                        </Flex>
                        <Flex px={4} pt={2}>
                            <Flex direction='column' w='full'>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <FaFileSignature size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} display='flex'>
                                        <Text fontWeight='medium'>Business Registration Number</Text>:
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <BsCalendarDayFill size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} display='flex'>
                                            <Text fontWeight='medium'>Operating Days</Text>: Monday - Friday
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <BsFillClockFill size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} display='flex'>
                                            <Text fontWeight='medium'>Operating Hours</Text>: 08:00 AM - 10:00 PM
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <FaHospital size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} >
                                            General Clinic
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <BiSolidPhone size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} >
                                            04-733-2928
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Flex position='absolute' bottom={3} right={3}>
                                    <IconButton
                                        aria-label="Approve Clinic"
                                        icon={<FaCheck />}
                                        color='white'
                                        variant="solid"
                                        bgColor='green'
                                        size="md"
                                        _hover={{ transform: 'scale(1.1)' }}
                                    />
                                    <IconButton
                                        aria-label="Reject Clinic"
                                        icon={<FaX />}
                                        variant="solid"
                                        size="md"
                                        color='white'
                                        bgColor='red'
                                        ml={3}
                                        _hover={{ transform: 'scale(1.1)' }}
                                    />
                                </Flex>

                            </Flex>
                        </Flex>
                    </Box>
                </Flex>

                <Flex
                    w='full'
                    rounded='lg'
                    background={'#f4f4f4'}
                    my={6}
                    position='relative'
                >
                    <Box
                        minW="64"
                        h="64"
                        bgImage="url('https://source.unsplash.com/random')"
                        bgSize="cover"
                        bgPosition="center"
                        roundedLeft='lg'
                    >
                    </Box>
                    <Box
                        w='full'
                        h='64'
                        rounded='md'
                        gridGap={4}
                        gridTemplateColumns="1fr 1fr"
                        background={'#f4f4f4'}
                    >
                        <Flex px={4} pt={2} direction='column'>
                            <Box mb={2} w='full'>
                                <Flex alignItems='center'>
                                    <FaClinicMedical size={20} color='red'/>
                                    <Text fontSize='lg' letterSpacing='wide' ml={3}>
                                        Clinic Name
                                    </Text>    
                                    <Box ml='auto'>
                                        <NavLink to={`/approve-clinics/1`} >
                                            <Box display='flex' alignItems='center'>
                                                <Text textDecoration='underline' mr={2}>View Clinic Details</Text>
                                                <Icon as={BsArrowRight} size={20} />
                                            </Box>
                                        </NavLink>
                                    </Box>                                
                                </Flex>
                            </Box>
                            <Box w='full'>
                                <Flex alignItems='center'>
                                    <FaMapMarkerAlt size={20} color='blue'/>
                                    <Text fontSize='lg' letterSpacing='wide' ml={3} >
                                        Jalan Sungai Tiram 8, 11900 Bayan Lepas, Pulau Pinang, Malaysia
                                    </Text>                                    
                                </Flex>
                            </Box>
                        </Flex>
                        <Flex px={4} pt={2}>
                            <Flex direction='column' w='full'>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <FaFileSignature size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} display='flex'>
                                        <Text fontWeight='medium'>Business Registration Number</Text>:
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <BsCalendarDayFill size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} display='flex'>
                                            <Text fontWeight='medium'>Operating Days</Text>: Monday - Friday
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <BsFillClockFill size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} display='flex'>
                                            <Text fontWeight='medium'>Operating Hours</Text>: 08:00 AM - 10:00 PM
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <FaHospital size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} >
                                            General Clinic
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <BiSolidPhone size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} >
                                            04-733-2928
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Flex position='absolute' bottom={3} right={3}>
                                    <IconButton
                                        aria-label="Approve Clinic"
                                        icon={<FaCheck />}
                                        color='white'
                                        variant="solid"
                                        bgColor='green'
                                        size="md"
                                        _hover={{ transform: 'scale(1.1)' }}
                                    />
                                    <IconButton
                                        aria-label="Reject Clinic"
                                        icon={<FaX />}
                                        variant="solid"
                                        size="md"
                                        color='white'
                                        bgColor='red'
                                        ml={3}
                                        _hover={{ transform: 'scale(1.1)' }}
                                    />
                                </Flex>

                            </Flex>
                        </Flex>
                    </Box>
                </Flex>

                <Flex
                    w='full'
                    rounded='lg'
                    background={'#f4f4f4'}
                    my={6}
                    position='relative'
                >
                    <Box
                        minW="64"
                        h="64"
                        bgImage="url('https://source.unsplash.com/random')"
                        bgSize="cover"
                        bgPosition="center"
                        roundedLeft='lg'
                    >
                    </Box>
                    <Box
                        w='full'
                        h='64'
                        rounded='md'
                        gridGap={4}
                        gridTemplateColumns="1fr 1fr"
                        background={'#f4f4f4'}
                    >
                        <Flex px={4} pt={2} direction='column'>
                            <Box mb={2} w='full'>
                                <Flex alignItems='center'>
                                    <FaClinicMedical size={20} color='red'/>
                                    <Text fontSize='lg' letterSpacing='wide' ml={3}>
                                        Clinic Name
                                    </Text>    
                                    <Box ml='auto'>
                                        <NavLink>
                                            <Box display='flex' alignItems='center'>
                                                <Text textDecoration='underline' mr={2}>View Clinic Details</Text>
                                                <Icon as={BsArrowRight} size={20} />
                                            </Box>
                                        </NavLink>
                                    </Box>                                
                                </Flex>
                            </Box>
                            <Box w='full'>
                                <Flex alignItems='center'>
                                    <FaMapMarkerAlt size={20} color='blue'/>
                                    <Text fontSize='lg' letterSpacing='wide' ml={3} >
                                        Jalan Sungai Tiram 8, 11900 Bayan Lepas, Pulau Pinang, Malaysia
                                    </Text>                                    
                                </Flex>
                            </Box>
                        </Flex>
                        <Flex px={4} pt={2}>
                            <Flex direction='column' w='full'>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <FaFileSignature size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} display='flex'>
                                        <Text fontWeight='medium'>Business Registration Number</Text>:
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <BsCalendarDayFill size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} display='flex'>
                                            <Text fontWeight='medium'>Operating Days</Text>: Monday - Friday
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <BsFillClockFill size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} display='flex'>
                                            <Text fontWeight='medium'>Operating Hours</Text>: 08:00 AM - 10:00 PM
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <FaHospital size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} >
                                            General Clinic
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center'>
                                        <BiSolidPhone size={20} />
                                        <Text fontSize='lg' letterSpacing='wide' ml={3} >
                                            04-733-2928
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <Flex position='absolute' bottom={3} right={3}>
                                    <IconButton
                                        aria-label="Approve Clinic"
                                        icon={<FaCheck />}
                                        color='white'
                                        variant="solid"
                                        bgColor='green'
                                        size="md"
                                        _hover={{ transform: 'scale(1.1)' }}
                                    />
                                    <IconButton
                                        aria-label="Reject Clinic"
                                        icon={<FaX />}
                                        variant="solid"
                                        size="md"
                                        color='white'
                                        bgColor='red'
                                        ml={3}
                                        _hover={{ transform: 'scale(1.1)' }}
                                    />
                                </Flex>

                            </Flex>
                        </Flex>
                    </Box>
                </Flex>

            </Box>
        </Center>
    );
}

export default ClinicRegistryApproval;
