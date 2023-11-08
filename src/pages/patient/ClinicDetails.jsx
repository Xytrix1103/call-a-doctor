import {
	Avatar,
	Box,
	Button,
	Center,
	Flex,
	FormControl,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Text,
	Link,
	HStack,
	Textarea
} from '@chakra-ui/react'
import {GoogleMap, LoadScript, Marker, useLoadScript, InfoWindow} from '@react-google-maps/api';
import {NavLink, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import {AiFillStar, AiOutlineSend} from "react-icons/ai";
import {FaUserCircle} from "react-icons/fa";
import {BiLinkExternal} from "react-icons/bi";
import {db} from "../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";

function Map({ placeId }) {
	const mapStyle = {
	  height: '280px',
	  width: '100%',
	};
	const [mapRef, setMapRef] = useState(null);
	const [center, setCenter] = useState({
	  lat: 5.4164,
	  lng: 100.3327,
	});
	const [place, setPlace] = useState(null);
	const [name, setName] = useState('');
	const [formattedAddress, setFormattedAddress] = useState('');

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: 'AIzaSyCxkZ_qonH-WY9cbiHZsUgp9lE3PdkWH_A',
		libraries: ['places'],
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
									const { name, formatted_address } = result;
						
									setPlace(result);
									console.log(result);
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
			</GoogleMap>
		</Box>
	);
}

