import {
    Avatar,
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
} from '@chakra-ui/react'
import {BiLinkExternal, BiSolidPhone} from "react-icons/bi";
import {BsCalendarDayFill, BsGenderFemale, BsGenderMale} from "react-icons/bs";
import {FaCar, FaMapLocationDot, FaPlus, FaTrash, FaUser, FaX, FaStethoscope } from "react-icons/fa6";
import { IoIosCheckmarkCircle } from "react-icons/io";
import {GiMedicines, GiSandsOfTime} from "react-icons/gi";
import { MdEmail } from "react-icons/md";
import {GoDotFill} from "react-icons/go";
import {useEffect, useState} from "react";
import {useParams, NavLink} from "react-router-dom";
import {equalTo, get, onValue, orderByChild, query, ref} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {DirectionsRenderer, GoogleMap, InfoWindow, Marker, useLoadScript} from '@react-google-maps/api';

function Map({place_id, onDistanceChange, clinic_place_id}) {
	const mapStyle = {
		height: '450px',
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

const PrescriptionModal = ({isOpen, onClose, prescriptions}) => {
	return (
        <Modal size="6xl" isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(3px) hue-rotate(90deg)"/>
            <ModalContent>
                <ModalHeader>
                    Prescription List
                </ModalHeader>
                <ModalCloseButton _focus={{boxShadow: 'none', outline: 'none'}}/>
                <Divider mb={2} borderWidth="1px" borderColor="blackAlpha.300"/>
                <ModalBody>
                    {prescriptions?.map((prescription, index) => (
                        <Flex key={prescription} mb={4} alignItems="center">
                            <Text w='10%'>{index+=1}</Text>
                            <Box border={'1px'} p={3} w='full' rounded={'md'} ml={3} borderColor={'gray.400'}>
                                <Flex alignItems='center' gap={2}>
                                    <GiMedicines size={20} />
                                    {prescription.medicine ? prescription.medicine : "N/A"}
                                </Flex>
                            </Box>
                            <Box mx={2}>
                                <FaX size={10} color='grey'/>
                            </Box>
                            <Box border={'1px'} rounded={'md'} p={3} w='50%' borderColor={'gray.400'}>
                                <Flex alignItems='center' gap={2}>
                                    <Text fontWeight='bold' letterSpacing='wide'>Quantity: </Text>
                                    {prescription.qty ? prescription.qty : "N/A"}
                                </Flex>
                            </Box>
                            <Box mx={2}>
                                <FaX size={10} color='grey'/>
                            </Box>
                            <Box border={'1px'} rounded={'md'} p={3} w='50%' borderColor={'gray.400'}>
                                <Flex alignItems='center' gap={2}>
                                    <Text fontWeight='bold' letterSpacing='wide'>Unit: </Text>
                                    {prescription.unit ? prescription.unit : "N/A"}
                                </Flex>
                            </Box>
                            <Box mx={2}>
                                <FaX size={10} color='grey'/>
                            </Box>
                            <Box border={'1px'} rounded={'md'} p={3} w='50%' borderColor={'gray.400'}>
                                <Flex alignItems='center' gap={2}>
                                    <Text fontWeight='bold' letterSpacing='wide'>Dosage: </Text>
                                    {prescription.dosage ? prescription.dosage : "N/A"}
                                </Flex>
                            </Box>
                            <Box mx={2}>
                                <FaX size={10} color='grey'/>
                            </Box>
                            <Box border={'1px'} rounded={'md'} p={3} w='full' borderColor={'gray.400'}>
                                <Flex alignItems='center' gap={2}>
                                    <Text fontWeight='bold' letterSpacing='wide'>Instructions: </Text>
                                    {prescription.instructions ? prescription.instructions : "N/A"}
                                </Flex>
                            </Box>
                        </Flex>
                    ))}
                </ModalBody>
                <ModalFooter mt={4}>
                    <Box display="flex">
                        <Button backgroundColor="blue.400" color="white" onClick={onClose}>
                            Close
                        </Button>
                    </Box>
                </ModalFooter>
            </ModalContent>
        </Modal>
	);
};

function PatientAppointmentCard() {
	const {isOpen, onOpen, onClose} = useDisclosure();
	console.log("Patient Appointment")
	const {id} = useParams();
	console.log(id);
	const [appointment, setAppointment] = useState({});

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
		onValue(query(ref(db, `requests/${id}`)), 
		async (snapshot) => {
			console.log(snapshot.val());
			let data = snapshot.val();
			if (data.patient == null) {
				await get(ref(db, `users/${data.uid}`)).then(async (userSnapshot) => {
					await fetchDoctorData(data.doctor).then((doctorData) => {
						data = {
							id: id,
							...data,
							...userSnapshot.val(),
							age: formatAge(userSnapshot.val().dob),
							date: formatDate(data[id].date),
							doctor: doctorData,
						};
					});
				});
			} else {
				await fetchDoctorData(data.doctor).then((doctorData) => {
					data = {
						id: id,
						...data,
						...data.patient,
						age: formatAge(data.patient.dob),
						date: formatDate(data.date),
						doctor: doctorData,
					};
				});
			}
			console.log("Data: ",data);
			setAppointment(data);
		});
	}, [id]);

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
				w='full'
				h='full'
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
									{appointment.patient ? appointment.patient.name : appointment.name}
								</Text>
							</Flex>
						</Flex>
					</Box>
					<Box mb={1} w='full'>
						<Flex alignItems='center' mx={3}>
							<FaMapLocationDot size={20} color='#3176de'/>
							<Text fontSize='md' fontWeight='semibold' letterSpacing='wide' ml={4}>
								{appointment.patient ? appointment.patient.address : appointment.address}
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
									{appointment.patient ? appointment.patient.gender == "Male" ? <BsGenderMale size={20} color='#3f2975'/> : <BsGenderFemale size={20} color='#ff00ff'/> : appointment.gender == "Male" ? <BsGenderMale size={20} color='#3f2975'/> : <BsGenderFemale size={20} color='#ff00ff'/>}
									<Text fontSize='sm' letterSpacing='wide' ml={4}>
										<Text fontWeight='medium'
										      color='grey'>Gender</Text> {appointment.patient ? appointment.patient.gender : appointment.gender}
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
										      color='grey'>Contact</Text> {appointment.patient ? appointment.patient.contact : appointment.phone}
									</Text>
								</Flex>
							</Box>
						</Flex>
						
						<Flex alignItems='center' mb={2}>
							<Box mb={2} w='full'>
								<Flex alignItems='center' mx={3}>
									<BsCalendarDayFill size={20}/>
									<Text fontSize='sm' letterSpacing='wide' ml={4}>
										<Text fontWeight='medium' color='grey'>Appointment Time</Text>
                                        <Text>{appointment.date}</Text>
										<Text>{appointment.appointment_time}</Text>
									</Text>
								</Flex>
							</Box>
                            <GoDotFill size={40} color='black'/>
							<Box mb={2} w='full'>
								<Flex alignItems='center' justifyContent='center' mx={3}>
									<FaCar size={20}/>
									<Text fontSize='sm' letterSpacing='wide' ml={4}>
										<Text fontWeight='medium' color='grey'>Arrival
											Status</Text> {appointment.arrived ? "Arrived" : "On The Way"}
									</Text>
								</Flex>
							</Box>
                            <GoDotFill size={40} color='black'/>
                            <Box mb={2} w='full'>
								<Flex alignItems='center' justifyContent='center' mx={3}>
									<IoIosCheckmarkCircle size={25}/>
									<Text fontSize='sm' letterSpacing='wide' ml={4}>
										<Text fontWeight='medium' color='grey'>Completion
											Status</Text> {appointment.completed ? "Completed" : "Ongoing"}
									</Text>
								</Flex>
							</Box>
						</Flex>

                        <Flex alignItems='center' mb={2}>
							<Box mb={2} w='full'>
								<Flex alignItems='center' mx={3}>
									<Avatar size='xs' src={appointment.doctor?.image}/>
									<Text fontSize='sm' letterSpacing='wide' ml={3}>
										<Text fontWeight='medium' color='grey'>Doctor Name</Text>
                                        <Text>{appointment.doctor?.name}</Text>
									</Text>
								</Flex>
							</Box>
                            <GoDotFill size={40} color='black'/>
							<Box mb={2} w='full'>
								<Flex alignItems='center' justifyContent='center' mx={3}>
									<MdEmail size={20}/>
									<Text fontSize='sm' letterSpacing='wide' ml={4}>
										<Text fontWeight='medium' color='grey'>Doctor Email</Text> 
                                        {appointment.doctor?.email}
									</Text>
								</Flex>
							</Box>
                            <GoDotFill size={40} color='black'/>
                            <Box mb={2} w='full'>
								<Flex alignItems='center' justifyContent='center' mx={3}>
                                <BiSolidPhone size={20} color='#3d98ff'/>
									<Text fontSize='sm' letterSpacing='wide' ml={4}>
										<Text fontWeight='medium' color='grey'>Doctor's
											Contact</Text> {appointment.doctor?.phone}
									</Text>
								</Flex>
							</Box>
						</Flex>

						{appointment.prescriptions?.map((prescription, index) => (
							<Flex key={prescription} mb={4} alignItems="center" mx={4} mt={6}>
								<Text w='10%'>{index+=1}</Text>
								<Box border={'1px'} p={3} w='full' rounded={'md'} ml={3} borderColor={'gray.400'}>
									<Flex alignItems='center' gap={2}>
										<GiMedicines size={20} />
										{prescription.medicine ? prescription.medicine : "N/A"}
									</Flex>
								</Box>
								<Box mx={2}>
									<FaX size={10} color='grey'/>
								</Box>
								<Box border={'1px'} rounded={'md'} p={3} w='50%' borderColor={'gray.400'}>
									<Flex alignItems='center' gap={2}>
										<Text fontWeight='bold' letterSpacing='wide'>Quantity: </Text>
										{prescription.qty ? prescription.qty : "N/A"}
									</Flex>
								</Box>
								<Box mx={2}>
									<FaX size={10} color='grey'/>
								</Box>
								<Box border={'1px'} rounded={'md'} p={3} w='50%' borderColor={'gray.400'}>
									<Flex alignItems='center' gap={2}>
										<Text fontWeight='bold' letterSpacing='wide'>Unit: </Text>
										{prescription.unit ? prescription.unit : "N/A"}
									</Flex>
								</Box>
								<Box mx={2}>
									<FaX size={10} color='grey'/>
								</Box>
								<Box border={'1px'} rounded={'md'} p={3} w='50%' borderColor={'gray.400'}>
									<Flex alignItems='center' gap={2}>
										<Text fontWeight='bold' letterSpacing='wide'>Dosage: </Text>
										{prescription.dosage ? prescription.dosage : "N/A"}
									</Flex>
								</Box>
								<Box mx={2}>
									<FaX size={10} color='grey'/>
								</Box>
								<Box border={'1px'} rounded={'md'} p={3} w='full' borderColor={'gray.400'}>
									<Flex alignItems='center' gap={2}>
										<Text fontWeight='bold' letterSpacing='wide'>Instructions: </Text>
										{prescription.instructions ? prescription.instructions : "N/A"}
									</Flex>
								</Box>
							</Flex>
						))}
					</Flex>
				</Flex>
			</Box>
		</Flex>
	);
}

export default PatientAppointmentCard;