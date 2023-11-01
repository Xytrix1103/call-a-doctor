import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Select,
    Text,
    Textarea,
} from '@chakra-ui/react'
import {BiChevronDown} from "react-icons/bi";
import {NavLink} from "react-router-dom";

function DoctorRequestForm() {

  return (
    <Center h="100vh" bg={"#f4f4f4"}>
        <Flex
            as="nav"
            align="top"
            padding="1rem"
            bg="white" // Set the navbar background color to white
            bgColor={"white"}
            position="fixed"
            top="0"
            left="0"
            right="0"
            zIndex="999"
            width="100%"
            shadow="md"
            justify="space-between" // Align items to the space between
        >
            <Flex align="center">
                <Avatar
                    size="md"
                    src="src\assets\images\Call_A_Doctor_Logo_NoBg.png"
                />
                <Text fontSize="xl" ml={2} fontWeight="bold">
                    Call A Doctor
                </Text>
            </Flex>

            <Flex alignItems="center">
                <Link as={NavLink} color="#0307fc" to="/" marginRight={6}>
                    Home
                </Link>
                <Link as={NavLink} color="teal.500" to="/patient/clinics" marginRight={6}>
                    Clinic List
                </Link>
                <Menu marginRight={6}>
                    <MenuButton as={NavLink} color="teal.500" display="flex" alignItems="center">
                        <Flex alignItems="center">
                            <Text>More</Text>
                            <BiChevronDown />
                        </Flex>
                    </MenuButton>

                    <MenuList>
                        <MenuItem as={NavLink} to="/" _focus={{ boxShadow: 'none' }}>
                        Dashboard
                        </MenuItem>
                        <MenuItem as={NavLink} to="/" _focus={{ boxShadow: "none" }}>
                        Settings
                        </MenuItem>
                        <MenuItem as={NavLink} to="/" _focus={{ boxShadow: "none" }}>
                        Earnings
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem as={NavLink} to="/" _focus={{ boxShadow: "none" }}>
                        Sign out
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Flex>

        <Box
            w="80%"
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
                                    Panel Firms (Optional)
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
