import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    Text,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Grid,
    MenuDivider,
    Image,
    Center,
    Input,
    Select,
    InputGroup,
    InputRightElement,
    Checkbox,
    FormControl,
    FormLabel,
    Textarea,
    useDisclosure,
    useColorModeValue,
    Stack,
  } from '@chakra-ui/react'
import {useState} from "react";
import {BiChevronDown} from "react-icons/bi";

const clinics = [
    // Define your clinic data here
    { id: 1, name: 'Clinic 1' },
    { id: 2, name: 'Clinic 2' },
    { id: 3, name: 'Clinic 3' },
    { id: 4, name: 'Clinic 4' },
    { id: 5, name: 'Clinic 5' },
    { id: 6, name: 'Clinic 6' },
    { id: 7, name: 'Clinic 7' },
    { id: 8, name: 'Clinic 8' },
    { id: 9, name: 'Clinic 9' },
    { id: 10, name: 'Clinic 10' },
    // Add more clinics as needed
  ];

function ClinicList() {
    return (
        <Center minHeight="100vh" bg={"#f4f4f4"}>
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
                    <Link as={Link} color="#0307fc" to="/" marginRight={6}>
                        Home
                    </Link>
                    <Link as={Link} color="teal.500" to="/" marginRight={6}>
                        Clinic List
                    </Link>
                    <Menu marginRight={6}>
                        <MenuButton as={Link} color="teal.500" display="flex" alignItems="center">
                            <Flex alignItems="center">
                                <Text>More</Text>
                                <BiChevronDown />
                            </Flex>
                        </MenuButton>

                        <MenuList>
                            <MenuItem as={Link} to="/" _focus={{ boxShadow: 'none' }}>
                                Dashboard
                            </MenuItem>
                            <MenuItem as={Link} to="/" _focus={{ boxShadow: "none" }}>
                                Settings
                            </MenuItem>
                            <MenuItem as={Link} to="/" _focus={{ boxShadow: "none" }}>
                                Earnings
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem as={Link} to="/" _focus={{ boxShadow: "none" }}>
                                Sign out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>

            <Grid
                templateColumns="repeat(4, 1fr)" // Display 4 columns per row
                gap={6}
                mt={24} // Adjust the margin as needed
                mb={4}
                paddingX="1rem"
            >
                {clinics.map((clinic) => (
                    <Link to={`/clinic/${clinic.id}`} key={clinic.id}>
                        <Flex
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            bg="white"
                            w={64}
                            h={64}
                            shadow="md"
                            padding="1rem"
                            borderRadius="lg"
                            transition="transform 0.2s"
                            margin={4}
                            _hover={{ transform: 'scale(1.05)' }}
                        >
                            <Text fontSize="lg" fontWeight="bold">
                                {clinic.name}
                            </Text>
                        </Flex>
                    </Link>
                ))}
            </Grid>
        </Center>
    );
};

export default ClinicList;