import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Text,
    VStack
} from '@chakra-ui/react';
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useState} from "react";

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Center minH="100vh" bg={"#f4f4f4"}>
            <Box w='67%'>
                <Flex 	
                    bg="white"
                    boxShadow="xl"
                    rounded="xl"
                    p={5}
                    gridGap={4}
                    gridTemplateColumns="1fr 1fr"
                >
                    <Box my={7} ml={5} w="full">
                        <Box ml={10}>
							<Text fontSize="xl" fontWeight="bold">
								Call A Doctor
							</Text>
						</Box>
                        <Box textAlign="center">
                            <Image
                                src="/src/assets/svg/register-doctor.svg"
                                alt="Register"
                                w="96"
                                h="96"
                            />
                        </Box>
                        <Text textAlign="center" mt="5">
                            Registering a clinic?{' '}
                            <Link color="blue.500" textDecoration="underline" href="/clinic-registry">
                            Register here
                            </Link>
                        </Text>
                    </Box>
                    <Box my={7} mr={5} w="full">
                        <Text fontSize="xl" fontWeight="bold" mb={7}>
								Register
							</Text>
                        <form action="/api/register" method="post">
                            <VStack spacing="4">
                                <FormControl id="name">
                                    <FormLabel>Name</FormLabel>
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
                                         isRequired
                                    />
                                </FormControl>
                                <FormControl id="email">
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        variant="filled"
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="john.doe@gmail.com"
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        size="md"
                                        focusBorderColor="blue.500"
                                        w="full"
                                        p={2.5}
                                        isRequired
                                    />
                                </FormControl>
                                <FormControl id="password">
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            variant="filled"
                                            name="password"
                                            id="password"
                                            placeholder="•••••••••"
                                            rounded="xl"
                                            borderWidth="1px"
                                            borderColor="gray.300"
                                            color="gray.900"
                                            size="md"
                                            focusBorderColor="blue.500"
                                            w="full"
                                            p={2.5}
                                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                            isRequired
                                        />
                                        <InputRightElement>
                                            <IconButton aria-label="Show password" size="lg" variant="ghost"
                                                        icon={showPassword ? <IoMdEyeOff/> : <IoMdEye/>}
                                                        _focus={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                                        _hover={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                                        _active={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                                        onClick={() => setShowPassword(!showPassword)}/>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                                <FormControl id="confirm_password">
                                    <FormLabel>Confirm Password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirm_password"
                                            id="confirm_password"
                                            variant="filled"
                                            placeholder="•••••••••"
                                            rounded="xl"
                                            borderWidth="1px"
                                            borderColor="gray.300"
                                            color="gray.900"
                                            size="md"
                                            focusBorderColor="blue.500"
                                            w="full"
                                            p={2.5}
                                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                            isRequired
                                        />
                                        <InputRightElement>
                                            <IconButton aria-label="Show password" size="lg" variant="ghost"
                                                        icon={showConfirmPassword ? <IoMdEyeOff/> : <IoMdEye/>}
                                                        _focus={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                                        _hover={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                                        _active={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}/>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                                <Center>
                                    <Text>
                                        Already have an account?{' '}
                                        <Link color="blue.500" textDecoration="underline" href="/login">
                                            Log in here
                                        </Link>
                                    </Text>
                                </Center>
                                <Button type="submit" colorScheme="blue" size="lg">
                                    Register
                                </Button>
                            </VStack>
                        </form>
                    </Box>
                </Flex>
            </Box>
        </Center>
    );
}

export default Register;
