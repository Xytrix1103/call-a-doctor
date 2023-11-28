import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    Select,
    Switch,
    Text,
    Textarea,
    useToast,
} from '@chakra-ui/react'
import {useForm} from "react-hook-form";
import {memo, useEffect, useRef, useState} from "react";
import {useAuth} from "../../components/AuthCtx.jsx";
import {Autocomplete, DirectionsRenderer, GoogleMap, InfoWindow, Marker, useLoadScript} from '@react-google-maps/api';
import {useParams} from 'react-router-dom';
import {BiLinkExternal, BiSearchAlt2} from "react-icons/bi";
import {db} from "../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";
import {request_doctor} from "../../../api/patient.js";

const Map = (props) => {
    const { place_id, setUserHomePlace, usePersonalDetails, user } = props;
    const mapStyle = {
        height: '350px',
        width: '100%',
    };
    
    const [libs, _] = useState(["places"]);
    const [center, setCenter] = useState({
        lat: 5.4164,
        lng: 100.3327,
    });
    
    const [clinic, setClinic] = useState(null);
    const [directions, setDirections] = useState(null);
    const inputRef = useRef();
    const [homePlace, setHomePlace] = useState(null);
    const [map, setMap] = useState(null);
    const [services, setServices] = useState({
        directions: null,
        places: null,
        autocomplete: null,
    });
  
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyCxkZ_qonH-WY9cbiHZsUgp9lE3PdkWH_A',
        libraries: libs,
    });
  
    const handlePlaceSelect = () => {
        if (inputRef.current && inputRef.current.getPlace) {
            if (inputRef.current.getPlace().place_id) {
                setHomePlace(inputRef.current.getPlace());
            }
        } else {
            console.log("No place selected");
        }
    };
  
    const getMapsLink = () => {
        if (clinic) {
            const { name } = clinic;
            return `https://www.google.com/maps/search/?api=1&query=${name}`;
        }
    };
  
    const handleMapLoad = (m) => {
        console.log("Map loaded");
        setMap(m);
    };
  
    const fetchPlaceDetails = (place_id) => {
        console.log("Fetching place details");
        console.log(place_id)
        services?.places?.getDetails(
            {
                placeId: place_id,
            },
            (result, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setClinic(result);
                } else {
                    console.error(`Error retrieving place details: Status - ${status}`);
                }
            }
        );
    };

    const fetchHomeDetails = (place_id) => {
        console.log("Fetching home details");
        console.log(place_id);
        
        services?.places?.getDetails(
            {
                placeId: place_id,
            },
            (result, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    if(usePersonalDetails) {
                        result = {
                            ...result,
                            formatted_address: user.address,
                        }
                    }
                    setHomePlace(result);
                    console.log(result);
                } else {
                    console.error(`Error retrieving place details: Status - ${status}`);
                }
            }
        );
    };
  
    const fetchDirections = (clinic, home) => {
        console.log("Fetching directions");
        console.log("Destination",clinic);
        console.log("Origin",home);
        const homeLocation = new window.google.maps.LatLng(
            home.geometry.location.lat(),
            home.geometry.location.lng()
        );
        const clinicLocation = new window.google.maps.LatLng(
            clinic.geometry.location.lat(),
            clinic.geometry.location.lng()
        );
        
        services?.directions?.route(
            {
                origin: homeLocation,
                destination: clinicLocation,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`Error retrieving directions: Status - ${status}`);
                }
            }
        ).then(r => console.log(r));
    };
    
    useEffect(() => {
        console.log("home place: ", homePlace);
        
        if (clinic && homePlace) {
            console.log("Fetching directions", clinic, homePlace);
            fetchDirections(clinic, homePlace);
        } else {
            setDirections(null);
        }
        
        setUserHomePlace(homePlace);
    }, [homePlace]);
    
    useEffect(() => {
        if(map) {
            setServices({
                directions: new window.google.maps.DirectionsService(),
                places: new window.google.maps.places.PlacesService(map),
                autocomplete: new window.google.maps.places.AutocompleteService(),
            });
        }
    }, [map]);
    
    useEffect(() => {
        if(services?.places) {
            fetchPlaceDetails(place_id, map);
        }
    }, [services]);
    
    useEffect(() => {
        if (isLoaded && map && clinic) {
            if (!usePersonalDetails) {
                setHomePlace(null);
                if(clinic) {
                    setCenter({
                        lat: clinic.geometry.location.lat(),
                        lng: clinic.geometry.location.lng(),
                    });
                }
            } else {
                if(user.place_id) {
                    console.log("Fetching home details");
                    fetchHomeDetails(user.place_id, map);
                } else {
                    console.log("Fetching home detail predictions");
                    
                    services?.autocomplete?.getPlacePredictions(
                        { input: user.address },
                        (predictions, status) => {
                            console.log(predictions);
                            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
                                const place_id = predictions[0].place_id;
                                console.log("using user home: ", place_id);
                                fetchHomeDetails(place_id, map);
                            } else {
                                console.error(`Error retrieving place details: Status - ${status}`);
                            }
                        }
                    ).then(r => console.log(r));
                }
            }
        }
    }, [usePersonalDetails, user, isLoaded, map, clinic]);
  
    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading maps";
  
    return (
        <Box>
            <Box
                mb={3}
                mt={2}
                w="full"
            >
                <Autocomplete
                    onLoad={(autocomplete) => {
                        inputRef.current = autocomplete;
                        autocomplete.setFields(["geometry", "formatted_address", "place_id", "name", "formatted_phone_number"]);
                    }}
                    onPlaceChanged={() => {
                        handlePlaceSelect();
                    }}
                >
                    <InputGroup size="md">
                    <InputLeftElement
                        pointerEvents="none"
                        children={<BiSearchAlt2 color="gray.500" />}
                    />
                    <Input
                        type='text'
                        placeholder="Search for location..."
                        focusBorderColor='blue.500'
                        disabled={usePersonalDetails}
                        display={usePersonalDetails ? "none" : "block"}
                    />
                    </InputGroup>
                </Autocomplete>
            </Box>
            <GoogleMap
                onLoad={handleMapLoad}
                center={center}
                zoom={15}
                mapContainerStyle={mapStyle}
                options={{
                    mapTypeControl: false,
                }}
            >
                <>
                    {clinic && (
                        <>
                            <Marker position={{ lat: clinic.geometry.location.lat(), lng: clinic.geometry.location.lng() }} />
                            <InfoWindow position={{ lat: clinic.geometry.location.lat() + 0.0015, lng: clinic.geometry.location.lng() }}>
                                <Box p={1} maxW="sm">
                                    <Text fontSize="sm" fontWeight="medium">
                                        {clinic.name}
                                    </Text>
                                    <Text fontSize="xs" fontWeight="medium" color="gray.500" mt={1} mb={2}>
                                        {clinic.formatted_address}
                                    </Text>
                                    <Link href={getMapsLink()} isExternal target="_blank" rel="noreferrer" _hover={{ textDecoration: "none" }} textDecoration="none" onClick={(e) => e.stopPropagation()}>
                                        <HStack spacing={1} fontSize="xs" fontWeight="medium" color="blue.500">
                                            <Text outline="none">View on Google Maps</Text>
                                            <BiLinkExternal />
                                        </HStack>
                                    </Link>
                                </Box>
                            </InfoWindow>
                        </>
                    )}
                    {directions && <DirectionsRenderer directions={directions} />}
                </>
            </GoogleMap>
        </Box>
    );
}

