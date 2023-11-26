import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {register_admin} from "../../../../api/auth.js";
import {useNavigate} from "react-router-dom";
import {update_admin} from "../../../../api/admin.js";

export const AdminForm = ({user, self=false}) => {
    console.log("AdminForm");
    const {
        setValue,
		handleSubmit,
		register,
        getValues,
        trigger,
		formState: {
			errors
		}
	} = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log("Submitting admin form", data);
        
        if (!user) {
            await trigger();
            const password = data["password"];
            const confirm_password = data["confirm_password"];
            
            if (password !== confirm_password) {
                alert("Passwords do not match!");
                return;
            }
            
            register_admin(data).then((res) => {
                console.log(res);
                if (res.error) {
                    toast({
                        title: "Error!",
                        description: res.error,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "Success!",
                        description: "Admin has been registered!",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                    navigate('/admin/users');
                }
            }).catch((err) => {
                console.log(err);
                toast({
                    title: "Error!",
                    description: "An error has occurred!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });
        } else {
            await trigger(['name', 'phone']);
            let update = {};
            
            //loop thru form values
            for (const [key, value] of Object.entries(data)) {
                if (value !== user[key] && key !== 'confirm_password' && key !== 'password' && key !== 'email') {
                    update[key] = value;
                }
            }
            
            if (Object.keys(update).length > 0) {
                update_admin(user.uid, update).then((res) => {
                    console.log(res);
                    if (res.error) {
                        toast({
                            title: "Error!",
                            description: res.error,
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    } else {
                        toast({
                            title: "Success!",
                            description: "User has been updated!",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                        });
                        navigate('/admin/users');
                    }
                }).catch((err) => {
                    console.log(err);
                    toast({
                        title: "Error!",
                        description: "An error has occurred!",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                });
            }
        }
    }

    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            setValue('email', user.email);
            setValue('phone', user.phone);
        } else {
            setValue('name', null);
            setValue('email', null);
            setValue('phone', null);
        }
    }, [user]);

    const {
        isOpen: isPasswordModalOpen,
        onOpen: onOpenPasswordModal,
        onClose: onClosePasswordModal,
    } = useDisclosure();

    const {
        isOpen: isEmailModalOpen,
        onOpen: onOpenEmailModal,
        onClose: onCloseEmailModal,
    } = useDisclosure();

    const handleOpenPasswordModal = () => {
        onOpenPasswordModal();
    };

    const handleOpenEmailModal = () => {
        onOpenEmailModal();
    };

    const handleEmailSubmit = (data) => {
        console.log(data);
        console.log("Submitting email modal")

    };

    const handlePasswordSubmit = (data) => {
        console.log(data);
        console.log("Submitting password modal");

    };

    return (
        <form action="/api/register" method="post" onSubmit={handleSubmit(onSubmit)}>
            <Flex w='full' h='full' direction='column' justifyContent='center' alignItems='center' px={5}>
                <FormControl mb={2} fontSize="sm" fontWeight="medium" color="gray.900" id="name" isInvalid={errors.name}>
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
                <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900"  id="phone_number" isInvalid={errors.phone}>
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
                            ...register("phone", {
                                required: "Phone Number is required",
                                pattern: {
                                    value: /^(\+?\d{1,3}[- ]?)?\d{10}$/,
                                    message: "Invalid phone number format",
                                },
                            })
                        }
                    />
                    <FormErrorMessage>
                        {errors.phone && errors.phone.message}
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
                        disabled={!!user}
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

                {
                    user && (
                        <>
                            <Flex mt={6} w='full' justifyContent='space-between' alignItems='center' gap={10}>
                                <Button 
                                    w='full' 
                                    onClick={(e) => {
                                        handleOpenEmailModal();
                                    }}
                                    _hover={{ transform: 'scale(1.02)' }}
                                    _focus={{ boxShadow: 'none', outline: 'none' }}    
                                >
                                    Edit Email
                                </Button>
                                <Modal isOpen={isEmailModalOpen} onClose={onCloseEmailModal} size='xl' isCentered>
                                    <form onSubmit={handleSubmit(handleEmailSubmit)}> 
                                        <ModalOverlay 
                                            bg='blackAlpha.300'
                                            backdropFilter='blur(3px) hue-rotate(90deg)'
                                        />
                                        <ModalContent>
                                            <ModalHeader>Edit Email</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
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
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button colorScheme="blue" type='button' onClick={handleEmailSubmit}>
                                                    Save Changes
                                                </Button>
                                            </ModalFooter>
                                        </ModalContent>                        
                                    </form>
                                </Modal>  

                                <Button 
                                    w='full' 
                                    onClick={(e) => {
                                        handleOpenPasswordModal();
                                    }}
                                    _hover={{ transform: 'scale(1.02)' }}
                                    _focus={{ boxShadow: 'none', outline: 'none' }}    
                                >
                                    Edit Password
                                </Button>
                                <Modal isOpen={isPasswordModalOpen} onClose={onClosePasswordModal} size='xl' isCentered>
                                    <form onSubmit={handleSubmit(handlePasswordSubmit)}>
                                        <ModalOverlay 
                                            bg='blackAlpha.300'
                                            backdropFilter='blur(3px) hue-rotate(90deg)'
                                        />
                                        <ModalContent>
                                            <ModalHeader>Password Modal</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900" id="password" isInvalid={errors.password}>
                                                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                                                        Password
                                                    </FormLabel>
                                                    <InputGroup>
                                                        <Input
                                                            type={showPassword ? 'text' : 'password'}
                                                            variant="filled"
                                                            name="password"
                                                            placeholder="•••••••••"
                                                            rounded="xl"
                                                            borderWidth="1px"
                                                            borderColor="gray.300"
                                                            color="gray.900"
                                                            size="md"
                                                            focusBorderColor="blue.500"
                                                            {
                                                                ...register("password", {
                                                                    required: "Password is required",
                                                                    pattern: {
                                                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                                        message: "Invalid password format",
                                                                    },            
                                                                })
                                                            }
                                                        />
                                                        <InputRightElement>
                                                        <IconButton
                                                            aria-label="Show password"
                                                            size="lg"
                                                            variant="ghost"
                                                            icon={showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            tabIndex="-1"
                                                        />
                                                        </InputRightElement>
                                                    </InputGroup>
                                                    <FormHelperText fontSize="xs">
                                                        Minimum eight characters, at least one uppercase letter, one lowercase letter,
                                                        one number and one special character
                                                    </FormHelperText>
                                                    <FormErrorMessage>
                                                        {errors.password && errors.password.message}
                                                    </FormErrorMessage>
                                                </FormControl>
                                                <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900" id="confirm_password" isInvalid={errors.confirm_password}>
                                                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                                                        Confirm Password
                                                    </FormLabel>
                                                    <InputGroup>
                                                        <Input
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            name="confirm_password"
                                                            variant="filled"
                                                            placeholder="•••••••••"
                                                            rounded="xl"
                                                            borderWidth="1px"
                                                            borderColor="gray.300"
                                                            color="gray.900"
                                                            size="md"
                                                            focusBorderColor="blue.500"
                                                            {
                                                                ...register("confirm_password", {
                                                                    required: "Confirm password is required",
                                                                    pattern: {
                                                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                                        message: "Invalid password format",
                                                                    },            
                                                                })
                                                            }
                                                        />
                                                        <InputRightElement>
                                                        <IconButton
                                                            aria-label="Show password"
                                                            size="lg"
                                                            variant="ghost"
                                                            icon={showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            tabIndex="-1"
                                                        />
                                                        </InputRightElement>
                                                    </InputGroup>
                                                    <FormErrorMessage>
                                                        {errors.confirm_password && errors.confirm_password.message}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button colorScheme="blue" type='button' onClick={handlePasswordSubmit}>
                                                    Save Changes
                                                </Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </form>
                                </Modal>
                            </Flex>
                        </>
                    )
                }

                {
                    !user && (
                        <>
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
                        </>
                    )
                }
                <Button
                    colorScheme="blue"
                    rounded="xl"
                    px={4}
                    py={2}
                    mt={8}
                    mb={4}
                    w="full"
                    type="submit"
                >
                    {
                        self ? "Save Changes" : (user ? "Edit Admin" : "Add Admin")
                    }
                </Button>                    
            </Flex>
        </form>
    );
}