import {Box, Center, Divider, Flex, HStack, IconButton, Link, Text, Textarea,} from '@chakra-ui/react'
import {DirectionsRenderer, GoogleMap, InfoWindow, Marker} from '@react-google-maps/api';
import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import {AiOutlineArrowLeft} from "react-icons/ai";
import {BiLinkExternal} from "react-icons/bi";
import {db} from "../../../api/firebase.js";
import {onValue, query, ref, get} from "firebase/database";

function Map({ placeId, onDistanceChange }) {
	console.log(placeId);
	const mapStyle = {
	  height: '500px',
	  width: '100%',
	};
	const libs = ['places'];
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
			const { name } = place;
			return `https://www.google.com/maps/search/?api=1&query=${name}`;
		}
	};
  
	return (
		<Box>
			<GoogleMap
				onLoad={(map) => {
					console.log("Map Loaded")
					setMapRef(map);
					if (placeId && window.google && window.google.maps) {
						console.log("Service")
						const service = new window.google.maps.places.PlacesService(map);
						service.getDetails(
							{
								placeId: placeId,
							},
							(result, status) => {
								if (status === window.google.maps.places.PlacesServiceStatus.OK) {
									console.log("Getting Result")
									const { name, formatted_address } = result;
						
									setPlace(result);
									console.log(result);
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
										});
									}
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
					<Marker position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }} />
				)}
				{place && (
					<InfoWindow position={{ lat: place.geometry.location.lat() + 0.0015, lng: place.geometry.location.lng() }}>
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
				{directions && <DirectionsRenderer directions={directions} /> }
			</GoogleMap>
		</Box>
	);
}

