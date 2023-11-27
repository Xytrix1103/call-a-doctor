import {
    Badge,
    Box,
    Flex,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    SimpleGrid,
    Text,
    VStack
} from '@chakra-ui/react'
import {useEffect, useState} from "react";
import {db} from "../../../api/firebase.js";
import {BiSearchAlt2} from "react-icons/bi";
import {onValue, query, ref} from "firebase/database";
import {NavLink} from "react-router-dom";
import {AiFillStar} from "react-icons/ai";
import { FaUser, FaStethoscope, FaStar, FaStarHalf } from "react-icons/fa";
import {GoogleMap, LoadScript, Marker, useLoadScript, InfoWindow, DirectionsRenderer} from '@react-google-maps/api';

function ApprovedClinicList() {
    const [clinics, setClinics] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [destinationCoordinates, setDestinationCoordinates] = useState(null);

    const libs = ['places'];
    const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: 'AIzaSyCxkZ_qonH-WY9cbiHZsUgp9lE3PdkWH_A',
		libraries: libs,
	});
    
    useEffect(() => {
        // Fetch clinic details from Realtime Database
        const clinicsRef = ref(db, 'clinics');
    
        onValue(clinicsRef, (snapshot) => {
            const clinics = [];
            snapshot.forEach((childSnapshot) => {
                const clinic = {
                id: childSnapshot.key,
                    ...childSnapshot.val(),
                };
                clinics.push(clinic);
            });
        
            // Extract all placeIds from clinics
            const placeIds = clinics.map((clinic) => clinic.place_id);
        
            // Fetch ratings for all clinics using Places API
            const service = new window.google.maps.places.PlacesService(document.createElement('div'));
            placeIds.forEach((placeId, index) => {
                service.getDetails(
                {
                    placeId: placeId,
                    fields: ['name', 'formatted_address', 'rating', 'geometry'],
                },
                (result, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setDestinationCoordinates({
                            lat: result.geometry.location.lat(),
                            lng: result.geometry.location.lng(),
                        });

                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition((position) => {
                                const currentLocation = new window.google.maps.LatLng(
                                    position.coords.latitude,
                                    position.coords.longitude
                                  );
                                  const placeLocation = new window.google.maps.LatLng(
                                    result.geometry.location.lat(),
                                    result.geometry.location.lng()
                                  );
                                  const directionsService = new window.google.maps.DirectionsService();
                                  directionsService.route(
                                    {
                                        origin: currentLocation,
                                        destination: placeLocation,
                                        travelMode: window.google.maps.TravelMode.DRIVING,
                                    },
                                    (result, status) => {
                                        if (status === window.google.maps.DirectionsStatus.OK) {
                                            const distance = result.routes[0].legs[0].distance.value;
                                            const distanceInKilometers = distance / 1000; 
                                            // Update the clinics array with ratings
                                            clinics[index].distance = distanceInKilometers || null;
                                            setClinics([...clinics]); // Trigger a re-render
                                            console.log(distance);
                                        } else {
                                            console.error(`Error retrieving directions: Status - ${status}`);
                                        }
                                    }
                                );
                            });
                        } else {
                            console.error('Geolocation is not supported by this browser!');
                        }
                        // Update the clinics array with ratings
                        clinics[index].rating = result.rating || null;
                        setClinics([...clinics]); // Trigger a re-render
                    } else {
                        console.error(`Error fetching place details: Status - ${status}`);
                    }
                    console.log(clinics);
                }
                );
            });
        });
    }, []);

    const filteredClinics = clinics.filter((clinic) =>
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    
    return (
        <Box w="full" h="full" p={2} direction="column" mb={4}>
            <Box
                w="30%"
                h="auto"
                py={2}
                mb={4}
            >
                <InputGroup size="md">
                    <InputLeftElement
                        pointerEvents="none"
                        children={<BiSearchAlt2 color="gray.500" />}
                    />
                    <Input
                        type="text"
                        placeholder="Search clinics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="md"
                        focusBorderColor="blue.500"
                        borderRadius="xl"
                        borderColor="gray.300"
                        backgroundColor="white"
                        color="gray.800"
                    />
                </InputGroup>
            </Box>
            <Flex w="full" h="auto" pb={6}>
                <SimpleGrid
                    columns={[1, 1, 2, 3, 4]}
                    gap={10}
                >
                    {filteredClinics
                        .sort((a, b) => a.distance - b.distance)
                        .map((clinic) => (
                        <Flex bg="white" h="full" shadow="lg" borderRadius="lg" transition="transform 0.2s" _hover={{ transform: 'scale(1.05)', shadow: 'xl' }}>
                            <Link as={NavLink} to={`/admin/clinics/${clinic.id}`} key={clinic.id} style={{ textDecoration: 'none' }} w="full" h="full">
                                <VStack w="full" h="full">
                                    <Image
                                        w="full"
                                        h="32"
                                        fit="cover"
                                        src={ clinic.image }
                                        alt={ clinic.name }
                                        borderTopRadius="lg"
                                    />
                                    <Box px={4} py={3} w="full" h="full">
                                        <Box display='flex' alignItems='baseline' mb={1}>
                                            <Badge borderRadius='full' px='2' colorScheme='blue'>
                                                { clinic.specialty ? clinic.specialty : 'General' }
                                            </Badge>
                                            <Box
                                                color='gray.500'
                                                fontWeight='semibold'
                                                letterSpacing='wide'
                                                fontSize='xs'
                                                textTransform='uppercase'
                                                ml='2'
                                            >
                                                { clinic.distance } km away
                                            </Box>
                                        </Box>
                                        
                                        <Text fontSize="lg" fontWeight="bold" isTruncated w="full" color='black'>
                                            {clinic.name}
                                        </Text>
                                        
                                        <Text fontSize="md" fontWeight="md" isTruncated w="full" color='black'>
                                            {clinic.address}
                                        </Text>
                                        
                                        <Box display='flex' mt={1} alignItems='center'>
                                            {
                                                Array(5)
                                                    .fill('')
                                                    .map((_, i) => (
                                                        i < Math.floor(clinic.rating) ? (
                                                        <FaStar key={i} color='gold' />
                                                        ) : (
                                                        i === Math.floor(clinic.rating) && clinic.rating % 1 !== 0 ? (
                                                            <FaStarHalf key={i} color='gold' />
                                                        ) : (
                                                            <FaStar key={i} color='gray' />
                                                        )
                                                        )
                                                    ))
                                            }
                                            <Box as='span' ml='2' color='gray.600' fontSize='sm'>
                                                {clinic.rating} ratings
                                            </Box>
                                        </Box>
                                    </Box>
                                </VStack>
                            </Link>
                        </Flex>
                    ))}
                </SimpleGrid>
            </Flex>
        </Box>
    );
}

export default ApprovedClinicList;