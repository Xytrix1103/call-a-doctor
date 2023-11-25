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
    Text,
    useToast,
    Select,
} from '@chakra-ui/react';
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {db} from "../../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";

export const ClinicAdminForm = ({user}) => {
    console.log("Clinic Admin Form");
    const {
        setValue,
		handleSubmit,
		register,
		formState: {
			errors
		}
	} = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [clinics, setClinics] = useState([]);
    const [error, setError] = useState(null);
    const toast = useToast();
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
        }
    }, [user]);

    const onSubmit = async (data) => {
        console.log("Submitting clinic admin form");
        const password = data["password"];
        const confirm_password = data["confirm_password"];
        
        if (password !== confirm_password) {
            alert("Passwords do not match!");
            return;
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
                        {
                            ...register("clinic")
                        }
                    >
                        {clinics.map((clinic) => (
                            <option key={clinic.id} value={clinic.name} selected={clinic.id === user.clinic}>
                                {clinic.name}
                            </option>
                        ))}
                    </Select>
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