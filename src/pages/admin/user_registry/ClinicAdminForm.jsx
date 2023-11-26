import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Select,
    Text,
    useToast,
} from '@chakra-ui/react';
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {db} from "../../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";
import {register_clinic_admin} from "../../../../api/auth.js";
import {useNavigate} from "react-router-dom";
import {update_admin} from "../../../../api/admin.js";

export const ClinicAdminForm = ({user}) => {
    console.log("Clinic Admin Form");
    const {
        setValue,
		handleSubmit,
		register,
        trigger,
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
        if (user) {
            setValue('name', user.name);
            setValue('email', user.email);
            setValue('clinic', user.clinic);
        } else {
            setValue('name', null);
            setValue('email', null);
            setValue('clinic', clinics[0].id);
        }
    }, [user]);
    
    
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
            
            register_clinic_admin(data, true).then((res) => {
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
                        description: "Clinic admin has been registered!",
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
            await trigger(['name']);
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
                    type="submit"
                    colorScheme="blue"
                    rounded="xl"
                    px={4}
                    py={2}
                    mt={8}
                    mb={4}
                    w="full"
                >
                    Add Clinic Admin
                </Button>     
            </Flex>
        </form>
    );
}