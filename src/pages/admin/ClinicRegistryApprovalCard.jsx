import {
    Box,
    Flex,
    Text,
    Icon,
    Link,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Divider,
    FormControl,
    FormLabel,
    Textarea,
} from '@chakra-ui/react'
import {useState, useEffect} from "react";
import {db} from "../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";
import {BiSolidPhone} from "react-icons/bi";
import {BsCalendarDayFill, BsFillClockFill, BsArrowRight} from "react-icons/bs";
import {FaMapMarkerAlt, FaClinicMedical, FaHospital} from "react-icons/fa";
import {FaX, FaCheck, FaFileSignature} from "react-icons/fa6";
import { NavLink } from 'react-router-dom';

export const ClinicRegistryApprovalCard = ({ clinicId }) => {
    const [clinic, setClinic] = useState({});
    const { isOpen: isOpenApprove, onOpen: onOpenApprove, onClose: onCloseApprove } = useDisclosure();
    const { isOpen: isOpenReject, onOpen: onOpenReject, onClose: onCloseReject } = useDisclosure();
    console.log(clinicId);
    useEffect(() => {
        onValue(query(ref(db, `clinic_requests/${clinicId}`)), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setClinic(data);
                console.log(data)
            } else {
                console.log(`Clinic with ID ${clinicId} not found.`);
            }
        });
    }, [clinicId]);

    return (
        <Link
            to={`/admin/approve-clinics/${clinicId}`}
            key={clinic.id}
            _hover={{
                textDecoration: 'none',
                color: 'black',
            }}
        >
            <Flex
                w='full'
                rounded='lg'
                my={8}
                position='relative'
                boxShadow="lg"  
                transition="box-shadow 0.3s, transform 0.3s" 
                _hover={{
                    boxShadow: 'xl',
                    transform: 'scale(1.02)',
                }}
            >
                <Box
                    minW="80"
                    h="64"
                    bgImage={clinic.image ? `url(${clinic.image})` : `https://source.unsplash.com/random`}
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
                >
                    <Flex px={4} pt={2} direction='column'>
                        <Box mb={2} w='full'>
                            <Flex alignItems='center'>
                                <Text fontSize='xl' fontWeight='bold' letterSpacing='wide' ml={3}>
                                    {clinic.name}
                                </Text>    
                            </Flex>
                        </Box>
                        <Box w='full'>
                            <Flex alignItems='center'>
                                <Text fontSize='md' letterSpacing='wide' ml={3} >
                                    {clinic.address}
                                </Text>                                    
                            </Flex>
                        </Box>
                    </Flex>
                    <Flex px={4} pt={2}>
                        <Flex direction='column' w='full'>
                            <Box mb={2} w='full'>
                                <Flex alignItems='center'>
                                    <FaFileSignature size={20} />
                                    <Text fontSize='md' letterSpacing='wide' ml={3} display='flex'>
                                    <Text fontWeight='medium'>Business Registration Number</Text>: {clinic.business_reg_num}
                                    </Text>                                    
                                </Flex>
                            </Box>
                            <Box mb={2} w='full'>
                                <Flex alignItems='center'>
                                    <BsCalendarDayFill size={20} />
                                    <Text fontSize='md' letterSpacing='wide' ml={3} display='flex'>
                                        <Text fontWeight='medium'>Operating Days</Text>: {clinic.start_day} - {clinic.end_day}
                                    </Text>                                    
                                </Flex>
                            </Box>
                            <Box mb={2} w='full'>
                                <Flex alignItems='center'>
                                    <BsFillClockFill size={20} />
                                    <Text fontSize='md' letterSpacing='wide' ml={3} display='flex'>
                                        <Text fontWeight='medium'>Operating Hours</Text>: {clinic.start_time} - {clinic.end_time}
                                    </Text>                                    
                                </Flex>
                            </Box>
                            <Box mb={2} w='full'>
                                <Flex alignItems='center'>
                                    <FaHospital size={20} />
                                    <Text fontSize='md' letterSpacing='wide' ml={3} >
                                        {clinic.specialist_clinic ? clinic.specialist_clinic : "General Clinic"}
                                    </Text>                                    
                                </Flex>
                            </Box>
                            <Box mb={2} w='full'>
                                <Flex alignItems='center'>
                                    <BiSolidPhone size={20} />
                                    <Text fontSize='md' letterSpacing='wide' ml={3} >
                                        {clinic.contact}
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
                                    _focus={{ boxShadow: 'none', outline: 'none' }}
                                    onClick={onOpenApprove}
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
                                    _focus={{ boxShadow: 'none', outline: 'none' }}
                                    onClick={onOpenReject}
                                />
                            </Flex>

                            <Modal size='xl' isCentered isOpen={isOpenApprove} onClose={onCloseApprove}>
                                <ModalOverlay
                                    bg='blackAlpha.300'
                                    backdropFilter='blur(3px) hue-rotate(90deg)'
                                />
                                <ModalContent>
                                    <ModalHeader>Approval Confirmation</ModalHeader>
                                    <ModalCloseButton _focus={{
                                        boxShadow: 'none',
                                        outline: 'none',
                                    }} />
                                    <Divider mb={2} borderWidth='1px' borderColor="blackAlpha.300"/>
                                    <ModalBody>
                                        <Text fontSize='md' letterSpacing='wide' fontWeight='bold' mb={2}>
                                            Confirm Approval for {clinic.name}?
                                        </Text>
                                        <Text mb={2}>
                                            Approving {clinic.name} will officially register the clinic in the system.
                                        </Text>
                                        <Text fontSize='sm' fontWeight='light' letterSpacing='wide'>This action cannot be undone.</Text>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Box display='flex'>
                                            <Button mr={3} backgroundColor='green' color='white'>Approve</Button>
                                            <Button backgroundColor='blue.400' color='white' onClick={onCloseApprove}>Close</Button>
                                        </Box>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>

                            <Modal size='xl' isCentered isOpen={isOpenReject} onClose={onCloseReject}>
                                <ModalOverlay
                                    bg='blackAlpha.200'
                                    backdropFilter='blur(3px) hue-rotate(90deg)'
                                />
                                <ModalContent>
                                    <ModalHeader>Rejection Confirmation</ModalHeader>
                                    <ModalCloseButton _focus={{
                                        boxShadow: 'none',
                                        outline: 'none',
                                    }} />
                                    <Divider mb={2} borderWidth='1px' borderColor="blackAlpha.300"/>
                                    <ModalBody>
                                        <Text fontSize='md' letterSpacing='wide' fontWeight='bold' mb={2}>
                                            Confirm Rejection for {clinic.name}?
                                        </Text>
                                        <Text letterSpacing='wide'>
                                            Rejecting {clinic.name} will decline its registration in the system.
                                        </Text>
                                        <FormControl my={2}>
                                            <FormLabel>
                                                Reason for Rejection <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                            </FormLabel>
                                            <Textarea placeholder='Enter reason for rejection here...' />
                                        </FormControl>
                                        <Text fontSize='sm' fontWeight='light' letterSpacing='wide'>This action cannot be undone.</Text>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Box display='flex'>
                                            <Button mr={3} backgroundColor='red' color='white'>Reject</Button>
                                            <Button backgroundColor='blue.400' color='white' onClick={onCloseReject}>Close</Button>
                                        </Box>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>

                        </Flex>
                    </Flex>
                </Box>
            </Flex> 
        </Link>  
    );
}

