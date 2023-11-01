import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    Image,
    Input,
    Textarea,
    InputGroup,
    InputRightElement,
    Link,
    Text,
    VStack
} from '@chakra-ui/react';
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useEffect, useState} from "react";
import {useAuth} from "../../components/AuthCtx.jsx";
import {Navigate} from "react-router-dom";

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {user, register} = useAuth();
    
    useEffect(() => {
        if (user) return <Navigate to="/" />;
    }, [user]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const password = data.get("password");
        const confirm_password = data.get("confirm_password");
        
        if (password !== confirm_password) {
            alert("Passwords do not match!");
            return;
        }
        const res = await register(Object.fromEntries(data.entries()));
        
        if (res.error) {
            alert(res.error);
        } else {
            window.location.href = "/";
        }
    }

    return (
        <Center minH="100vh" bg={"#f4f4f4"}>
            <Box w='67%' my={6}>
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
                        <form action="/api/register" method="post" onSubmit={handleSubmit}>
                            <VStack spacing="5">
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
                                <FormControl id="address">
                                    <FormLabel>Address</FormLabel>
                                    <Textarea
                                        variant="filled"
                                        name="address"
                                        id="address"
                                        placeholder="Enter your address here..."
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        size="md"
                                        isRequired
                                        focusBorderColor="blue.500"
                                        w="full"
                                        p={2.5}
                                        rows={5}
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
                                    <FormHelperText>Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character</FormHelperText>
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
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    rounded="xl"
                                    px={4}
                                    py={2}
                                    mt={7}
                                    w="full"
                                >
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