function ClinicRegistryDetails() {
	const [data, setData] = useState({});
	const [distance, setDistance] = useState(null);	
	const {id} = useParams();
	const navigate = useNavigate();
    
    useEffect(() => {
        onValue(query(ref(db, `clinic_requests/${id}`)), async (snapshot) => {
			await fetchAdminData(snapshot.val().admin).then((adminData) => {
				let data = {
					id: id,
					...snapshot.val(),
					admin: adminData,
				}
				setData(data);
			});
        });
    }, []);

    function fetchAdminData(userId) {
        const adminRef = ref(db, `users/${userId}`);
        return get(adminRef).then((adminSnapshot) => {
            return adminSnapshot.val();
        });
    }

	const handleDistance = (distance) => {
	  	setDistance(distance); // Set the distance state
	};

	const handleBack = () => {
		navigate('/admin/approve-clinics');
	};
	
	return (
		<Center w="100%" h="auto" bg="#f4f4f4">
			<Box
				w="85%"
				h="full"
				bg="white"
				boxShadow="xl"
				rounded="xl"
				p={3}
				gridGap={4}
				gap={6}
				gridTemplateColumns="1fr 1fr"
			>
				<Flex>
					<Box my={7} mx={5} w="full">
						<Flex alignItems="center">
							<Box>
								<IconButton
									icon={<AiOutlineArrowLeft />}
									aria-label="Back"
									onClick={handleBack}
									bg="transparent"
								/>
							</Box>
							<Box
								w="28"
								bgImage={data.image ? data.image : 'https://source.unsplash.com/random'}
								bgSize="cover"
								bgPosition="center"
								rounded={'lg'}
								h="16"
								mx={5}
							>
							</Box>
							<Box>
								<Text fontSize="xl" fontWeight="semibold" letterSpacing="wide">
									{data.name ? data.name : 'No clinic name available'}
								</Text>
								<Box
									color="gray.500"
									fontWeight="semibold"
									letterSpacing="wide"
									fontSize="sm"
									textTransform="uppercase"
								>
									{ data.specialist_clinic ? data.specialist_clinic : 'General Clinic' }
								</Box>
							</Box>
						</Flex>
					</Box>

					<Box my={7} mx={5} w="full">
						<Flex alignItems="center" justifyContent="end">
							<Box
								color='gray.500'
								fontWeight='semibold'
								letterSpacing='wide'
								fontSize='sm'
								textTransform='uppercase'
								mr={8}
							>
								{distance ? distance : "0"} km away from your location
							</Box>				
						</Flex>
					</Box>
				</Flex>
				
				<Flex>
					<Box mx={5} mb={4} w="full">
						<Box>
							<Text mb={2} fontSize="sm" fontWeight="medium" color="gray.500">
								Clinic Name
							</Text>
							<Text
								fontSize="md"
								fontWeight="semiBold"
								border="1px solid #E2E8F0"
								borderRadius="md"
								p={2}
								w="full"
								pointerEvents="none"
								tabIndex="-1"
							>
								{data.name ? data.name : 'No clinic name available'}
							</Text>
						</Box>

						<Box>
							<Text mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.500">
								Business Registration Number
							</Text>
							<Text
								fontSize="md"
								fontWeight="semiBold"
								border="1px solid #E2E8F0"
								borderRadius="md"
								p={2}
								w="full"
								pointerEvents="none"
								tabIndex="-1"
							>
								{data.id ? data.id : 'No business registration number available'}
							</Text>
						</Box>

						<Flex alignItems="center" justifyContent="space-between">
							<Box flex="1">
								<Text fontSize="sm" fontWeight="medium" color="gray.500" mt={6} mb={2}>
									Operating Hours
								</Text>
								<Flex alignItems="center">
									<Text
										fontSize="md"
										fontWeight="semiBold"
										border="1px solid #E2E8F0"
										borderRadius="md"
										p={2}
										w="full"
										pointerEvents="none"
										tabIndex="-1"
									>
										{data.start_time ? data.start_time : '08:00 AM'}
									</Text>
									<Text mx={3} fontSize="md" color="gray.700">
										to
									</Text>
									<Text
										fontSize="md"
										fontWeight="semiBold"
										border="1px solid #E2E8F0"
										borderRadius="md"
										p={2}
										w="full"
										pointerEvents="none"
										tabIndex="-1"
									>
										{data.end_time ? data.end_time : '10:00 PM'}
									</Text>
								</Flex>
							</Box>
							<Box flex="1" ml={4}>
								<Text mt={6} mb={2} fontSize="sm" fontWeight="medium" color="gray.500">
									Operating Days
								</Text>
								<Flex alignItems="center">
									<Text
										fontSize="md"
										fontWeight="semiBold"
										border="1px solid #E2E8F0"
										borderRadius="md"
										p={2}
										w="full"
										pointerEvents="none"
										tabIndex="-1"
									>
										{data.start_day ? data.start_day : 'Monday'}
									</Text>
									<Text mx={3} fontSize="md" color="gray.700">
										to
									</Text>
									<Text
										fontSize="md"
										fontWeight="semiBold"
										border="1px solid #E2E8F0"
										borderRadius="md"
										p={2}
										w="full"
										pointerEvents="none"
										tabIndex="-1"
									>
										{data.end_day ? data.end_day : 'Sunday'}
									</Text>
								</Flex>
							</Box>
						</Flex>

						<Box>
							<Text mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.500">
								Contact Number
							</Text>
							<Text
								fontSize="md"
								fontWeight="semiBold"
								border="1px solid #E2E8F0"
								borderRadius="md"
								p={2}
								w="full"
								pointerEvents="none"
								tabIndex="-1"
							>
								{data.contact ? data.contact : 'No contact number available'}
							</Text>
						</Box>

						<Box>
							<Text mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.500">
								Address
							</Text>
							<Textarea
								fontSize="md"
								fontWeight="semiBold"
								border="1px solid #E2E8F0"
								borderRadius="md"
								p={2}
								w="full"
								readOnly
								value={data.address}
								pointerEvents={'none'}
							/>
						</Box>
					</Box>
					<Box mx={5} my={7} w="full">
						<Flex direction="column" alignItems="center">
							<Box
								w="full"
								rounded={'lg'}
								h="350px"
							>
								{data?.place_id && <Map placeId={data?.place_id} onDistanceChange={handleDistance}/>}
							</Box>
						</Flex>
					</Box>
				</Flex>

				<Divider my={4} borderColor="blackAlpha.300" borderWidth="1px" rounded="lg" />
				
				<Text mx={5} mb={4} fontSize="xl" fontWeight="semibold" letterSpacing="wide">
					Clinic Admin
				</Text>

				<Flex>
					<Box mx={5} mb={4} w="full">
						<Box>
							<Text mb={2} fontSize="sm" fontWeight="medium" color="gray.500">
								Name
							</Text>
							<Text
								fontSize="md"
								fontWeight="semiBold"
								border="1px solid #E2E8F0"
								borderRadius="md"
								p={2}
								w="full"
								pointerEvents="none"
								tabIndex="-1"
							>
								{data.admin?.name ? data.admin?.name : 'No admin name available'}
							</Text>
						</Box>
					</Box>
					<Box mx={5} mb={4} w="full">
						<Box>
							<Text mb={2} fontSize="sm" fontWeight="medium" color="gray.500">
								Email
							</Text>
							<Text
								fontSize="md"
								fontWeight="semiBold"
								border="1px solid #E2E8F0"
								borderRadius="md"
								p={2}
								w="full"
								pointerEvents="none"
								tabIndex="-1"
							>
								{data.admin?.email ? data.admin?.email : 'No admin email available'}
							</Text>
						</Box>
					</Box>
				</Flex>
			</Box>
		</Center>
	);
}

export default ClinicRegistryDetails;
