import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Text,
    useToast
} from '@chakra-ui/react';
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from 'react-router-dom';
import {AiOutlineArrowLeft} from "react-icons/ai";
import {useAuth} from "../../components/AuthCtx.jsx";

function AdminRegistry() {
    const {
		handleSubmit,
		register,
		formState: {
			errors, isSubmitting
		}
	} = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const {user, loading} = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleBack = () => {
		navigate('/admin/users');
	};
    
    const onSubmit = async (data) => {
        const password = data["password"];
        const confirm_password = data["confirm_password"];
        
        if (password !== confirm_password) {
            alert("Passwords do not match!");
            return;
        }
        // const res = await registerUser(data);
        
		// if (res) {
		// 	if (res.error) {
        //         toast({
        //             title: "Registration failed.",
        //             description: "Please try again with valid credentials.",
        //             status: "error",
        //             duration: 5000,
        //             isClosable: true,
        //         });
		// 	}
		// }
    }

    return (
        <Center h="auto" bg={"#f4f4f4"}>
            <Box w='85%' h='full'>
                <Flex 	
                    bg="white"
                    boxShadow="xl"
                    rounded="xl"
                    p={3}
                    gridGap={4}
                    gridTemplateColumns="1fr 1fr"
                >
                    <Box my={7} ml={5} w="full">
                        <Box ml={10}>
                            <Flex alignItems='center'>
                                <Box>
                                    <IconButton
                                        icon={<AiOutlineArrowLeft />}
                                        aria-label="Back"
                                        onClick={handleBack}
                                        bg="transparent"
                                    />
                                </Box>
                                <Text fontSize="xl" fontWeight="bold" ml={3}>
                                    Register Admin
                                </Text>                                
                            </Flex>
						</Box>
                        <Box textAlign="center" p={10}>
                            <Image
                                src="/src/assets/svg/register-doctor.svg"
                                alt="Register"
                                w="full"
                                h="auto"
                            />
                        </Box>
                    </Box>
                    <Box my={7} mr={5} w="full">
                        <form action="/api/register" method="post" onSubmit={handleSubmit(onSubmit)}>
                            <FormControl mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900" id="name" isInvalid={errors.name}>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                                    Name <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                </FormLabel>
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
                                        {
                                        ...register("name", {
                                            required: "Name is required",

                                        })
                                    }
                                />
                                <FormErrorMessage>
                                    {errors.name && errors.name.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900" id="email" isInvalid={errors.email}>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                                    Email <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                </FormLabel>
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
                                    {
                                        ...register("email", {
                                            required: "Email is required",

                                        })
                                    }
                                />
                                <FormErrorMessage>
                                    {errors.email && errors.email.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900"  id="phone_number" isInvalid={errors.phone_number}>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                                    Phone Number <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                </FormLabel>
                                <Input
                                    variant="filled"
                                    type="tel"
                                    name="phone_number"
                                    id="phone_number"
                                    placeholder="012-345-6789"
                                    rounded="xl"
                                    borderWidth="1px"
                                    borderColor="gray.300"
                                    color="gray.900"
                                    size="md"
                                    focusBorderColor="blue.500"
                                    w="full"
                                    p={2.5}
                                    {
                                        ...register("phone_number", {
                                            required: "Phone Number is required",
                                            pattern: {
                                                value: /^(\+?\d{1,3}[- ]?)?\d{10}$/,
                                                message: "Invalid phone number format",
                                            },
                                        })
                                    }
                                />
                                <FormErrorMessage>
                                    {errors.phone_number && errors.phone_number.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900"  id="password" isInvalid={errors.password}>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                                    Password <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                </FormLabel>
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
                                        {
                                            ...register("password", {
                                                required: "Password is required",
                                                pattern: {
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/,
                                                    message: "Invalid password format",
                                                },
                                            })
                                        }
                                    />
                                    <InputRightElement>
                                        <IconButton aria-label="Show password" size="lg" variant="ghost"
                                            icon={showPassword ? <IoMdEyeOff/> : <IoMdEye/>}
                                            _focus={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                            _hover={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                            _active={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex="-1"
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>
                                    {errors.password && errors.password.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900"  id="confirm_password" isInvalid={errors.name}>
                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                                    Confirm Password <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                </FormLabel>
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
                                        {
                                            ...register("confirm_password", {
                                                required: "Confirm Password is required",
                                                pattern: {
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/,
                                                    message: "Invalid password format",
                                                },
                                            })
                                        }
                                    />
                                    <InputRightElement>
                                        <IconButton aria-label="Show password" size="lg" variant="ghost"
                                            icon={showConfirmPassword ? <IoMdEyeOff/> : <IoMdEye/>}
                                            _focus={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                            _hover={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                            _active={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            tabIndex="-1"
                                        />  
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>
                                    {errors.confirm_password && errors.confirm_password.message}
                                </FormErrorMessage>
                            </FormControl>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                rounded="xl"
                                px={4}
                                py={2}
                                mt={6}
                                w="full"
                            >
                                Register
                            </Button>
                        </form>
                    </Box>
                </Flex>
            </Box>
        </Center>
    );
}

export default AdminRegistry;
