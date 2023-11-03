import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    Select,
    Text,
    Textarea,
} from '@chakra-ui/react'

function DoctorRequestForm() {
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData(e.target);
		
		if (res) {
			console.log("Requesting a doctor");
		}
	}
	
  return (
    <Center w="100%" h="100%" bg="#f4f4f4">
        <Box
            w="85%"
            bg="white"
            boxShadow="xl"
            rounded="xl"
            p={5}
            gridGap={4}
            gridTemplateColumns="1fr 1fr"
        >
            <form action="/" method="post">
                <Flex>
                    <Box my={7} mx={5} w="full">
                        <Text fontSize="xl" fontWeight="bold">
                            Doctor Request Form
                        </Text>
                    </Box>
                </Flex>
           
                <Flex>
                    <Box mx={5} w="full">
                        <Box>
                            <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                Patient Name
                            </Text>
                            <Input
                                variant="filled"
                                type="text"
                                name="name"
                                id="name"
                                placeholder="John Doe"
                                rounded="xl"
                                borderWidth="1px"
                                borderColor="gray.300"
                                color="gray.900"
                                size="md"
                                focusBorderColor="blue.500"
                                w="full"
                                p={2.5}
                            />
                        </Box>
                        <Flex alignItems="center" justifyContent="space-between" mt={6}>
                            <Box flex="1" mr={4}>
                                <FormControl>
                                    <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                        Age
                                    </FormLabel>
                                    <InputGroup size="md">
                                        <Input
                                            variant="filled"
                                            type="number"
                                            name="age"
                                            id="age"
                                            rounded="xl"
                                            borderWidth="1px"
                                            borderColor="gray.300"
                                            color="gray.900"
                                            size="md"
                                            focusBorderColor="blue.500"
                                        />
                                    </InputGroup>
                                </FormControl>
                            </Box>
                            <Box flex="1">
                                <FormControl>
                                    <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                        Gender
                                    </FormLabel>
                                    <Select
                                        variant="filled"
                                        name="gender"
                                        id="gender"
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        size="md"
                                        focusBorderColor="blue.500"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Flex>
                        <Box>
                            <Text mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900">
                                Patient Description
                            </Text>
                            <Textarea
                                variant="filled"
                                name="description"
                                id="description"
                                placeholder="Describe your problems here..."
                                rounded="xl"
                                borderWidth="1px"
                                borderColor="gray.300"
                                color="gray.900"
                                size="md"
                                focusBorderColor="blue.500"
                                w="full"
                                p={2.5}
                            />
                        </Box>
                    </Box>
                    <Box mx={5} w="full">
                        <Box>
                            <FormControl>
                                <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                    Appointment Date
                                </FormLabel>
                                <Input
                                    variant="filled"
                                    type="date"
                                    name="appointment_date"
                                    id="appointment_date"
                                    rounded="xl"
                                    borderWidth="1px"
                                    borderColor="gray.300"
                                    color="gray.900"
                                    size="md"
                                    focusBorderColor="blue.500"
                                    w="full"
                                    p={2.5}
                                />
                            </FormControl>
                        </Box>
                        <Box>
                            <FormControl mt={6}>
                                <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                    Appointment Time
                                </FormLabel>
                                <Input
                                    variant="filled"
                                    type="time"
                                    name="appointment_time"
                                    id="appointment_time"
                                    rounded="xl"
                                    borderWidth="1px"
                                    borderColor="gray.300"
                                    color="gray.900"
                                    size="md"
                                    focusBorderColor="blue.500"
                                    w="full"
                                    p={2.5}
                                />
                            </FormControl>
                        </Box>
                        <Box>
                            <FormControl mt={6}>
                                <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                    Panel Firm (Optional)
                                </FormLabel>
                                <Input
                                    variant="filled"
                                    type="text"
                                    name="panel_firm"
                                    id="panel_firm"
                                    rounded="xl"
                                    borderWidth="1px"
                                    borderColor="gray.300"
                                    color="gray.900"
                                    size="md"
                                    focusBorderColor="blue.500"
                                    w="full"
                                    p={2.5}
                                />
                            </FormControl>
                        </Box>

                            <Button
                                type="submit"
                                colorScheme="blue"
                                rounded="xl"
                                px={4}
                                py={2}
                                mt={14}
                                w="full"
                            >
                                Submit Request
                            </Button>
                        </Box>
                    </Flex>
                </form>
            </Box>
        </Center>
    );
}

export default DoctorRequestForm;