const MemoMap = memo(Map);

const FormSection = (props) => {
    const {form, usePersonalDetails, setUsePersonalDetails, onSubmit, user, clinic, setUserHomePlace} = props;
    
    const {
        handleSubmit,
        setValue,
        register,
        watch,
        resetField,
        formState: {
            errors
        }
    } = form;
    
    return (
        <form action="/" method="post">
            <Flex
                alignItems="center"
                justifyContent="space-between"
                mb={4}
            >
                <Box mx={5} w="full">
                    <Flex alignItems="center">
                        <Box
                            w="56"
                            bgImage={clinic.image}
                            bgSize="cover"
                            bgPosition="center"
                            rounded={'lg'}
                            h="32"
                            mr={5}
                        >
                        </Box>
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold" letterSpacing='wide'>
                                Doctor Request Form
                            </Text>
                            <Text fontSize="xl" fontWeight="semibold" letterSpacing="wide" mt={2}>
                                {clinic.name}
                            </Text>
                            <Box
                                color="gray.500"
                                fontWeight="semibold"
                                letterSpacing="wide"
                                fontSize="sm"
                                textTransform="uppercase"
                                mt={2}
                            >
                                { clinic.specialty ? clinic.specialty : 'General Clinic' }
                            </Box>
                        </Box>
                    </Flex>
                </Box>
                <Flex direction='column' gap={2} justifyContent={'end'} alignItems={'center'} w="30%">
                    <Flex>
                        <Text letterSpacing='wide' >
                            Use personal details?
                        </Text>
                        <Box mx={5}>
                            <Switch
                                id='use-personal-details-switch'
                                onChange={() => setUsePersonalDetails(!usePersonalDetails)}
                                isChecked={usePersonalDetails}
                            />
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
            <Flex>
                
                <Box mx={5} w="full">
                    <Box>
                        <FormControl isInvalid={errors.patient_name}>
                            <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                Patient Name <Text as="span" color="red.500">*</Text>
                            </FormLabel>
                            <Input
                                variant="filled"
                                type="text"
                                id="patient_name"
                                {
                                    ...register("patient_name", {
                                        required: "Patient name cannot be empty",
                                    })
                                }
                                placeholder="John Doe"
                                isDisabled={usePersonalDetails}
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
                    <Box mt={6}>
                        <FormControl isInvalid={errors.contact}>
                            <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                Contact Number <Text as="span" color="red.500">*</Text>
                            </FormLabel>
                            <Input
                                variant="filled"
                                type="text"
                                id="name"
                                {
                                    ...register("contact", {
                                        required: "Contact cannot be empty",
                                    })
                                }
                                placeholder="0123456789"
                                isDisabled={usePersonalDetails}
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
                                {errors.contact && errors.contact.message}
                            </FormErrorMessage>
                        </FormControl>
                    </Box>
                    <Flex alignItems="center" justifyContent="space-between" mt={6}>
                        <Box flex="1" mr={4}>
                            <FormControl isInvalid={errors.dob}>
                                <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                    Date of Birth <Text as="span" color="red.500">*</Text>
                                </FormLabel>
                                <Input
                                    variant="filled"
                                    type="date"
                                    id="dob"
                                    {
                                        ...register("dob", {
                                            required: "Date of birth cannot be empty",
                                        })
                                    }
                                    isDisabled={usePersonalDetails}
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
                                    {errors.dob && errors.dob.message}
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
                                    isDisabled={usePersonalDetails}
                                    focusBorderColor="blue.500"
                                    w="full"
                                    {
                                        ...register("gender")
                                    }
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
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
                                isDisabled={usePersonalDetails}
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
                    <Box mt={6}>
                        <FormControl isInvalid={errors.appointment_time}>
                            <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                Appointment Time
                            </FormLabel>
                            <Select
                                variant="filled"
                                name="appointment_time"
                                id="appointment_time"
                                rounded="xl"
                                borderWidth="1px"
                                borderColor="gray.300"
                                color="gray.900"
                                size="md"
                                focusBorderColor="blue.500"
                                {
                                    ...register("appointment_time")
                                }
                            >
                                <option value="8AM-10AM">8 AM to 10 AM</option>
                                <option value="10AM-12PM">10 AM to 12 PM</option>
                                <option value="12PM-2PM">12 PM to 2 PM</option>
                                <option value="2PM-4PM">2 PM to 4 PM</option>
                                <option value="4PM-6PM">4 PM to 6 PM</option>
                                <option value="6PM-8PM">6 PM to 8 PM</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.appointment_time && errors.appointment_time.message}
                            </FormErrorMessage>
                        </FormControl>
                    </Box>
                    <Box mt={6}>
                        <FormControl isInvalid={errors.illness_description}>
                            <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                Illness Description <Text as="span" color="red.500">*</Text>
                            </FormLabel>
                            <Textarea
                                variant="filled"
                                type="text"
                                id="illness_description"
                                {
                                    ...register("illness_description", {
                                        required: "Patient illness description cannot be empty",
                                    })
                                }
                                placeholder="Enter a description for your illness here..."
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
                                {errors.illness_description && errors.illness_description.message}
                            </FormErrorMessage>
                        </FormControl>
                    </Box>
                </Box>
                <Box mx={5} w="full">
                    <Box w="full">
                        <Box
                            w="full"
                            rounded={'lg'}
                            h="430px"
                        >
                            <MemoMap place_id={clinic.place_id} setUserHomePlace={setUserHomePlace} usePersonalDetails={usePersonalDetails} user={user} />
                        </Box>
                    </Box>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        colorScheme="blue"
                        rounded="xl"
                        px={4}
                        py={2}
                        mt={5}
                        w="full"
                    >
                        Submit Request
                    </Button>
                </Box>
            </Flex>
        </form>
    );
}

