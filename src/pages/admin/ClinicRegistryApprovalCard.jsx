import {
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useDisclosure,
} from '@chakra-ui/react'
import {BiSolidPhone} from "react-icons/bi";
import {BsCalendarDayFill} from "react-icons/bs";
import {FaHospital} from "react-icons/fa";
import {FaCheck, FaFileSignature, FaX} from "react-icons/fa6";
import {GoDotFill} from "react-icons/go";
import {NavLink} from 'react-router-dom';
import {register_clinic, reject_clinic_request} from "../../../api/clinic_registry.js";

export const ClinicRegistryApprovalCard = ({ clinic, form }) => {
    const { isOpen: isOpenApprove, onOpen: onOpenApprove, onClose: onCloseApprove } = useDisclosure();
    const { isOpen: isOpenReject, onOpen: onOpenReject, onClose: onCloseReject } = useDisclosure();
    const {
        handleSubmit,
        formState: {
            errors
        },
        register
    } = form;
    
    console.log(clinic);
    
    const handleApprove = async () => {
        console.log('Approving clinic...');
        onCloseApprove();
        await register_clinic(clinic).then((res) => {
            console.log(res);
        });
    }
    
	const handleReject = async (data) => {
        console.log('Rejecting clinic...');
        data = {
            ...data,
            id: clinic.id,
        }
        await reject_clinic_request(data).then((res) => {
            console.log(res);
            onCloseReject();
        });
    }

    return (
        <Link
            as={NavLink}
            to={`/admin/approve-clinics/${clinic.id}`}
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
                bg='white'
            >
                <Box
                    minW="80"
                    h="auto"
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
                    <Flex px={4} pt={3} direction='column' mb={2}>
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
                            <Flex alignItems='center' mb={2}>
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center' mx={3}>
                                        <FaFileSignature size={20} color='#3f2975'/>
                                        <Text fontSize='sm' letterSpacing='wide' ml={4}>
                                        <Text fontWeight='medium' color='grey'>Registration Number</Text> {clinic.id}
                                        </Text>                                    
                                    </Flex>
                                </Box>      
                                <GoDotFill size={40} color='black' />
                                <Box mb={2} w='full' >
                                    <Flex alignItems='center' justifyContent='center' mx={3}>
                                        <FaHospital size={20} color='#ed645a'/>
                                        <Text fontSize='sm' letterSpacing='wide' ml={4} >
                                        <Text fontWeight='medium' color='grey'>Specialisation</Text> {clinic.specialist_clinic ? clinic.specialist_clinic : "General Clinic"}
                                        </Text>                                    
                                    </Flex>
                                </Box>
                                <GoDotFill size={40} color='black' />
                                <Box mb={2} w='full'>
                                    <Flex alignItems='center' justifyContent='center' mx={3}>
                                        <BiSolidPhone size={20} color='#3d98ff'/>
                                        <Text fontSize='sm' letterSpacing='wide' ml={4} >
                                        <Text fontWeight='medium' color='grey'>Contact</Text> {clinic.contact}
                                        </Text>                                    
                                    </Flex>
                                </Box>                                                        
                            </Flex>

                            <Box mb={2} w='full'>
                                <Flex alignItems='center' mx={3}>
                                    <BsCalendarDayFill size={20} />
                                    <Text fontSize='sm' letterSpacing='wide' ml={4}>
                                        <Text fontWeight='medium' color='grey'>Operating Duration</Text> 
                                        <Text>{clinic.start_day} - {clinic.end_day}</Text>
                                        <Text>{clinic.start_time} - {clinic.end_time}</Text>
                                    </Text>                                    
                                </Flex>
                            </Box>                           

                            <Flex position='absolute' bottom={4} right={4}>
                                <IconButton
                                    aria-label="Approve Clinic"
                                    icon={<FaCheck />}
                                    color='white'
                                    variant="solid"
                                    bgColor='green'
                                    size="lg"
                                    _hover={{ transform: 'scale(1.1)' }}
                                    _focus={{ boxShadow: 'none', outline: 'none' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onOpenApprove();
                                    }}
                                />
                                <IconButton
                                    aria-label="Reject Clinic"
                                    icon={<FaX />}
                                    variant="solid"
                                    size="lg"
                                    color='white'
                                    bgColor='red'
                                    ml={3}
                                    _hover={{ transform: 'scale(1.1)' }}
                                    _focus={{ boxShadow: 'none', outline: 'none' }}
                                    onClick={(e) => {
                                        e.preventDefault(); 
                                        onOpenReject();
                                    }}
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
                                            <Button mr={3} backgroundColor='green' color='white' onClick={handleApprove}>Approve</Button>
                                            <Button backgroundColor='blue.400' color='white' onClick={onCloseApprove}>Close</Button>
                                        </Box>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>

                            <Modal size='xl' isCentered isOpen={isOpenReject} onClose={onCloseReject}>
                                <form onSubmit={handleSubmit(handleReject)}>
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
                                                <FormControl my={2} isInvalid={errors.reason}>
                                                    <FormLabel>
                                                        Reason for Rejection <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                                    </FormLabel>
                                                    <Textarea
                                                        placeholder='Enter reason for rejection here...'
                                                        name='reason'
                                                        {
                                                            ...register('reason', {
                                                                required: 'This field is required.',
                                                            })
                                                        }
                                                    />
                                                    <FormErrorMessage>
                                                        {errors.reason && errors.reason.message}
                                                    </FormErrorMessage>
                                                </FormControl>
                                                <Text fontSize='sm' fontWeight='light' letterSpacing='wide'>This action cannot be undone.</Text>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Box display='flex'>
                                                <Button mr={3} backgroundColor='red' color='white' type='submit'>Reject</Button>
                                                <Button backgroundColor='blue.400' color='white' onClick={onCloseReject}>Close</Button>
                                            </Box>
                                        </ModalFooter>
                                    </ModalContent>
                                </form>
                            </Modal>

                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </Link>
    );
}

