import {
    Center,
    Button,
    Box,
    Flex,
    Text,
    VStack,
    SimpleGrid,
} from '@chakra-ui/react';

const handleAccept = (id) => {
    console.log('Accepting request with ID: ', id);
};

const handleReject = (id) => {
    console.log('Rejecting request with ID: ', id);
};

function PendingAppointmentsList() {
    return (
        <Center h="100%" bg="#f4f4f4">
        <Box
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
          <Flex>
            <Box my={7} mx={5} w="full">
              <Text fontSize="xl" fontWeight="bold">
                Patient Requests
              </Text>
            </Box>
          </Flex>
          <VStack spacing={4} align="center">
            <SimpleGrid columns={1} spacing={6} width="100%" p={4}>
              {patientRequests.map((patientRequest) => (
                <Box
                  key={patientRequest.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={4}
                  width="100%"
                >
                    <Text fontSize="md">
                        <Text fontWeight="bold" display="inline"> Patient Name:</Text> {patientRequest.patientName}
                    </Text>
                    <Text fontSize="md">
                        <Text fontWeight="bold" display="inline"> Age:</Text> {patientRequest.age}
                    </Text>
                    <Text fontSize="md">
                        <Text fontWeight="bold" display="inline"> Gender:</Text> {patientRequest.gender}
                    </Text>
                    <Text fontSize="md">
                        <Text fontWeight="bold" display="inline"> Description:</Text> {patientRequest.description}
                    </Text>
                    <Text fontSize="md">
                        <Text fontWeight="bold" display="inline"> Appointment Date:</Text> {patientRequest.appointmentDate}
                    </Text>
                    <Text fontSize="md">
                        <Text fontWeight="bold" display="inline"> Appointment Time:</Text> {patientRequest.appointmentTime}
                    </Text>
                    <Text fontSize="md">
                        <Text fontWeight="bold" display="inline"> Panel:</Text> {patientRequest.panel}
                    </Text>
                    <Flex justify="flex-end" mt={4}>
                        <Button colorScheme="green" size="sm" onClick={() => handleAccept(patientRequest.id)}>
                            Accept
                        </Button>
                        <Button colorScheme="red" size="sm" onClick={() => handleReject(patientRequest.id)} ml={2}>
                            Reject
                        </Button>
                    </Flex>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Box>
      </Center>
    );
}
  
  export default PendingAppointmentsList;