const MemoFormSection = memo(FormSection);

const DoctorRequestForm = () => {
    const form = useForm();
    const {
        handleSubmit,
        setValue,
        resetField,
    } = form;
    
    const toast = useToast();
    
    const [usePersonalDetails, setUsePersonalDetails] = useState(true);
    const {user, loading} = useAuth();
    const [clinic, setClinic] = useState({});
    const [userHomePlace, setUserHomePlace] = useState(null);
    
    const {id} = useParams();
    
    useEffect(() => {
        onValue(query(ref(db, `clinics/${id}`)), (snapshot) => {
	        const data = snapshot.val();
            setClinic(data);
            console.log(data);
        });
    }, []);

	const onSubmit = async (data) => {
        if(!userHomePlace) {
            toast({
                title: "Unable to submit request.",
                description: "Please select your location in the map.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        
        data = form.getValues();
        console.log(data);
        
        let req = {
            clinic: id,
            uid: user.uid,
            illness_description: data.illness_description,
            appointment_time: data.appointment_time,
        };
        
        if(!usePersonalDetails) {
            req = {
                ...req,
                patient: {
                    name: data.patient_name,
                    dob: data.dob,
                    address: data.address,
                    contact: data.contact,
                    gender: data.gender,
                    place_id: userHomePlace.place_id,
                }
            }
        }
        
        console.log(req);
        
        await request_doctor(req).then(r => {
            if (r.success) {
                toast({
                    title: "Request submitted.",
                    description: "Please wait for the clinic to accept your request.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                });
            } else {
                toast({
                    title: "Unable to submit request.",
                    description: "Please try again later.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                });
            }
        })
        .catch(e => {
            console.log(e);
            toast({
                title: "Unable to submit request.",
                description: "Please try again later.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
        });
	}
    
    useEffect(() => {
        if (usePersonalDetails) {
            setValue("patient_name", user.name);
            setValue("dob", user.dob);
            setValue("address", user.address);
            setValue("contact", user.contact);
        } else {
            resetField("patient_name");
            resetField("dob");
            resetField("address");
            resetField("contact");
        }
    }, [usePersonalDetails]);
    
	
    return (
        <Center w="100%" h="auto" bg="#f4f4f4">
            <Box
                w="85%"
                bg="white"
                boxShadow="xl"
                rounded="xl"
				px={5}
                py={7}
				gap={6}
                gridTemplateColumns="1fr 1fr"
            >
            <MemoFormSection form={form} usePersonalDetails={usePersonalDetails} setUsePersonalDetails={setUsePersonalDetails} onSubmit={onSubmit} user={user} clinic={clinic} setUserHomePlace={setUserHomePlace} />
            </Box>
        </Center>
    );
}

export default DoctorRequestForm;
