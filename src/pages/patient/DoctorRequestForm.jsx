import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Select,
    Text,
    Textarea,
    Switch,
} from '@chakra-ui/react'
import {useForm} from "react-hook-form";
import {useRef, useState, useEffect} from "react";
import {auth, db} from "../../../api/firebase.js";
import {onValue, query, ref, get} from "firebase/database";

function DoctorRequestForm() {
    const {
		handleSubmit,
        setValue,
		register,
		formState: {
			errors, isSubmitting
		}
	} = useForm();
    const [usePersonalDetails, setUsePersonalDetails] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                // User is signed in
                const uid = authUser.uid;

                // Get user data from Realtime Database using the uid
                const userRef = ref(db, `users/${uid}`);

                get(userRef).then((snapshot) => {
                    const userData = snapshot.val();
                    setUser(userData);
                    console.log(userData);
                }).catch((error) => {
                    console.error("Error getting user data:", error);
                });
            } else {
                // User is signed out
                setUser(null);
            }
        });
    
        // Cleanup the subscription when the component unmounts
        return () => unsubscribe();
    }, []); // Empty dependency array means this effect runs once on mount

    const handleUsePersonalDetailsChange = () => {
        setUsePersonalDetails(!usePersonalDetails);
        if (!usePersonalDetails) {
            setValue("patient_name", user.name);
            setValue("age", user.dob);
            setValue("gender", user.gender);
            setValue("address", user.address);
        } else {
            setValue("patient_name", "");
            setValue("age", "");
            setValue("gender", "");
            setValue("address", "");
        }
    };

	const onSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData(e.target);
		
		if (res) {
			console.log("Requesting a doctor");
		}
	}
	
    return (
        <Center w="100%" h="100%" bg="#f4f4f4">
            <Box
                w="85%"
                bg="white"
                boxShadow="xl"
                rounded="xl"
                px={5}
                py={7}
                gridGap={4}
                gridTemplateColumns="1fr 1fr"
            >
                <form action="/" method="post" onSubmit={handleSubmit(onSubmit)}>
                    <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        my={7}
                    >
                        <Box mx={5} w="full">
                            <Text fontSize="xl" fontWeight="bold">
                                Doctor Request Form
                            </Text>
                        </Box>
                        <Flex
                            alignItems='center'
                            w='full'
                            justifyContent='end'
                        >
                            <Text
                                letterSpacing='wide'
                            >
                                Use personal details?
                            </Text>
                            <Box mx={5}> 
                                <Switch 
                                    id='use-personal-details-switch' 
                                    onChange={handleUsePersonalDetailsChange}
                                    isChecked={usePersonalDetails}   
                                />
                            </Box>                            
                        </Flex>
                    </Flex>
            
                    <Flex>
                        <Box mx={5} w="full">
                            <Box>
                                <FormControl isInvalid={errors.patient_name}>
                                    <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                        Patient Name
                                    </FormLabel>
                                    <Input
                                        variant="filled"
                                        type="text"
                                        id="name"
                                        {
                                            ...register("patient_name", {
                                                required: "Patient name cannot be empty",
                                            })
                                        }
                                        placeholder="John Doe"
                                        defaultValue=""
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        size="md"
                                        focusBorderColor="blue.500"
                                        w="full"
                                        p={2.5}
                                    />
                                    <FormErrorMessage>
                                        {errors.patient_name && errors.patient_name.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </Box>
                            <Flex alignItems="center" justifyContent="space-between" mt={6}>
                                <Box flex="1" mr={4}>
                                    <FormControl isInvalid={errors.date_of_birth}>
                                        <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                            Date of Birth
                                        </FormLabel>
                                        <Input
                                            variant="filled"
                                            type="date"
                                            id="date_of_birth"
                                            {
                                                ...register("date_of_birth", {
                                                    required: "Date of birth cannot be empty",
                                                })
                                            }
                                            defaultValue=""
                                            rounded="xl"
                                            borderWidth="1px"
                                            borderColor="gray.300"
                                            color="gray.900"
                                            size="md"
                                            focusBorderColor="blue.500"
                                            w="full"
                                            p={2.5}
                                        />
                                        <FormErrorMessage>
                                            {errors.date_of_birth && errors.date_of_birth.message}
                                        </FormErrorMessage>
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
                            <Box mt={6}>
                                <FormControl isInvalid={errors.address}>
                                    <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                        Address
                                    </FormLabel>
                                    <Textarea
                                        variant="filled"
                                        type="text"
                                        id="address"
                                        {
                                            ...register("address", {
                                                required: "Patient address cannot be empty",
                                            })
                                        }
                                        placeholder="123 Main St, New York, NY 10030"
                                        defaultValue=""
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        size="md"
                                        focusBorderColor="blue.500"
                                        w="full"
                                        p={2.5}
                                    />
                                    <FormErrorMessage>
                                        {errors.address && errors.address.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </Box>
                        </Box>
                        <Box mx={5} w="full">
                            <Box>
                                <FormControl isInvalid={errors.appointment_date}>
                                    <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                        Appointment Date
                                    </FormLabel>
                                    <Input
                                        variant="filled"
                                        type="date"
                                        id="appointment_date"
                                        {
                                            ...register("appointment_date", {
                                                required: "Appointment date cannot be empty",
                                            })
                                        }
                                        defaultValue=""
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        size="md"
                                        focusBorderColor="blue.500"
                                        w="full"
                                        p={2.5}
                                    />
                                    <FormErrorMessage>
                                        {errors.appointment_date && errors.appointment_date.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </Box>
                            <Box mt={6}>
                                <FormControl isInvalid={errors.appointment_time}>
                                    <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                        Appointment Time
                                    </FormLabel>
                                    <Input
                                        variant="filled"
                                        type="time"
                                        id="appointment_time"
                                        {
                                            ...register("appointment_time", {
                                                required: "Appointment time cannot be empty",
                                            })
                                        }
                                        placeholder="John Doe"
                                        defaultValue=""
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        size="md"
                                        focusBorderColor="blue.500"
                                        w="full"
                                        p={2.5}
                                    />
                                    <FormErrorMessage>
                                        {errors.appointment_time && errors.appointment_time.message}
                                    </FormErrorMessage>
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