function ClinicDetails() {
	const [data, setData] = useState({});
	const {id} = useParams();
	// const [selectedRating, setSelectedRating] = useState(0);

	// const handleStarClick = (rating) => {
	//   	setSelectedRating(rating);
	// };

	// const sendReview = () => {
	// 	const review = document.getElementById('review').value;
	// 	const rating = selectedRating;
	// 	if (rating < 1) {
	// 		alert('Please select a rating');
	// 		return;
	// 	}
	// 	console.log(review, rating);
	// };
    
    useEffect(() => {
        onValue(query(ref(db, `clinics/${id}`)), (snapshot) => {
	        const data = snapshot.val();
	        setData(data);
        });
    }, []);
    
    console.log(data)
	
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
								6.8 km away from your location
							</Box>
							<Box display='flex' alignItems='center'>
								{
									Array(5)
										.fill('')
										.map((_, i) => (
											<AiFillStar
												size={20}
												key={i}
												color={i < 4 ? 'gold' : 'gray'}
											/>
										))
								}
								<Box as='span' ml='2' color='gray.600' fontSize='sm'>
									4.0 reviews
								</Box>
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
								{data.name}
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
						<Box mb={3}>
							<Text mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.500">
								Panel Firms
							</Text>
							<Textarea
								fontSize="md"
								fontWeight="semiBold"
								border="1px solid #E2E8F0"
								borderRadius="md"
								placeholder='No panel firms available'
								p={2}
								w="full"
								readOnly
								value={data.panel_firms}
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
										mt={6}
									>
										Send Doctor Request
									</Button>
								</NavLink>                                     
							</Box>
						</Flex>
					</Box>
					<Box mx={5} my={7} w="full">
						<Flex direction="column" alignItems="center">
							<Box
								w="full"
								rounded={'lg'}
								h="64"
							>
								<Map placeId={data.placeId} />
							</Box>
						</Flex>
						<Box mt={4}>
							{/* <FormControl>
								<Text mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
									Leave a review
								</Text>
								<InputGroup size="md">
									<InputLeftElement
										pointerEvents="none"
										children={<FaUserCircle color="gray.500" />}
									/>
									<Input
										type="text"
										placeholder="Write your review here..."
										id='review'
										size="md"
										focusBorderColor="blue.500"
										borderRadius="xl"
										borderColor="gray.300"
										backgroundColor="white"
										color="gray.800"
									/>
									<InputRightElement
										children={<AiOutlineSend color="gray.500" />}
										onClick={sendReview}
										cursor="pointer"
									/>
								</InputGroup>
							</FormControl> */}
							<Box mt={4} w="full">
								{/* <Flex alignItems="center" justifyContent="end">
									<Box display='flex' alignItems='center'>
										{
											Array(5)
												.fill('')
												.map((_, i) => (
													<AiFillStar
														size={20}
														key={i}
														color={i < selectedRating ? "gold" : "gray"}
														onClick={() => handleStarClick(i + 1)}
														cursor={'pointer'}
													/>
												))
										}
										<Box as='span' ml='2' color='gray.600' fontSize='sm'>
											{selectedRating}.0
										</Box>
									</Box>
								</Flex> */}

								<Box
									borderBottom="1px"
									borderColor="gray.300"
									mt={4}
									mb={4}
								/>

								<Box 
									mt={4} 
									maxHeight={300}
									overflowY='scroll'
								>
									<Flex mb={3} w="full">
										<Avatar size="sm" name="Ryan Florence" src="https://bit.ly/ryan-florence" mr={3} />
										<Box w="full">
											<Flex alignItems="center">
												<Box w="full">
													<Text fontSize="sm" fontWeight="semibold" letterSpacing="wide">
														Meow meow
													</Text>
												</Box>
												<Box w="full">
													<Flex justifyContent="end" alignItems="center">
														<Box display="flex" alignItems="center">
															{
																Array(5)
																.fill('')
																.map((_, i) => (
																	<AiFillStar
																		size={20}
																		key={i}
																		color={i < 2 ? 'gold' : 'gray'}
																	/>
																))
															}
															<Box as="span" mx="2" color="gray.600" fontSize="sm">
																2.0
															</Box>
														</Box>
													</Flex>
												</Box>
											</Flex>
											<Box>
												<Text fontSize="sm" letterSpacing="wide">
													Meow meow meow! meow meow.. mow mow mow
													Meow meow meow! meow meow.. mow mow mow
													Meow meow meow! meow meow.. mow mow mow
												</Text>
											</Box>
										</Box>
									</Flex>

									<Flex mb={3} w="full">
										<Avatar size="sm" name="Ryan Florence" src="https://bit.ly/ryan-florence" mr={3} />
										<Box w="full">
											<Flex alignItems="center">
												<Box w="full">
													<Text fontSize="sm" fontWeight="semibold" letterSpacing="wide">
														Halp me I am under da water
													</Text>
												</Box>
												<Box w="full">
													<Flex justifyContent="end" alignItems="center">
														<Box display="flex" alignItems="center">
															{
																Array(5)
																.fill('')
																.map((_, i) => (
																	<AiFillStar
																		size={20}
																		key={i}
																		color={i < 5 ? 'gold' : 'gray'}
																	/>
																))
															}
															<Box as="span" mx="2" color="gray.600" fontSize="sm">
																5.0
															</Box>
														</Box>
													</Flex>
												</Box>
											</Flex>
											<Box>
												<Text fontSize="sm" letterSpacing="wide">
													Wow!!??!?!?!?! 5-star SHEEEEEEESHERR
												</Text>
											</Box>
										</Box>
									</Flex>

									<Flex mb={3} w="full">
										<Avatar size="sm" name="Ryan Florence" src="https://bit.ly/ryan-florence" mr={3} />
										<Box w="full">
											<Flex alignItems="center">
												<Box w="full">
													<Text fontSize="sm" fontWeight="semibold" letterSpacing="wide">
														Mike Oxlong
													</Text>
												</Box>
												<Box w="full">
													<Flex justifyContent="end" alignItems="center">
														<Box display="flex" alignItems="center">
															{
																Array(5)
																.fill('')
																.map((_, i) => (
																	<AiFillStar
																		size={20}
																		key={i}
																		color={i < 4 ? 'gold' : 'gray'}
																	/>
																))
															}
															<Box as="span" mx="2" color="gray.600" fontSize="sm">
																4.0
															</Box>
														</Box>
													</Flex>
												</Box>
											</Flex>
											<Box>
												<Text fontSize="sm" letterSpacing="wide">
													Super Idol的笑容
													都没你的甜
													八月正午的阳光
													都没你耀眼
													热爱105°C的你
													滴滴清纯的蒸馏水
													Super Idol的笑容
													都没你的甜
													八月正午的阳光
													都没你耀眼
													热爱105°C的你
													滴滴清纯的蒸馏水
												</Text>
											</Box>
										</Box>
									</Flex>

								</Box>
							</Box>
						</Box>
					</Box>
				</Flex>
			</Box>
		</Center>
	);
}

export default ClinicDetails;
