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
import {FaCheck, FaFileSignature, FaX, FaUser, FaMapLocationDot } from "react-icons/fa6";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { GiSandsOfTime } from "react-icons/gi";
import {GoDotFill} from "react-icons/go";
import { MdSick } from "react-icons/md";
import {NavLink} from 'react-router-dom';

export const PendingAppointmentsCard = ({ appointment, form }) => {
    const {
        handleSubmit,
        formState: {
            errors
        },
        register
    } = form;
 
    return (
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
                w='full'
                h='64'
                rounded='md'
                gridGap={4}
                gridTemplateColumns="1fr 1fr"
            >
                <Flex px={4} pt={3} direction='column' mb={2}>
                    <Box mb={2} w='full'>
                        <Flex alignItems='center' mx={3}>
                            <FaUser size={20} color='#3f2975'/>
                            <Text fontSize='xl' fontWeight='bold' letterSpacing='wide' ml={4}>
                                {appointment.patient.name}
                            </Text>    
                        </Flex>
                    </Box>
                    <Box mb={2} w='full'>
                        <Flex alignItems='center' mx={3}>
                            <FaMapLocationDot size={20} color='#3176de'/>
                            <Text fontSize='md' fontWeight='semibold' letterSpacing='wide' ml={4} >
                                {appointment.patient.address}
                            </Text>                                    
                        </Flex>
                    </Box>
                    <Box w='full'>
                        <Flex alignItems='center' mx={3}>
                            <MdSick size={22} color='#18a614'/>
                            <Text fontSize='sm' letterSpacing='wide' ml={4}>
                                {appointment.illness_description}
                            </Text>                                    
                        </Flex>
                    </Box>                    
                </Flex>
                
                <Flex px={4} pt={2}>
                    <Flex direction='column' w='full'>
                        <Flex alignItems='center' mb={2}>
                            <Box mb={2} w='full'>
                                <Flex alignItems='center' mx={3}>
                                    {appointment.patient.gender === "Male" ? <BsGenderMale size={20} color='#3f2975'/> : <BsGenderFemale size={20} color='#f50057'/>}
                                    <Text fontSize='sm' letterSpacing='wide' ml={4}>
                                    <Text fontWeight='medium' color='grey'>Gender</Text> {appointment.patient.gender}
                                    </Text>                                    
                                </Flex>
                            </Box>      
                            <GoDotFill size={40} color='black' />
                            <Box mb={2} w='full' >
                                <Flex alignItems='center' justifyContent='center' mx={3}>
                                    <GiSandsOfTime size={20} color='#964609'/>
                                    <Text fontSize='sm' letterSpacing='wide' ml={4} >
                                    <Text fontWeight='medium' color='grey'>Age</Text> {appointment.age}
                                    </Text>                                    
                                </Flex>
                            </Box>
                            <GoDotFill size={40} color='black' />
                            <Box mb={2} w='full'>
                                <Flex alignItems='center' justifyContent='center' mx={3}>
                                    <BiSolidPhone size={20} color='#3d98ff'/>
                                    <Text fontSize='sm' letterSpacing='wide' ml={4} >
                                    <Text fontWeight='medium' color='grey'>Contact</Text>
                                    </Text>                                    
                                </Flex>
                            </Box>                                                        
                        </Flex>

                        <Box mb={2} w='full'>
                            <Flex alignItems='center' mx={3}>
                                <BsCalendarDayFill size={20} />
                                <Text fontSize='sm' letterSpacing='wide' ml={4}>
                                    <Text fontWeight='medium' color='grey'>Appointment Date & Time</Text> 
                                    <Text>{appointment.date}</Text>
                                    <Text>{appointment.appointment_time}</Text>
                                </Text>                                    
                            </Flex>
                        </Box>                           

                        {/* <Flex position='absolute' bottom={4} right={4}>
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
                                        Confirm Approval for ?
                                    </Text>
                                    <Text mb={2}>
                                        Approving  will officially register the clinic in the system.
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
                                            Confirm Rejection for ?
                                        </Text>
                                        <Text letterSpacing='wide'>
                                            Rejecting  will decline its registration in the system.
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
                        </Modal> */}

                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
}