import {
	Avatar,
	Box,
	Button,
	Center,
	Flex,
	Text,
	Link,
	HStack,
	Textarea,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
} from '@chakra-ui/react'
import {GoogleMap, Marker, useLoadScript, InfoWindow, DirectionsRenderer} from '@react-google-maps/api';
import {NavLink, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import {FaUserCircle, FaStar, FaStarHalf} from "react-icons/fa";
import {AiFillStar} from "react-icons/ai";
import {BiLinkExternal} from "react-icons/bi";
import {db} from "../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";
import {ClinicDoctorList} from "./ClinicDoctorList.jsx";

function Map({ placeId, onDistanceChange }) {
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
	const [place, setPlace] = useState(null);
	const [name, setName] = useState('');
	const [formattedAddress, setFormattedAddress] = useState('');
	const [destinationCoordinates, setDestinationCoordinates] = useState(null);
	const [distance, setDistance] = useState(null);
	const [directions, setDirections] = useState(null);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: 'AIzaSyCxkZ_qonH-WY9cbiHZsUgp9lE3PdkWH_A',
		libraries: libs,
	});

	const getMapsLink = () => {
		if (place) {
			const { name } = place;
			return `https://www.google.com/maps/search/?api=1&query=${name}`;
		}
	};

	if (loadError) return "Error loading maps";
	if (!isLoaded) return "Loading maps";
  
	return (
		<Box>
			<GoogleMap
				onLoad={(map) => {
					setMapRef(map);
					if (placeId && window.google && window.google.maps) {
						const service = new window.google.maps.places.PlacesService(map);
						service.getDetails(
							{
								placeId: placeId,
							},
							(result, status) => {
								if (status === window.google.maps.places.PlacesServiceStatus.OK) {
									const { name, formatted_address, rating, reviews } = result;
						
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
													onDistanceChange(distanceInKilometers, rating, reviews); 
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

function ClinicDetails() {
	const [data, setData] = useState({});
	const {id} = useParams();
	console.log(id);
    
    useEffect(() => {
        onValue(query(ref(db, `clinics/${id}`)), (snapshot) => {
	        const data = snapshot.val();
	        setData(data);
        });
    }, []);

	const [distance, setDistance] = useState(null);
	const [ratings, setRatings] = useState(0);
	const [reviews, setReviews] = useState([]);

	const handleDistance = (distance, ratings, reviews) => {
	  	setDistance(distance); 
		setRatings(ratings); 
		setReviews(reviews); 
	};
    
    console.log(data)
	
	return (
		<Center w="100%" h="auto" bg="#f4f4f4">
			<Box
				w="85%"
				h="full"
				bg="white"
				boxShadow="xl"
				rounded="xl"
				p={10}
				gridGap={4}
				gap={6}
				gridTemplateColumns="1fr 1fr"
			>
				<Flex mb={7}>
					<Box w="full">
						<Flex alignItems="center">
							<Box
								w="28"
								bgImage={data.image}
								bgSize="cover"
								bgPosition="center"
								rounded={'lg'}
								h="16"
								mr={5}
							>
							</Box>
							<Box>
								<Text fontSize="xl" fontWeight="semibold" letterSpacing="wide">
									{data.name}
								</Text>
								<Box
									color="gray.500"
									fontWeight="semibold"
									letterSpacing="wide"
									fontSize="sm"
									textTransform="uppercase"
								>
									{ data.specialty ? data.specialty : 'General Clinic' }
								</Box>
							</Box>
						</Flex>
					</Box>

					<Box w="full">
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
							<Box display='flex' alignItems='center'>
								{
									Array(5)
										.fill('')
										.map((_, i) => (
										i < Math.floor(ratings) ? (
											<FaStar key={i} color='gold' />
										) : (
											i === Math.floor(ratings) && ratings % 1 !== 0 ? (
											<FaStarHalf key={i} color='gold' />
											) : (
											<FaStar key={i} color='gray' />
											)
										)
										))
								}
								<Box as='span' ml='2' color='gray.600' fontSize='sm'>
									{ ratings } ratings
								</Box>
							</Box>							
						</Flex>
					</Box>
				</Flex>
				
				<Flex>
					<Box mb={4} w="full">
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
								{data.name}
							</Text>
						</Box>
						<Flex alignItems="center" justifyContent="space-between">
							<Box flex="1">
								<Text fontSize="sm" fontWeight="medium" color="gray.500" mt={8} mb={2}>
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
										{data.start_time}
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
										{data.end_time}
									</Text>
								</Flex>
							</Box>
							<Box flex="1" ml={4}>
								<Text mt={8} mb={2} fontSize="sm" fontWeight="medium" color="gray.500">
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
										{data.start_day}
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
										{data.end_day}
									</Text>
								</Flex>
							</Box>
						</Flex>

						<Box>
							<Text mb={2} mt={8} fontSize="sm" fontWeight="medium" color="gray.500">
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
							<Text mb={2} mt={8} fontSize="sm" fontWeight="medium" color="gray.500">
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
						<Flex w="full">
							<Box w="full">
								<NavLink to={`/clinics/${id}/request`}>
									<Button
										w={'full'}
										colorScheme="blue"
										rounded="xl"
										mt={14}
									>
										Send Doctor Request
									</Button>
								</NavLink>                                     
							</Box>
						</Flex>
					</Box>
					<Box ml={5} my={7} w="full">
						<Flex direction="column" alignItems="center">
							<Box
								w="full"
								rounded={'lg'}
								h="350px"
							>
								<Map placeId={data.placeId} onDistanceChange={handleDistance}/>
							</Box>
							
						</Flex>
						<Box mt={4}>
							<Box mt={4} w="full">
								<Box borderBottom="1px" borderColor="gray.300" mt={4} mb={4} />

								<Box 
									mt={4} 
									maxHeight={300} 
									overflowY="scroll"
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
									{
										reviews ? reviews.map((review, index) => (
											<Flex mb={3} w="full" key={index}>
												<Avatar size="sm" name={review.author_name} src={review.profile_photo_url} mr={3} />
												<Box w="full">
													<Flex alignItems="center">
														<Box w="full">
														<Text fontSize="sm" fontWeight="semibold" letterSpacing="wide">
															{review.author_name}
														</Text>
														</Box>
														<Box w="full">
														<Flex justifyContent="end" alignItems="center">
															<Box display="flex" alignItems="center">
															{Array(5)
																.fill('')
																.map((_, i) => (
																<AiFillStar
																	size={20}
																	key={i}
																	color={i < review.rating ? 'gold' : 'gray'}
																/>
																))}
															<Box as="span" mx="2" color="gray.600" fontSize="sm">
																{review.rating}
															</Box>
															</Box>
														</Flex>
														</Box>
													</Flex>
													<Box>
														<Text fontSize="sm" letterSpacing="wide">
														{review.text}
														</Text>
													</Box>
												</Box>
										  	</Flex>
										)) : (
											<Text fontSize="sm" letterSpacing="wide">
												No reviews available
											</Text>
										)
									}
								</Box>
							</Box>
						</Box>
					</Box>
				</Flex>

				<Flex>
					<Box w='full'>
						<Accordion
							allowToggle={true}
						>
							<AccordionItem>
								<h2>
									<AccordionButton>
										<Box as="span" flex='1' textAlign='left'>
											Meet our experts!
										</Box>
										<AccordionIcon />
									</AccordionButton>
								</h2>				
								<AccordionPanel>
									<ClinicDoctorList clinicId={id} />
								</AccordionPanel>			
							</AccordionItem>
						</Accordion>
					</Box>					
				</Flex>
			</Box>
		</Center>
	);
}

export default ClinicDetails;
