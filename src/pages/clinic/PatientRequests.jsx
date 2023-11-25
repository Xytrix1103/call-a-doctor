import {
  Center,
  Button,
  Box,
  Flex,
  Text,
  VStack,
  SimpleGrid,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Collapse,
  Select,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from '@chakra-ui/react';
import { set } from 'firebase/database';
import { useState } from 'react';

const patientRequests = [
  {
    id: 1,
    patientName: 'Patient 1',
    age: 30,
    gender: 'Male',
    contactNumber: '1234567890',
    address: '123 Main St, Cityville',
    appointmentDate: '2023-11-15',
    appointmentTime: '08:00 AM - 10:00 AM',
    illnessDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'Pending',
    assignedDoctor: null,
    reasonOfRejection: null,
  },
  {
    id: 2,
    patientName: 'Patient 2',
    age: 25,
    gender: 'Female',
    contactNumber: '9876543210',
    address: '456 Oak St, Townsville',
    appointmentDate: '2023-11-16',
    appointmentTime: '10:45 AM - 12:30 PM',
    illnessDescription: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.',
    status: 'Pending',
    assignedDoctor: null,
    reasonOfRejection: null,
  },
  {
    id: 3,
    patientName: 'Patient 3',
    age: 40,
    gender: 'Male',
    contactNumber: '5551234567',
    address: '789 Pine St, Villageland',
    appointmentDate: '2023-11-17',
    appointmentTime: '02:15 PM - 04:00 PM',
    illnessDescription: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
    status: 'Approved',
    assignedDoctor: null,
    reasonOfRejection: null,
  },
  {
    id: 4,
    patientName: 'Patient 4',
    age: 35,
    gender: 'Female',
    contactNumber: '4447891234',
    address: '321 Cedar St, Hamlet City',
    appointmentDate: '2023-11-18',
    appointmentTime: '11:30 AM - 01:00 PM',
    illnessDescription: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
    status: 'Pending',
    assignedDoctor: null,
    reasonOfRejection: null,
  },
  {
    id: 5,
    patientName: 'Patient 5',
    age: 28,
    gender: 'Male',
    contactNumber: '6663339999',
    address: '555 Elm St, Riverside',
    appointmentDate: '2023-11-19',
    appointmentTime: '03:45 PM - 05:30 PM',
    illnessDescription: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
    status: 'Pending',
    assignedDoctor: null,
    reasonOfRejection: null,
  },
];

const doctors = [
  { id: 1, name: 'Dr. Smith' },
  { id: 2, name: 'Dr. Johnson' },
  { id: 3, name: 'Dr. Williams' },
  { id: 4, name: 'Dr. Brandon' },
  { id: 5, name: 'Dr. Hash' },
];


function renderPatientRequestsByStatus(status) {
  const [reasonOfRejection, setReasonOfRejection] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRequestIdApprove, setSelectedRequestIdApprove] = useState(null);
  const { isOpen: isOpenApprove, onOpen: onOpenApprove, onClose: onCloseApprove } = useDisclosure();
  const [selectedDoctors, setSelectedDoctors] = useState({});
  const [isAssignConfirmationOpen, setIsAssignConfirmationOpen] = useState(false);
  const [assignedRequests, setAssignedRequests] = useState([]);

  const handleReject = (id) => {
    setReasonOfRejection('');
    setSelectedRequestId(id);
    onOpen();

    console.log('Rejecting request with ID: ', id);
  };

  const handleApprove = (id) => {
    setSelectedRequestIdApprove(id);
    onOpenApprove();

    console.log('Approving request with ID: ', id);
  };

  const handleAssignDoctor = (id) => {
    console.log('Assigning doctor(s): ', selectedDoctors);

    const selectedRequestIds = Object.keys(selectedDoctors);

    setAssignedRequests((prevAssignedRequests) => [
      ...prevAssignedRequests,
      ...selectedRequestIds,
    ]);

    setAssignedRequests((prevAssignedRequests) => [
      ...prevAssignedRequests,
      id,
    ]);
    
    setIsAssignConfirmationOpen(false);
  };

  const handleChangeDoctor = (id, doctorId) => {
    setSelectedDoctors((prevSelectedDoctors) => ({
      ...prevSelectedDoctors,
      [id]: doctorId,
    }));

    setIsAssignConfirmationOpen(true);
  };

  const confirmRejection = () => {
    if (selectedRequestId !== null && reasonOfRejection.trim() !== '') {
      const index = patientRequests.findIndex((request) => request.id === selectedRequestId);

      patientRequests[index].reasonOfRejection = reasonOfRejection;
      patientRequests[index].status = 'Rejected';

      console.log('Reason of rejection: ', reasonOfRejection);
      
      onClose();
      setSelectedRequestId(null);
    }
  };

  const confirmApproval = () => {
    if (selectedRequestIdApprove !== null) {
      const index = patientRequests.findIndex((request) => request.id === selectedRequestIdApprove);

      patientRequests[index].status = 'Approved';

      console.log('Request approved with ID: ', selectedRequestIdApprove);

      onCloseApprove();
      setSelectedRequestIdApprove(null);
    }
  };

  const filteredRequests = patientRequests.filter((request) => request.status === status);

  return (
    <SimpleGrid columns={1} spacing={5} width="100%" p={2}>
      {filteredRequests.map((patientRequest) => (
        <Box key={patientRequest.id} borderWidth="1px" borderRadius="lg" p={4} width="100%">
          <Text fontSize="md">
            <Text fontWeight="bold" display="inline">
              Patient Name:
            </Text>{' '}
            {patientRequest.patientName}
          </Text>
          <Text fontSize="md">
            <Text fontWeight="bold" display="inline">
              Age:
            </Text>{' '}
            {patientRequest.age}
          </Text>
          <Text fontSize="md">
            <Text fontWeight="bold" display="inline">
              Gender:
            </Text>{' '}
            {patientRequest.gender}
          </Text>
          <Text fontSize="md">
            <Text fontWeight="bold" display="inline">
              Contact Number:
            </Text>{' '}
            {patientRequest.contactNumber}
          </Text>
          <Text fontSize="md">
            <Text fontWeight="bold" display="inline">
              Address:
            </Text>{' '}
            {patientRequest.address}
          </Text>
          <Text fontSize="md">
            <Text fontWeight="bold" display="inline">
              Appointment Date:
            </Text>{' '}
            {patientRequest.appointmentDate}
          </Text>
          <Text fontSize="md">
            <Text fontWeight="bold" display="inline">
              Appointment Time:
            </Text>{' '}
            {patientRequest.appointmentTime}
          </Text>
          <Text fontSize="md">
            <Text fontWeight="bold" display="inline">
              Illness Description:
            </Text>{' '}
            {patientRequest.illnessDescription}
          </Text>

          {status === 'Pending' && (
            <Flex justify="flex-end" mt={4}>
              <Button colorScheme="green" size="sm" onClick={() => handleApprove(patientRequest.id)}>
                Approve
              </Button>
              <Button colorScheme="red" size="sm" onClick={() => handleReject(patientRequest.id)} ml={2}>
                Reject
              </Button>
            </Flex>
          )}
          {status === 'Approved' && (
           <Flex align="center">
            <Text fontSize="md" fontWeight="bold" display="inline" mr={2}>
              Assigned Doctor:
            </Text>
            <Select
              value={selectedDoctors[patientRequest.id] || ''}
              onChange={(e) => handleChangeDoctor(patientRequest.id, e.target.value)}
              size="md"
              width="200px"
              isDisabled={assignedRequests.includes(patientRequest.id)}
            >
              <option value="" disabled>
                Select Doctor
              </option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.name}>
                  {doctor.name}
                </option>
              ))}
            </Select>
          </Flex>
          )}
          {status === 'Rejected' && (
            <Text fontSize="md">
              <Text fontWeight="bold" display="inline">
                Reason for Rejection:
              </Text>{' '}
              {patientRequest.reasonOfRejection}
            </Text>
          )}
        </Box>
      ))}

      <Modal size='xl' isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay 
          bg='blackAlpha.300'
          backdropFilter='blur(3px) hue-rotate(90deg)'
        />
        <ModalContent>
          <ModalHeader>Reason for Rejection</ModalHeader>
          <ModalCloseButton _focus={{ 
            boxShadow: 'none',
            outline: 'none',
           }} />
          <Divider mb={2} borderWidth='1px' borderColor="blackAlpha.300"/>
          <ModalBody>
            <Text fontSize='md' letterSpacing='wide' fontWeight='bold' mb={2}>
              Please provide a reason for rejecting this patient request.
            </Text>
            <Text fontSize='sm' fontWeight='light' letterSpacing='wide'>
              This action cannot be undone.
            </Text>
            <Input
              value={reasonOfRejection}
              onChange={(e) => setReasonOfRejection(e.target.value)}
              placeholder="Enter reason for rejection..."
              bg="gray.200"
              rounded="xl"
              borderWidth="1px"
              borderColor="gray.300"
              color="gray.900"
              size="md"
              focusBorderColor="blue.500"
              w="full"
              p={2.5}
            />
          </ModalBody>
          <ModalFooter>
            <Box display='flex'>
              <Button mr={3} backgroundColor='green' color='white' onClick={confirmRejection} isDisabled={!reasonOfRejection.trim()}>Confirm</Button>
              <Button mr={3} backgroundColor='blue.400' color='white' onClick={onClose}>Close</Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
          <Divider mb={2} borderWidth='1px' borderColor="blackAlpha.300" />
          <ModalBody>
            <Text fontSize='md' letterSpacing='wide' fontWeight='bold' mb={2}>
              Confirm approval for this patient request?
            </Text>
            <Text fontSize='sm' fontWeight='light' letterSpacing='wide'>
              This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Box display='flex'>
              <Button mr={3} backgroundColor='green' color='white' onClick={confirmApproval}>Confirm</Button>
              <Button mr={3} backgroundColor='blue.400' color='white' onClick={onCloseApprove}>Close</Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal size="xl" isCentered isOpen={isAssignConfirmationOpen} onClose={() => setIsAssignConfirmationOpen(false)}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(3px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader>Assign Doctor Confirmation</ModalHeader>
          <ModalCloseButton _focus={{ 
            boxShadow: 'none', 
            outline: 'none',
          }} />
          <Divider mb={2} borderWidth="1px" borderColor="blackAlpha.300" />
          <ModalBody>
            <Text fontSize="md" letterSpacing="wide" fontWeight="bold" mb={2}>
              Confirm the assignment of the selected doctor?
            </Text>
            <Text fontSize="sm" fontWeight="light" letterSpacing="wide">
              This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Box display="flex">
              <Button mr={3} backgroundColor="green" color="white" onClick={handleAssignDoctor} isDisabled={Object.keys(selectedDoctors).length === 0}>
                Confirm
              </Button>
              <Button mr={3} backgroundColor="blue.400" color="white" onClick={() => setIsAssignConfirmationOpen(false)}>
                Close
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SimpleGrid>
  );
}

