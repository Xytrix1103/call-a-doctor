import {Badge, Box, Flex, HStack, Image, Link, Text, VStack,} from '@chakra-ui/react';
import {useEffect, useState} from "react";
import {equalTo, get, onValue, orderByChild, query, ref} from 'firebase/database';
import {db} from "../../../api/firebase.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import {BiLinkExternal} from "react-icons/bi";
import {NavLink} from "react-router-dom";
import {AiFillStar} from "react-icons/ai";
import {AppointmentTimelineChart} from "../../components/charts/AppointmentTimelineChart.jsx"
import "../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css";
import {DirectionsRenderer, GoogleMap, InfoWindow, Marker} from '@react-google-maps/api';

function Map({place_id}) {
	const mapStyle = {
		height: '550px',
		width: '100%',
	};
	const [libs] = useState(['places']);
	const [mapRef, setMapRef] = useState(null);
	const [center, setCenter] = useState({
		lat: 5.4164,
		lng: 100.3327,
	});
	const [place, setPlace] = useState(null);
	const [name, setName] = useState('');
	const [formattedAddress, setFormattedAddress] = useState('');
	const [destinationCoordinates, setDestinationCoordinates] = useState(null);
	const [distance, setDistance] = useState(null);
	const [directions, setDirections] = useState(null);
	
	const getMapsLink = () => {
		if (place) {
			const {name} = place;
			return `https://www.google.com/maps/search/?api=1&query=${name}`;
		}
	};
	
	return (
		<Box>
			<GoogleMap
				onLoad={(map) => {
					setMapRef(map);
					if (place_id && window.google && window.google.maps) {
						console.log("setting place");
						const service = new window.google.maps.places.PlacesService(map);
						service.getDetails(
							{
								placeId: place_id,
							},
							(result, status) => {
								if (status === window.google.maps.places.PlacesServiceStatus.OK) {
									console.log("setting place");
									const {name, formatted_address} = result;
									
									setPlace(result);
									setName(name);
									setFormattedAddress(formatted_address);
									setCenter({
										lat: result.geometry.location.lat(),
										lng: result.geometry.location.lng(),
									});
								} else {
									console.error(`Error retrieving place details: Status - ${status}`);
								}
							}
						);
					} else {
						if (navigator.geolocation) {
							navigator.geolocation.getCurrentPosition((position) => {
								setCenter({
									lat: position.coords.latitude,
									lng: position.coords.longitude,
								});
							});
						}
					}
					
				}}
				center={center}
				zoom={15}
				mapContainerStyle={mapStyle}
				options={
					{
						mapTypeControl: false,
					}
				}
			>
				{place && (
					<Marker position={{lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}}/>
				)}
				{place && (
					<InfoWindow
						position={{lat: place.geometry.location.lat() + 0.0015, lng: place.geometry.location.lng()}}>
						<Box p={1} maxW="sm">
							<Text fontSize="sm" fontWeight="medium">
								{name}
							</Text>
							<Text fontSize="xs" fontWeight="medium" color="gray.500" mt={1} mb={2}>
								{formattedAddress}
							</Text>
							<Link href={getMapsLink()} isExternal target="_blank" rel="noreferrer"
							      _hover={{textDecoration: "none"}} textDecoration="none"
							      onClick={(e) => e.stopPropagation()}>
								<HStack spacing={1} fontSize="xs" fontWeight="medium" color="blue.500">
									<Text outline="none">View on Google Maps</Text>
									<BiLinkExternal/>
								</HStack>
							</Link>
						</Box>
					</InfoWindow>
				)}
				{directions && <DirectionsRenderer directions={directions}/>}
			</GoogleMap>
		</Box>
	);
}

