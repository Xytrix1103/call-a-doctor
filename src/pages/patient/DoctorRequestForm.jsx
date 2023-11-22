import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
    Switch,
    Text,
    Link,
    HStack,
    InputGroup,
    InputLeftElement,
    Textarea,
} from '@chakra-ui/react'
import {set, useForm} from "react-hook-form";
import {useEffect, useState, useRef} from "react";
import {useAuth} from "../../components/AuthCtx.jsx";
import {GoogleMap, Marker, useLoadScript, InfoWindow, DirectionsRenderer, Autocomplete} from '@react-google-maps/api';
import {NavLink, useParams} from 'react-router-dom';
import {BiLinkExternal, BiSearchAlt2} from "react-icons/bi";
import {db} from "../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";

function Map({ placeId, onDistanceChange, onNewHome, useHome, user }) {
    const mapStyle = {
        height: '350px',
        width: '100%',
    };
    const libs = ['places'];
    const [mapRef, setMapRef] = useState(null);
    const [center, setCenter] = useState({
        lat: 5.4164,
        lng: 100.3327,
    });
    const [clinicLocation, setClinicLocation] = useState(null);
    const [home, setHome] = useState(null);
    const [name, setName] = useState('');
    const [formattedAddress, setFormattedAddress] = useState('');
    const [destinationCoordinates, setDestinationCoordinates] = useState(null);
    const [distance, setDistance] = useState(null);
    const [directions, setDirections] = useState(null);
    const inputRef = useRef();
  
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyCxkZ_qonH-WY9cbiHZsUgp9lE3PdkWH_A',
        libraries: libs,
    });
  
    const handlePlaceSelect = () => {
        return new Promise((resolve) => {
            if (inputRef.current && inputRef.current.getPlace) {
                const place = inputRef.current.getPlace();

                setHome(place);
                console.log(place);
                resolve(place);
            } else {
                resolve();
            }
        });
    };
  
    const getMapsLink = () => {
        if (clinicLocation) {
            const { name } = clinicLocation;
            return `https://www.google.com/maps/search/?api=1&query=${name}`;
        }
    };
  
    const handleMapLoad = (map) => {
        setMapRef(map);
        console.log("Map loaded")
        console.log("Place ID: ", placeId)
        fetchPlaceDetails(placeId, map);
    };
  
    const fetchPlaceDetails = (placeId, map) => {
        console.log("Fetching place details");
        console.log(placeId)
        const service = new window.google.maps.places.PlacesService(map);
        service.getDetails(
            {
                placeId: placeId,
            },
            (result, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    const { name, formatted_address, rating, reviews } = result;
        
                    setClinicLocation(result);
                    setName(name);
                    setFormattedAddress(formatted_address);
                    setDestinationCoordinates({
                        lat: result.geometry.location.lat(),
                        lng: result.geometry.location.lng(),
                    });
        
                    setCenter({
                        lat: result.geometry.location.lat(),
                        lng: result.geometry.location.lng(),
                    });
        
                } else {
                    console.error(`Error retrieving place details: Status - ${status}`);
                }
            }
        );
    };

    const fetchHomeDetails = (placeId, map) => {
        console.log("Fetching home details");
        console.log(placeId);
    
        return new Promise((resolve, reject) => {
            const service = new window.google.maps.places.PlacesService(map);
            service.getDetails(
                {
                    placeId: placeId,
                },
                (result, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        const { name, formatted_address, rating, reviews } = result;
                        setHome(result);
                        console.log(result);
                        resolve(result); // Resolve the promise with the result
                    } else {
                        console.error(`Error retrieving place details: Status - ${status}`);
                        reject(`Error retrieving place details: Status - ${status}`);
                    }
                }
            );
        });
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
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: homeLocation,
                destination: clinicLocation,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                    const distance = result.routes[0].legs[0].distance.value;
                    const distanceInKilometers = distance / 1000;
                    onDistanceChange(distanceInKilometers);
                    setDistance(distance);
                    console.log(distance);
                } else {
                    console.error(`Error retrieving directions: Status - ${status}`);
                }
            }
        );
    };
  
    useEffect(() => {
        console.log("use home? ", useHome)
        if (useHome && user.address && inputRef.current) {
            onNewHome(null);

            const autocomplete = new window.google.maps.places.AutocompleteService();
            console.log("user address: ", user.address);
            // If useHome is true and user.address is available, set the value of the Autocomplete
            inputRef.current.value = user.address;
    
            // Trigger the Places Autocomplete API manually
            autocomplete.getPlacePredictions(
                { input: user.address },
                (predictions, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
                        const placeId = predictions[0].place_id;
                        console.log("using user home: ", placeId);
                        // Call fetchHomeDetails and wait for it to complete
                        fetchHomeDetails(placeId, mapRef).then((homeDetails) => {
                            // Check if homeDetails is truthy before calling fetchDirections
                            if (homeDetails) {
                                fetchDirections(clinicLocation, homeDetails);
                            }
                        }).catch((error) => {
                            console.error(error);
                        });
                    }
                }
            );
        } else {
            setHome(null);
        }
    }, [useHome, user.address]);
  
    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading maps";
    console.log("Clinic Location: ", clinicLocation);
  
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
                        // Check if useHome is true or false
                        if (!useHome) {
                            // If useHome is true, handle place selection and setHome
                            handlePlaceSelect().then((selectedPlace) => {
                                if (selectedPlace) {
                                    fetchDirections(clinicLocation, selectedPlace);
                                    onNewHome(selectedPlace);
                                    console.log("New home: ", selectedPlace);
                                }
                            });
                        } else {
                            console.log("useHome is true. Do something...");
                        }
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
                        ref={inputRef}
                        focusBorderColor='blue.500'
                        disabled={useHome}
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
            {clinicLocation && (
                <Marker position={{ lat: clinicLocation.geometry.location.lat(), lng: clinicLocation.geometry.location.lng() }} />
            )}
            {clinicLocation && (
                <InfoWindow position={{ lat: clinicLocation.geometry.location.lat() + 0.0015, lng: clinicLocation.geometry.location.lng() }}>
                    <Box p={1} maxW="sm">
                        <Text fontSize="sm" fontWeight="medium">
                            {name}
                        </Text>
                        <Text fontSize="xs" fontWeight="medium" color="gray.500" mt={1} mb={2}>
                            {formattedAddress}
                        </Text>
                        <Link href={getMapsLink()} isExternal target="_blank" rel="noreferrer" _hover={{ textDecoration: "none" }} textDecoration="none" onClick={(e) => e.stopPropagation()}>
                            <HStack spacing={1} fontSize="xs" fontWeight="medium" color="blue.500">
                                <Text outline="none">View on Google Maps</Text>
                                <BiLinkExternal />
                            </HStack>
                        </Link>
                    </Box>
                </InfoWindow>
            )}
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </Box>
    );
}

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
    const {user, loading} = useAuth();
    const [data, setData] = useState({});
	const {id} = useParams();
    const [useHome, setHome] = useState(false);
    const [distance, setDistance] = useState(null);
    const [newHome, setNewHome] = useState(null);

	const handleDistance = (distance) => {
	  	setDistance(distance); 
	};

    const handleNewHome = (home) => {
        setNewHome(home);
    };
    
    useEffect(() => {
        onValue(query(ref(db, `clinics/${id}`)), (snapshot) => {
	        const data = snapshot.val();
	        setData(data);
        });
    }, []);

	const onSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData(e.target);
		
		if (res) {
			console.log("Requesting a doctor");
		}
	}
    
    useEffect(() => {
        if (usePersonalDetails) {
            setValue("patient_name", user.name);
            setValue("date_of_birth", user.dob);
            setValue("address", user.address);
            setHome(true);
        } else {
            setValue("patient_name", "");
            setValue("date_of_birth", "");
            setValue("address", "");
            if (newHome) {
                console.log("Setting new home");
                setValue("address", newHome.formatted_address);
            }
            setHome(false);
        }
    }, [usePersonalDetails, newHome]);
	
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
                <form action="/" method="post" onSubmit={handleSubmit(onSubmit)}>
                    <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        mb={4}
                    >
                        <Box mx={5} w="full">
                            <Flex alignItems="center">
                                <Box
                                    w="56"
                                    bgImage={data.image}
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
                                        {data.name}
                                    </Text>
                                    <Box
                                        color="gray.500"
                                        fontWeight="semibold"
                                        letterSpacing="wide"
                                        fontSize="sm"
                                        textTransform="uppercase"
                                        mt={2}
                                    >
                                        { data.specialty ? data.specialty : 'General Clinic' }
                                    </Box>							
                                </Box>
                            </Flex>
                        </Box>
                        <Flex direction='column' gap={2} justifyContent={'end'} alignItems={'center'} w="30%">
                            <Flex
                            >
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
                                            isDisabled={usePersonalDetails}
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
                                        Illness Description
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
                            <Flex direction="column" alignItems="center">
                                <Box
                                    w="full"
                                    rounded={'lg'}
                                    h="430px"
                                >
                                    <Map placeId={data.placeId} onDistanceChange={handleDistance} onNewHome={handleNewHome} useHome={useHome} user={user}/>
                                </Box>
                                
                            </Flex>
                            <Button
                                type="submit"
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
            </Box>
        </Center>
    );
}

export default DoctorRequestForm;
