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
    Select,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {db} from "../../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";
import {register_clinic_admin} from "../../../../api/auth.js";
import {useNavigate} from "react-router-dom";
import {update_admin, update_email, update_password} from "../../../../api/admin.js";

export const ClinicAdminForm = ({user, self=false}) => {
    const {
        setValue,
		handleSubmit,
		register,
        trigger,
        clearErrors,
        getValues,
        reset,
        resetFields,
		formState: {
			errors
		}
	} = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [clinics, setClinics] = useState([]);
    const toast = useToast();

    const navigate = useNavigate();
    console.log(user);

    useEffect(() => {
        onValue(query(ref(db, "clinics")), (snapshot) => {
            const clinics = [];
            snapshot.forEach((childSnapshot) => {
                clinics.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });
            console.log(clinics);
            setClinics(clinics);
        });
    }, []);

    useEffect(() => {
        if (clinics.length > 0) {
            if (user) {
                setValue('name', user.name);
                setValue('email', user.email);
                setValue("clinic", user?.clinic);
            } else {
                setValue('name', null);
                setValue('email', null);
                setValue('clinic',  clinics?.[0]?.id);
            }
        } else {
            setValue('name', null);
            setValue('email', null);
            setValue('clinic',  '');
        }
    }, [user, clinics]);
    
    
    const onSubmit = async () => {
        let data = getValues();
        console.log("Submitting admin form", data);
        
        if (!user) {
            const valid = await trigger(['name', 'email', 'password', 'confirm_password']);
            const password = data["password"];
            const confirm_password = data["confirm_password"];
            
            if(!valid) {
                return;
            }
            
            if (password !== confirm_password) {
                alert("Passwords do not match!");
                return;
            }
            
            register_clinic_admin(data, true).then((res) => {
                console.log(res);
                if (res.error) {
                    toast({
                        title: "Error!",
                        description: "An error has occurred!",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top"
                    });
                } else {
                    toast({
                        title: "Success!",
                        description: "Clinic admin has been registered!",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "top"
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
                    position: "top"
                });
            });
        } else {
            const valid = await trigger(['name']);
            let update = {};
            
            if(!valid) {
                return;
            }
            
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
                            description: "An error has occurred!",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                            position: "top"
                        });
                    } else {
                        toast({
                            title: "Success!",
                            description: "User has been updated!",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                            position: "top"
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
                        position: "top"
                    });
                });
            }
        }
    }

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

    const handleEmailSubmit = async () => {
        const valid = await trigger(['new_email']);
        console.log("Submitting email modal")
        
        if(!valid) {
            onCloseEmailModal();
            return;
        }
        
        update_email(user, getValues('new_email')).then((res) => {
            console.log(res);
            if (res.error) {
                toast({
                    title: "Error!",
                    description: "An error has occurred!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
            } else {
                toast({
                    title: "Success!",
                    description: "Email has been updated!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
                onCloseEmailModal();
            }
        }).catch((err) => {
            console.log(err);
            toast({
                title: "Error!",
                description: "An error has occurred!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        });
        onCloseEmailModal();
    };

    const handlePasswordSubmit = async () => {
        const valid = await trigger(['new_password', 'new_confirm_password']);
        console.log("Submitting password modal");
        
        if(!valid) {
            onClosePasswordModal();
            return;
        }
        
        if (getValues('new_password') !== getValues('new_confirm_password')) {
            alert("Passwords do not match!");
            onClosePasswordModal();
            return;
        }
        
        update_password(user, getValues('new_password')).then((res) => {
            console.log(res);
            onClosePasswordModal();
            if (res.error) {
                toast({
                    title: "Error!",
                    description: "An error has occurred!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
            } else {
                toast({
                    title: "Success!",
                    description: "Password has been updated!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
                onClosePasswordModal();
            }
        }).catch((err) => {
            console.log(err);
            toast({
                title: "Error!",
                description: "An error has occurred!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        });
        onClosePasswordModal();
    };

    return (
        <form action="/api/register" method="post">
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
                <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900" id="clinic">
                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                        Which clinic does this user belong to?
                    </FormLabel>
                    <Select
                        variant="filled"
                        name="clinic"
                        id="clinic"
                        rounded="xl"
                        borderWidth="1px"
                        isRequired
                        borderColor="gray.300"
                        color="gray.900"
                        size="md"
                        focusBorderColor="blue.500"
                        defaultValue={user?.clinic}
                        {
                            ...register("clinic")
                        }
                    >
                        {clinics.map((clinic) => (
                            <option key={clinic.id} value={clinic.id} selected={clinic.id === user?.clinic}>
                                {clinic.name}
                            </option>
                        ))}
                    </Select>
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
                        isDisabled={!!user}
                        focusBorderColor="blue.500"
                        w="full"
                        p={2.5}
                        disabled={!!user}
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
                                    <form>
                                        <ModalOverlay 
                                            bg='blackAlpha.300'
                                            backdropFilter='blur(3px) hue-rotate(90deg)'
                                        />
                                        <ModalContent>
                                            <ModalHeader>Edit Email</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900" id="email" isInvalid={errors.new_email}>
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
                                                            ...register("new_email", {
                                                                required: "Email is required",
                                                            })
                                                        }
                                                    />
                                                    <FormErrorMessage>
                                                        {errors.new_email && errors.new_email.message}
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
                                    <form>
                                        <ModalOverlay 
                                            bg='blackAlpha.300'
                                            backdropFilter='blur(3px) hue-rotate(90deg)'
                                        />
                                        <ModalContent>
                                            <ModalHeader>Password Modal</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900" id="password" isInvalid={errors.new_password}>
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
                                                                ...register("new_password", {
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
                                                        {errors.new_password && errors.new_password.message}
                                                    </FormErrorMessage>
                                                </FormControl>
                                                <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900" id="confirm_password" isInvalid={errors.new_confirm_password}>
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
                                                                ...register("new_confirm_password", {
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
                                                        {errors.new_confirm_password && errors.new_confirm_password.message}
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
                    onClick={onSubmit}
                >
                    {
                        self ? "Save Changes" : (user ? "Edit Clinic Admin" : "Add Clinic Admin")
                    }
                </Button>     
            </Flex>
        </form>
    );
}