function DoctorDashboard() {
    const {user} = useAuth();
    const [clinic, setClinic] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [ratings, setRatings] = useState([]);
    
    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    function formatAge(dob) {
        const date = new Date(dob);
        const age = Math.floor((new Date() - date) / 3.15576e+10);
        return age;
    }

    function fetchDoctorData(doctorId) {
        const doctorRef = ref(db, `users/${doctorId}`);
        return get(doctorRef).then((doctorSnapshot) => {
            return doctorSnapshot.val();
        });
    }

    useEffect(() => {
		onValue(query(ref(db, 'requests'), orderByChild('doctor'), equalTo(user.uid)), (snapshot) => {
            const appointments = [];
            const promises = [];
            const data = snapshot.val();
            for (let id in data) {
                if (!data[id].approved) {
                    if (data[id].patient == null) {
                        get(ref(db, `users/${data[id].uid}`)).then((userSnapshot) => {
                            data[id] = {
                                id: id,
                                ...data[id],
                                ...userSnapshot.val(),
                                age: formatAge(userSnapshot.val().dob),
                                date: formatDate(data[id].requested_on),
                            }
                            requests.push(data[id]);
                        });
                    } else {
                        data[id] = {
                            id: id,
                            ...data[id],
                            ...data[id].patient,
                            age: formatAge(data[id].patient.dob),
                            date: formatDate(data[id].requested_on),
                        }
                        requests.push(data[id]);
                    }                        
                } else {
                    let userSnapshot;
                    if (data[id].patient == null) {
                        const promise = get(ref(db, `users/${data[id].uid}`))
                            .then((snapshot) => {
                                userSnapshot = snapshot; // Assign userSnapshot value
                                return fetchDoctorData(data[id].doctor);
                            })
                            .then((doctorData) => {
                                data[id] = {
                                    id: id,
                                    ...data[id],
                                    ...userSnapshot.val(),
                                    age: formatAge(userSnapshot.val().dob),
                                    date: formatDate(data[id].requested_on),
                                    doctor: doctorData,
                                };
                                appointments.push(data[id]);
                            });
                        promises.push(promise);
                    } else {
                        const promise = fetchDoctorData(data[id].doctor)
                            .then((doctorData) => {
                                data[id] = {
                                    id: id,
                                    ...data[id],
                                    ...data[id].patient,
                                    age: formatAge(data[id].patient.dob),
                                    date: formatDate(data[id].requested_on),
                                    doctor: doctorData,
                                };
                                appointments.push(data[id]);
                            });
                        promises.push(promise);
                    }
                }               
            }
            Promise.all(promises)
            .then(() => {
                // Now all appointments are processed
                const clinicPromises = appointments.map((appointment) => {
                    // Query for clinic object using appointment.clinic
                    return get(ref(db, `clinics/${appointment.clinic}`))
                        .then((clinicSnapshot) => {
                            return clinicSnapshot.val().name; // Assuming 'name' is the field containing the clinic name
                        });
                });
    
                // Wait for all clinic queries to complete
                return Promise.all(clinicPromises);
            })
            .then((clinicNames) => {
                // Assign clinic names to the appointments
                appointments.forEach((appointment, index) => {
                    appointment.clinicName = clinicNames[index];
                });
                // Continue with the rest of your code
                appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
                console.log("Appointments: ", appointments);
                setAppointments(appointments);
            })
            .catch((error) => {
                // Handle errors from the promises
                console.error("Error processing appointments:", error);
            });
		});

		onValue(query(ref(db, `clinics/${user.clinic}`)), (snapshot) => {
            const clinicData = snapshot.val();
            if (clinicData) {
                const clinic = {
                    id: snapshot.key,
                    ...clinicData,
                };
                setClinic(clinic);
                const service = new window.google.maps.places.PlacesService(document.createElement('div'));
                service.getDetails(
                {
                    placeId: clinic.place_id,
                    fields: ['name', 'formatted_address', 'rating'],
                },
                (result, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setRatings(result.rating || []);
                    } else {
                        console.error(`Error fetching place details: Status - ${status}`);
                    }
                }
                );
            } else {
                console.error(`Clinic with ID ${user.clinic} not found.`);
            }
        });
    }, []);

    return (
        <Flex w='full' h='auto' p={6} gap={10} bg="#f4f4f4">
            <Flex
                w='70%'
                direction='column'
                gap={6}
            >
                <Box w='full'>
                    <Flex
                        w='full'
                        p={6}
                        position='relative'
                        bgGradient="linear(to-r, teal.600, teal.900)"
                        rounded='lg'
                        boxShadow='lg'
                    >
                        <Box w='60%' >
                            <Text fontSize='2xl' fontWeight='bold' color='white' letterSpacing='wide' mb={5}>
                                Welcome to your Dashboard!
                            </Text>
                            <Text fontSize='lg' fontWeight='semibold' color='white' letterSpacing='wide' mb={3}>
                                Hello, {user.name}
                            </Text>
                            <Text fontSize='md' fontWeight='medium' color='white' letterSpacing='wide'>
                                We're delighted to have you here! Your expertise plays a crucial role in promoting health and well-being.
                            </Text>                            
                        </Box>
                        <Box w='40%'>
                            <Image src="/src/assets/svg/register-doctor.svg" alt="Dashboard" w="96" h="80" position='absolute' top={'-90px'} right={0} />
                        </Box>
                    </Flex>
                </Box>      
                <Box
                    w='full'
                    bg='white'
                    rounded='lg'
                    boxShadow='lg'
                    p={3}
                >
                    <Flex w='full' direction='column' p={4} maxH={'full'}>
                        <Text fontSize='lg' fontWeight='semibold' letterSpacing='wide' mb={5}>
                            Your appointment timeline
                        </Text>
                        <Box 
                            overflowY={'scroll'}
                            overflowX={'hidden'}
                            sx={{ 
                                '&::-webkit-scrollbar': {
                                width: '4px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#c1c9c3',
                                    borderRadius: '8px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: '#f1f1f1',
                                },
                            }}
                        >
                            <AppointmentTimelineChart appointments={appointments} />
                        </Box>
                    </Flex>                    
                </Box> 
            </Flex>
            <Flex
                w='30%'
                direction='column'
                h='full'
                bg='white'
                rounded='lg'
                boxShadow='lg'
            >
                <Box w='full' p={4} bgGradient="linear(to-b, teal.800, teal.500)" roundedTop='lg'>
                    <Flex w='full' direction='column'>
                        <Box w='full' bg='white' rounded='lg'>
                            <Flex bg="white" h="full" shadow="lg" borderRadius="lg" transition="transform 0.3s" _hover={{ transform: 'scale(1.02)', shadow: 'xl' }}>
                                <Link as={NavLink} to={`/my-clinic`} key={clinic.id} style={{ textDecoration: 'none' }} w="full" h="full">
                                    <VStack w="full" h="full">
                                        <Image
                                            w="full"
                                            h="32"
                                            fit="cover"
                                            src={clinic.image}
                                            alt={clinic.name}
                                            borderTopRadius="lg"
                                        />
                                        <Box px={4} py={3} w="full" h="full">
                                            <Box display='flex' alignItems='baseline' mb={1}>
                                                <Badge borderRadius='full' px='2' colorScheme='blue'>
                                                    Immunology
                                                </Badge>
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
                                                            <AiFillStar
                                                                key={i}
                                                                color={i < 4 ? 'gold' : 'gray'}
                                                            />
                                                        ))
                                                }
                                                <Box as='span' ml='2' color='gray.600' fontSize='sm'>
                                                    {ratings} ratings
                                                </Box>
                                            </Box>
                                        </Box>
                                    </VStack>
                                </Link>
                            </Flex>                                
                        </Box>
                    </Flex>
                </Box>
                <Box w='full' bg='white' roundedBottom='lg'>
                    <Map place_id={clinic.place_id} />
                </Box>
            </Flex>
        </Flex>
    );
}

export default DoctorDashboard;