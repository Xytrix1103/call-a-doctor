import {
    Box,
    Flex,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Text,
    Link,
    FormControl,
    FormLabel,
    Center,
    VStack,
    Textarea,
} from '@chakra-ui/react';
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useContext, useState} from "react";
import {UserCtx, db, auth} from "../../App.jsx";

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Center minH="100vh">
            <Flex align="center" justify="space-between" w="100%">
                <Box p="5" w="50%" bg="white" boxShadow="lg" borderRadius="xl">
                    <Heading as="h1" size="xl" mb="7">
                        Call A Doctor
                    </Heading>
                    <Box textAlign="center">
                        <img
                        src="/static/svg/register-doctor.svg"
                        alt="Login"
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
                <Box p="5" w="50%">
                    <Heading as="h1" size="xl" mb="7">
                        Register
                    </Heading>
                    <form action="/api/register" method="post">
                        <VStack spacing="4">
                            <FormControl id="name">
                                <FormLabel>Name</FormLabel>
                                <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Username"
                                isRequired
                                />
                            </FormControl>
                            <FormControl id="email">
                                <FormLabel>Email</FormLabel>
                                <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="john.doe@gmail.com"
                                isRequired
                                />
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        placeholder="•••••••••"
                                        isRequired
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                    />
									<InputRightElement>
										<IconButton aria-label="Show password" size="lg" variant="ghost"
										            icon={showPassword ? <IoMdEyeOff/> : <IoMdEye/>}
										            _focus={{bg: "transparent", borderColor: "transparent", outline: "none"}}
										            _hover={{bg: "transparent", borderColor: "transparent", outline: "none"}}
										            _active={{bg: "transparent", borderColor: "transparent", outline: "none"}}
										            onClick={() => setShow(!showPassword)}/>
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
                                        placeholder="•••••••••"
                                        isRequired
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                    />
									<InputRightElement>
										<IconButton aria-label="Show password" size="lg" variant="ghost"
										            icon={showConfirmPassword ? <IoMdEyeOff/> : <IoMdEye/>}
										            _focus={{bg: "transparent", borderColor: "transparent", outline: "none"}}
										            _hover={{bg: "transparent", borderColor: "transparent", outline: "none"}}
										            _active={{bg: "transparent", borderColor: "transparent", outline: "none"}}
										            onClick={() => setShow(!showConfirmPassword)}/>
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
        </Center>
    );
}

export default Register;
