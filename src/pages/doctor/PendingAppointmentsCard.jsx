import {
	Box,
	Button,
	Divider,
	Flex,
	HStack,
	IconButton,
	Input,
	Link,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
	useToast,
} from '@chakra-ui/react'
import {BiLinkExternal, BiSolidPhone} from "react-icons/bi";
import {BsCalendarDayFill, BsGenderFemale, BsGenderMale} from "react-icons/bs";
import {FaCar, FaMapLocationDot, FaPlus, FaTrash, FaUser, FaX} from "react-icons/fa6";
import {GiMedicines, GiSandsOfTime} from "react-icons/gi";
import {GoDotFill} from "react-icons/go";
import {useState} from 'react';
import {DirectionsRenderer, GoogleMap, InfoWindow, Marker, useLoadScript} from '@react-google-maps/api';
import {mark_arrived, prescribe} from "../../../api/doctor.js";

function Map({place_id, onDistanceChange, clinic_place_id}) {
	const mapStyle = {
		height: '350px',
		width: '350px',
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
	
	const {isLoaded, loadError} = useLoadScript({
		googleMapsApiKey: 'AIzaSyCxkZ_qonH-WY9cbiHZsUgp9lE3PdkWH_A',
		libraries: libs,
	});
	
	const getMapsLink = () => {
		if (place) {
			const {name} = place;
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
					if (place_id && window.google && window.google.maps) {
						console.log("setting place");
						const service = new window.google.maps.places.PlacesService(map);
						service.getDetails(
							{
								placeId: place_id,
							},
							(result, status) => {
								if (status === window.google.maps.places.PlacesServiceStatus.OK) {
									console.log("setting patient place");
									const {name, formatted_address, geometry} = result;
									
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
									const service = new window.google.maps.places.PlacesService(map);
									service.getDetails(
										{
											placeId: clinic_place_id,
										},
										(result, status) => {
											if (status === window.google.maps.places.PlacesServiceStatus.OK) {
												const clinicLocation = new window.google.maps.LatLng(
													result.geometry.location.lat(),
													result.geometry.location.lng()
												);
												const patientLocation = new window.google.maps.LatLng(
													geometry.location.lat(),
													geometry.location.lng()
												);
												const directionsService = new window.google.maps.DirectionsService();
												directionsService.route(
													{
														origin: clinicLocation,
														destination: patientLocation,
														travelMode: window.google.maps.TravelMode.DRIVING,
													},
													(result, status) => {
														if (status === window.google.maps.DirectionsStatus.OK) {
															const leg = result.routes[0].legs[0];
															const distance = leg.distance.value;
															const duration = leg.duration.text;
															const distanceInKilometers = distance / 1000;
															
															setDirections(result);
															onDistanceChange(distanceInKilometers, duration);
															setDistance(distance);
															console.log(distance);
														} else {
															console.error(`Error retrieving directions: Status - ${status}`);
														}
													}
												);
											}
										}
									);
									
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

const PrescriptionModal = ({isOpen, onClose, handleSubmitPrescription}) => {
	const [prescriptions, setPrescriptions] = useState([0]);
	
	const addRow = () => {
		setPrescriptions((prevPrescriptions) => [...prevPrescriptions, prevPrescriptions.length]);
	};
	
	const deleteRow = (id) => {
		setPrescriptions((prevPrescriptions) => prevPrescriptions.filter((prescription) => prescription !== id));
	};
	
	return (
			<Modal size="6xl" isCentered isOpen={isOpen} onClose={onClose}>
				<form onSubmit={handleSubmitPrescription}>
					<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(3px) hue-rotate(90deg)"/>
					<ModalContent>
						<ModalHeader>
							Add Prescription
						</ModalHeader>
						<ModalCloseButton _focus={{boxShadow: 'none', outline: 'none'}}/>
						<Divider mb={2} borderWidth="1px" borderColor="blackAlpha.300"/>
						<ModalBody>
							<Flex w='full' alignItems='center' justifyContent='space-between' mb={4}>
								<Text fontSize='sm' fontWeight='light' letterSpacing='wide' mb={3}>Adding a prescription will
									mark the appointment as completed.</Text>
							</Flex>
							{prescriptions.map((prescription, index) => (
								<Flex key={prescription} mb={4} alignItems="center">
									<Input
										flex="1"
										placeholder="Medicine"
										name={`medicine_${prescription}`}
									/>
									<Box mx={2}>
										<FaX size={10} color='grey'/>
									</Box>
									<Input
										flex="0.5"
										placeholder="Qty"
										name={`qty_${prescription}`}
									/>
									<Box mx={2}>
										<FaX size={10} color='grey'/>
									</Box>
									<Input
										flex="0.5"
										placeholder="Unit"
										name={`unit_${prescription}`}
									/>
									<Box mx={2}>
										<FaX size={10} color='grey'/>
									</Box>
									<Input
										flex="1"
										placeholder="Dosage"
										name={`dosage_${prescription}`}
									/>
									<Box mx={2}>
										<FaX size={10} color='grey'/>
									</Box>
									<Input
										flex="2"
										placeholder="Instructions"
										name={`instructions_${prescription}`}
									/>
									{
										index === 0 ? (
											<IconButton aria-label="Add row" icon={<FaPlus/>} colorScheme="green" onClick={addRow}
											            ml={3}/>
										) : (
											<IconButton aria-label="Delete row" icon={<FaTrash/>} colorScheme="red"
											            onClick={() => deleteRow(prescription)} ml={3}/>
										)
									}
								</Flex>
							))}
						</ModalBody>
						<ModalFooter mt={4}>
							<Box display="flex">
								<Button mr={3} backgroundColor="green" color="white" type="submit">
									Submit
								</Button>
								<Button backgroundColor="blue.400" color="white" onClick={onClose}>
									Close
								</Button>
							</Box>
						</ModalFooter>
					</ModalContent>
				</form>
			</Modal>
	);
};

const ArrivalStatusModal = ({isOpen, onClose, handleSubmitArrivalStatus}) => {
	return (
		<Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
			<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(3px) hue-rotate(90deg)"/>
			<ModalContent>
				<ModalHeader>Change Arrival Status</ModalHeader>
				<ModalCloseButton _focus={{boxShadow: 'none', outline: 'none'}}/>
				<Divider mb={2} borderWidth="1px" borderColor="blackAlpha.300"/>
				<ModalBody>
					<Text fontSize='md' fontWeight='medium' letterSpacing='wide' mb={3}>Confirm change of arrival
						status?</Text>
					<Text fontSize='sm' fontWeight='light' letterSpacing='wide' mt={6}>This action cannot be
						undone.</Text>
				</ModalBody>
				<ModalFooter>
					<Box display="flex">
						<Button mr={3} backgroundColor="green" color="white" type="submit"
						        onClick={handleSubmitArrivalStatus}>
							Submit
						</Button>
						<Button backgroundColor="blue.400" color="white" onClick={onClose}>
							Close
						</Button>
					</Box>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export const PendingAppointmentsCard = ({clinic, appointment, form}) => {
	const [distance, setDistance] = useState(null);
	const [duration, setDuration] = useState(null);
	const {isOpen: isOpenArrivalStatus, onOpen: onOpenArrivalStatus, onClose: onCloseArrivalStatus} = useDisclosure();
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {
		handleSubmit,
		formState: {
			errors
		},
		register
	} = form;
	
	const handleDistance = (distance, duration) => {
		setDistance(distance);
		setDuration(duration);
	};
	
	const toast = useToast();
	
	const handleSubmitPrescription = (e) => {
		console.log(e);
		e.preventDefault();
		let data = new FormData(e.target);
		let req = [];
		data = Object.fromEntries(data.entries());
		
		for (const [key, value] of Object.entries(data)) {
			const [field, id] = key.split('_');
			
			if(field !== 'instructions' && value === '') {
				console.log(field, id);
				toast({
					title: "Error",
					description: "Please fill in all fields.",
					position: "top",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
				return;
			}
			
			if (!req[id]) {
				req[id] = {};
			}
			req[id][field] = value;
		}
		
		console.log(req);
		
		prescribe(appointment.id, req).then((res) => {
			if (res.success) {
				toast({
					title: "Success",
					description: "Prescription added.",
					position: "top",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
				onClose();
			} else {
				toast({
					title: "Error",
					description: "Unable to add prescription.",
					position: "top",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		}).catch((err) => {
			toast({
				title: "Error",
				description: "Unable to add prescription.",
				position: "top",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			
			console.log(err);
		});
	}
	
	const handleSubmitArrivalStatus = (data) => {
		console.log(data);
		
		mark_arrived(appointment.id).then((res) => {
			if (res.success) {
				toast({
					title: "Success",
					description: "Arrival status changed.",
					position: "top",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
				onCloseArrivalStatus();
			} else {
				toast({
					title: "Error",
					description: "Unable to change arrival status.",
					position: "top",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		}).catch((err) => {
			toast({
				title: "Error",
				description: "Unable to change arrival status.",
				position: "top",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			
			console.log(err);
		});
	}
	
	
	return (
		<Flex
			w='full'
			rounded='lg'
			my={8}
			position='relative'
			boxShadow="lg"
			bg='white'
		>
			<Box
				w="350px"
				rounded={'lg'}
				h="350px"
			>
				<Map place_id={appointment.patient.place_id} onDistanceChange={handleDistance}
				     clinic_place_id={clinic.place_id}/>
			</Box>
			<Box
				w='full'
				h='64'
				rounded='md'
				gridGap={4}
				gridTemplateColumns="1fr 1fr"
			>
				<Flex px={4} pt={3} direction='column' mb={2}>
					<Box mb={1} w='full'>
						<Flex alignItems='center' mx={3} justifyContent='space-between'>
							<Flex alignItems='center'>
								<FaUser size={20} color='#3f2975'/>
								<Text fontSize='md' fontWeight='bold' letterSpacing='wide' ml={4}>
									{appointment.patient.name}
								</Text>
							</Flex>
							<Flex alignItems='center' gap={6}>
								<Text fontSize='sm' letterSpacing='wide'>
									<Text fontWeight='medium' color='grey'>Distance</Text> {distance} km
								</Text>
								<Text fontSize='sm' letterSpacing='wide'>
									<Text fontWeight='medium' color='grey'>Travel Time</Text> {duration}
								</Text>
							</Flex>
						</Flex>
					</Box>
					<Box mb={1} w='full'>
						<Flex alignItems='center' mx={3}>
							<FaMapLocationDot size={20} color='#3176de'/>
							<Text fontSize='md' fontWeight='semibold' letterSpacing='wide' ml={4}>
								{appointment.patient.address}
							</Text>
						</Flex>
					</Box>
				</Flex>
				
				<Flex px={4}>
					<Flex direction='column' w='full'>
						<Box w='95%' mb={3} ml={3}>
							<Text fontSize='sm' letterSpacing='wide' noOfLines={3}>
								{appointment.illness_description}
							</Text>
						</Box>
						<Flex alignItems='center' mb={2}>
							<Box mb={2} w='full'>
								<Flex alignItems='center' mx={3}>
									{appointment.patient.gender === "Male" ? <BsGenderMale size={20} color='#3f2975'/> :
										<BsGenderFemale size={20} color='#f50057'/>}
									<Text fontSize='sm' letterSpacing='wide' ml={4}>
										<Text fontWeight='medium'
										      color='grey'>Gender</Text> {appointment.patient.gender}
									</Text>
								</Flex>
							</Box>
							<GoDotFill size={40} color='black'/>
							<Box mb={2} w='full'>
								<Flex alignItems='center' justifyContent='center' mx={3}>
									<GiSandsOfTime size={20} color='#964609'/>
									<Text fontSize='sm' letterSpacing='wide' ml={4}>
										<Text fontWeight='medium' color='grey'>Age</Text> {appointment.age}
									</Text>
								</Flex>
							</Box>
							<GoDotFill size={40} color='black'/>
							<Box mb={2} w='full'>
								<Flex alignItems='center' justifyContent='center' mx={3}>
									<BiSolidPhone size={20} color='#3d98ff'/>
									<Text fontSize='sm' letterSpacing='wide' ml={4}>
										<Text fontWeight='medium'
										      color='grey'>Contact</Text> {appointment.patient.contact}
									</Text>
								</Flex>
							</Box>
						</Flex>
						
						<Flex alignItems='center' mb={2}>
							<Box mb={2} w='33.3%'>
								<Flex alignItems='center' mx={3}>
									<BsCalendarDayFill size={20}/>
									<Text fontSize='sm' letterSpacing='wide' ml={4}>
										<Text fontWeight='medium' color='grey'>Appointment Time</Text>
										<Text>{appointment.appointment_time}</Text>
									</Text>
								</Flex>
							</Box>
							<Box mb={2} w='33.3%'>
								<Flex alignItems='center' justifyContent='center' mx={3}>
									<FaCar size={20}/>
									<Text fontSize='sm' letterSpacing='wide' ml={4}>
										<Text fontWeight='medium' color='grey'>Arrival
											Status</Text> {appointment.arrived ? "Arrived" : "On The Way"}
									</Text>
								</Flex>
							</Box>
						</Flex>
						
						<Flex position='absolute' bottom={4} right={4}>
							{
								appointment.arrived ?
									<IconButton
										aria-label="Add Prescription"
										icon={<GiMedicines size={30}/>}
										color='white'
										variant="solid"
										bgColor='blue.500'
										size="lg"
										_hover={{transform: 'scale(1.1)'}}
										_focus={{boxShadow: 'none', outline: 'none'}}
										onClick={(e) => {
											onOpen();
										}}
									/>
									:
									<IconButton
										aria-label="Change Arrival Status"
										icon={<FaCar size={30}/>}
										color='white'
										variant="solid"
										bgColor='blue.500'
										size="lg"
										_hover={{transform: 'scale(1.1)'}}
										_focus={{boxShadow: 'none', outline: 'none'}}
										onClick={(e) => {
											onOpenArrivalStatus();
										}}
									/>
							}
						
						</Flex>
						
						<PrescriptionModal isOpen={isOpen} onClose={onClose} handleSubmitPrescription={handleSubmitPrescription}/>
						<ArrivalStatusModal isOpen={isOpenArrivalStatus} onClose={onCloseArrivalStatus} handleSubmitArrivalStatus={handleSubmitArrivalStatus}/>
					</Flex>
				</Flex>
			</Box>
		</Flex>
	);
}