function PatientRequests() {
  return (
    <Center h="100%" bg="#f4f4f4">
      <Box
        h="85vh"
        w="85%"
        bg="white"
        boxShadow="xl"
        rounded="xl"
        p={3}
        overflowY="scroll"
        maxHeight="85vh"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0px',
          },
        }}
      >
        <Tabs variant="enclosed" defaultIndexs={0} mb="1em">
          <style>
            {`
              .chakra-tabs__tab {
                border-radius: 8px 8px 0 0;
                font-weight: bold;
              }
              .chakra-tabs__tab:focus {
                outline: none;
                box-shadow: none;
              }
            `}
          </style>

          <TabList>
            <Tab flex="0 0 140px" maxW="140px">
              Pending
            </Tab>
            <Tab flex="0 0 140px" maxW="140px">
              Approved
            </Tab>
            <Tab flex="0 0 140px" maxW="140px">
              Rejected
            </Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel height="500px">
              <VStack spacing={2} align="center">
                <Box my={5} mx={5} w="full">
                  <Text fontSize="xl" fontWeight="bold" pl="6px">
                    Pending Patient Requests
                  </Text>
                </Box>
                {renderPatientRequestsByStatus('Pending')}
                <Box h="20px" />
              </VStack>
            </TabPanel>
            <TabPanel height="500px">
              <VStack spacing={2} align="center">
                <Box my={5} mx={5} w="full">
                  <Text fontSize="xl" fontWeight="bold" pl="6px">
                    Approved Patient Requests
                  </Text>
                </Box>
                {renderPatientRequestsByStatus('Approved')}
                <Box h="20px" />
              </VStack>
            </TabPanel>
            <TabPanel height="500px">
              <VStack spacing={2} align="center">
                <Box my={5} mx={5} w="full">
                  <Text fontSize="xl" fontWeight="bold" pl="6px">
                    Rejected Patient Requests
                  </Text>
                </Box>
                {renderPatientRequestsByStatus('Rejected')}
                <Box h="20px" />
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Center>
  );
}
  
  export default PatientRequests;