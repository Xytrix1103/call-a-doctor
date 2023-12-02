import {
	Box,
	Button,
	Center,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Grid,
	HStack,
	Image,
	Input,
	InputGroup,
	InputLeftElement,
	Link,
	Select,
	Text,
	Textarea,
	useToast,
} from '@chakra-ui/react';
import {memo, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {db} from "../../../api/firebase.js";
import {onValue, ref} from "firebase/database";
import {useForm} from "react-hook-form";
import {BsFillCloudArrowDownFill} from "react-icons/bs";
import {useAuth} from "../../components/AuthCtx.jsx";
import {Autocomplete, GoogleMap, InfoWindow, Marker} from "@react-google-maps/api";
import {BiLinkExternal, BiSearchAlt2} from "react-icons/bi";
import {update_clinic} from "../../../api/admin.js";

const Map = ({clinic, place, setPlace}) => {
	const mapStyle = {
		height: '270px',
		width: '100%',
	};
	const [libs, setLibs] = useState(["places"]);
	const [mapRef, setMapRef] = useState(null);
	const [center, setCenter] = useState({
		lat: 5.4164,
		lng: 100.3327,
	});
	const [services, setServices] = useState({
		places: null,
		autocomplete: null,
	});
	const inputRef = useRef();
	
	const handlePlaceSelect = () => {
		if (inputRef.current && inputRef.current.getPlace) {
			const place = inputRef.current.getPlace();
			const { geometry, formatted_address, place_id } = place;
			console.log(place);
			const { location } = geometry;
			mapRef.panTo({ lat: location.lat(), lng: location.lng() });
			setPlace({
				lat: location.lat(),
				lng: location.lng(),
				address: formatted_address,
				place_id: place_id,
			});
		}
	};
	
	const getMapsLink = () => {
		if (place) {
			const { name } = place;
			return `https://www.google.com/maps/search/?api=1&query=${name}`;
		}
	}
	
	useEffect(() => {
		if (mapRef && clinic?.place_id) {
			const autocompleteService = new window.google.maps.places.AutocompleteService();
			const placesService = new window.google.maps.places.PlacesService(mapRef);
			
			setServices({
				autocomplete: autocompleteService,
				places: placesService,
			});
			
			console.log("Fetching place details for user's address");
			
			placesService.getDetails(
				{placeId: clinic.place_id},
				(result, status) => {
					if (status === window.google.maps.places.PlacesServiceStatus.OK) {
						console.log("Place details: ", result);
						const {geometry, formatted_address} = result;
						const {location} = geometry;
						
						setMapRef((prevMap) => {
							console.log("Setting map center");
							prevMap.panTo({lat: location.lat(), lng: location.lng()});
							return prevMap;
						});
						
						setPlace({
							lat: location.lat(),
							lng: location.lng(),
							address: formatted_address,
							place_id: clinic.place_id,
						});
					} else {
						console.error(`Error retrieving place details: Status - ${status}`);
					}
				}
			);
		} else if (mapRef && clinic?.address) {
			const autocompleteService = new window.google.maps.places.AutocompleteService();
			const placesService = new window.google.maps.places.PlacesService(mapRef);
			
			setServices({
				autocomplete: autocompleteService,
				places: placesService,
			});
			
			console.log("Fetching place details for user's address");
			
			autocompleteService.getPlacePredictions(
				{input: clinic.address},
				(predictions, status) => {
					console.log("Predictions: ", predictions);
					if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
						const place_id = predictions[0].place_id;
						console.log("Fetching details for place_id: ", place_id);
						
						placesService.getDetails(
							{placeId: place_id},
							(result, status) => {
								if (status === window.google.maps.places.PlacesServiceStatus.OK) {
									console.log("Place details: ", result);
									const {geometry, formatted_address} = result;
									const {location} = geometry;
									console.log("Location: ", location);
									
									setMapRef((prevMap) => {
										console.log("Setting map center");
										prevMap.panTo({lat: location.lat(), lng: location.lng()});
										return prevMap;
									});
									
									setPlace({
										lat: location.lat(),
										lng: location.lng(),
										address: formatted_address,
										place_id: place_id,
									});
								} else {
									console.error(`Error retrieving place details: Status - ${status}`);
								}
							}
						);
					} else {
						console.error(`Error retrieving place predictions: Status - ${status}`);
					}
				}
			).then(r => console.log(r));
		}
	}, [mapRef, clinic?.address]);
	
	useEffect(() => {
		if(navigator.geolocation) {
			console.log("Geolocation is supported by this browser.");
			navigator.geolocation.getCurrentPosition((position) => {
				console.log(position);
				setCenter({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
			});
		}
	}, []);
	
	return (
		<>
			<Box
				mb={3}
				mt={2}
				w="full"
			>
				<Autocomplete
					onLoad={(autocomplete) => {
						inputRef.current = autocomplete;
						autocomplete.setFields(["geometry", "formatted_address", "place_id"]);
					}}
					onPlaceChanged={handlePlaceSelect}
				>
					<InputGroup size="md">
						<InputLeftElement
							pointerEvents="none"
							children={<BiSearchAlt2 color="gray.500" />}
						/>
						<Input
							type='text'
							placeholder="Search for home location..."
							ref={inputRef}
							focusBorderColor='blue.500'
						/>
					</InputGroup>
				</Autocomplete>
			</Box>
			<GoogleMap
				onLoad={(map) => {
					setMapRef(map);
				}}
				center={center}
				zoom={15} // Adjust the zoom level as needed
				mapContainerStyle={mapStyle}
			>
				{place && (
					<>
						<Marker
							position={{ lat: place.lat, lng: place.lng }}
						/>
						<InfoWindow
							position={{ lat: place.lat + 0.0015, lng: place.lng }}
						>
							<Box p={1} maxW="sm">
								<Text fontSize="sm" fontWeight="medium">
									{place.name}
								</Text>
								<Text fontSize="xs" fontWeight="medium" color="gray.500" mt={1} mb={2}>
									{place.address}
								</Text>
								<Link href={getMapsLink()} isExternal target="_blank" rel="noreferrer" _hover={{textDecoration: "none"}} textDecoration="none" onClick={(e) => e.stopPropagation()}>
									<HStack spacing={1} fontSize="xs" fontWeight="medium" color="blue.500">
										<Text outline="none">View on Google Maps</Text>
										<BiLinkExternal/>
									</HStack>
								</Link>
							</Box>
						</InfoWindow>
					</>
				)}
			</GoogleMap>
		</>
	);
}

const MemoizedMap = memo(Map);

function EditApprovedClinicDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const imageRef = useRef(null);
	const {
		register,
		getValues,
		trigger,
		setValue,
		handleSubmit,
		formState: {
			errors
		}
	} = useForm();
	const previewImageRef = useRef(null);
	const previewImageContainerRef = useRef(null);
	const {user} = useAuth();
	const toast = useToast();
	
	const [clinic, setClinic] = useState(null);
	const [place, setPlace] = useState(null);
	const [isDragActive, setIsDragActive] = useState(false);
	const [imageSrc, setImageSrc] = useState(null);
	
	const startTimeOptions = [
		"08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
		"12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
		"04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
		"08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"
	];
	
	const daysOfWeek = [
		"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
	];
	
	const [selectedStartTime, setSelectedStartTime] = useState(startTimeOptions[0]);
	const [selectedEndTime, setSelectedEndTime] = useState(startTimeOptions[1]); // Default value is the next time option
	const [selectedStartDay, setSelectedStartDay] = useState(daysOfWeek[0]);
	const [selectedEndDay, setSelectedEndDay] = useState(daysOfWeek[1]); // Default value is the next day
	
	const handleDragEnter = (e) => {
		e.preventDefault();
		setIsDragActive(true);
	};
	
	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragActive(true);
	};
	
	const handleDragLeave = () => {
		setIsDragActive(false);
	};
	
	const populatePreviewImage = (file) => {
		if (file) {
			console.log(file);
			// Read the file and set the image source
			const reader = new FileReader();
			reader.onload = (event) => {
				setImageSrc(event.target.result);
			};
			reader.readAsDataURL(file);
		} else {
			console.log("No file");
			setImageSrc(null);
		}
	}
	
	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragActive(false);
		const file = e.dataTransfer.files[0];
		imageRef.current.files = e.dataTransfer.files;
		populatePreviewImage(file);
	};
	
	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		populatePreviewImage(file);
	};
	
	useEffect(() => {
		if (id) {
			onValue(ref(db, `clinics/${id}`), (snapshot) => {
				setClinic({
					...snapshot.val(),
					id: snapshot.key,
				});
			});
		} else {
			onValue(ref(db, `clinics/${user?.clinic}`), (snapshot) => {
				setClinic({
					...snapshot.val(),
					id: snapshot.key,
				});
			});
		}
	}, []);
	
	useEffect(() => {
		if (clinic) {
			setSelectedStartTime(clinic.start_time);
			setSelectedEndTime(clinic.end_time);
			setSelectedStartDay(clinic.start_day);
			setSelectedEndDay(clinic.end_day);
			setValue("name", clinic.name);
			setValue("address", clinic.address);
			setValue("contact", clinic.contact);
			setValue("specialist_clinic", clinic.specialist_clinic || "");
			setImageSrc(clinic.image);
		}
	} , [clinic]);
	
	useEffect(() => {
		if (place && place.place_id !== clinic?.place_id) {
			setValue("address", place.address);
		}
	}, [place]);
	
	const onSubmit = async (data) => {
		console.log(data);
		
		if (!place?.place_id) {
			toast({
				title: "Error",
				description: "Please select a valid address in the map",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			return;
		} else {
			data.place_id = place.place_id;
		}
		
		if (imageSrc !== clinic?.image && imageRef.current.files.length > 0) {
			data['image'] = imageRef.current.files[0];
		} else {
			data['image'] = null;
		}
		
		data['start_time'] = selectedStartTime;
		data['end_time'] = selectedEndTime;
		data['start_day'] = selectedStartDay;
		data['end_day'] = selectedEndDay;
		
		let update = {};
		
		for (const key in data) {
			if (data[key] !== clinic[key]) {
				console.log(key, data[key], clinic[key]);
				if (key === "image" && data[key] === null) {
					continue;
				}
				if (key === "specialist_clinic" && data[key] === "") {
					update[key] = null;
				} else {
					update[key] = data[key];
				}
			}
		}
		
		console.log(update);
		
		if (Object.keys(update).length > 0) {
			console.log(update);
		} else {
			toast({
				title: "Error",
				description: "No changes detected",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			
			return;
		}
		
		update_clinic(clinic.id, update).then((res) => {
			if (res.error) {
				toast({
					title: "Error",
					description: "An error occurred while updating clinic details",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "top",
				});
			} else {
				toast({
					title: "Success",
					description: "Clinic details updated successfully",
					status: "success",
					duration: 5000,
					isClosable: true,
					position: "top",
				});
			}
			
			navigate("/admin/clinics");
		}).catch((err) => {
			toast({
				title: "Error",
				description: "An error occurred while updating clinic details",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			
			console.error(err);
		});
	}

    return (
        <Center w="100%" h="auto" bg="#f4f4f4">
        <Flex
            w="85%"
            h="full"
            bg="white"
            boxShadow="xl"
            rounded="xl"
            px={8}
            py={4}
            direction="column"
        >
            <Flex justifyContent="center" alignItems="center" mb={4}>
                <Box w="full">
                    <Text fontSize="xl" fontWeight="bold">
                        Edit Clinic
                    </Text>
                </Box>
            </Flex>
            <Flex w="full" h="full" grow={1} direction="column">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} w="full" h="full">
                        <Box w="full" h="full">
                            <Box w="full">
                                <FormControl isInvalid={errors.name}>
                                    <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900" requiredIndicator>
                                        Clinic Name <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                    </FormLabel>
                                    <Input
                                        variant="filled"
                                        type="text"
                                        id="clinic_name"
                                        {
                                            ...register("name", {
                                                required: "Clinic name cannot be empty",
                                            })
                                        }
                                        placeholder="Clinic A"
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        defaultValue={clinic?.name}
                                        size="md"
                                        focusBorderColor="blue.500"
                                        w="full"
                                        p={2.5}
                                    />
                                    <FormErrorMessage>
                                        {errors.name && errors.name.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </Box>
                            <Flex alignItems="center" justifyContent="space-between">
                                <Box flex="1">
                                    <Text fontSize="sm" fontWeight="medium" color="gray.900" mt={6} mb={2}>
                                        Operating Hours <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                    </Text>
                                    <Flex alignItems="center">
                                        <FormControl isInvalid={errors.start_time}>
                                            <Select
                                                variant="filled"
                                                name="start_time"
                                                id="start_time"
                                                rounded="xl"
                                                borderWidth="1px"
                                                borderColor="gray.300"
                                                color="gray.900"
                                                size="md"
                                                value={selectedStartTime}
                                                onChange={(e) => setSelectedStartTime(e.target.value)}
                                                focusBorderColor="blue.500"
                                            >
                                                {startTimeOptions.filter((time, i) => i < startTimeOptions.length - 1).map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Text mx={3} fontSize="md" color="gray.900">
                                            to
                                        </Text>
                                        <FormControl isInvalid={errors.end_time}>
                                            <Select
                                                variant="filled"
                                                name="end_time"
                                                id="end_time"
                                                rounded="xl"
                                                borderWidth="1px"
                                                borderColor="gray.300"
                                                color="gray.900"
                                                size="md"
                                                value={selectedEndTime}
                                                onChange={(e) => setSelectedEndTime(e.target.value)}
                                                focusBorderColor="blue.500"
                                            >
                                                {startTimeOptions.filter((time) => startTimeOptions.indexOf(time) > startTimeOptions.indexOf(selectedStartTime)).map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Flex>
                                </Box>
                                <Box flex="1" ml={4}>
                                    <Text mt={6} mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                        Operating Days <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                    </Text>
                                    <Flex alignItems="center">
                                        <FormControl isInvalid={errors.start_day}>
                                            <Select
                                                variant="filled"
                                                name="start_day"
                                                id="start_day"
                                                rounded="xl"
                                                borderWidth="1px"
                                                borderColor="gray.300"
                                                color="gray.900"
                                                size="md"
                                                value={selectedStartDay}
                                                onChange={(e) => setSelectedStartDay(e.target.value)}
                                                focusBorderColor="blue.500"
                                            >
                                                {daysOfWeek.filter((day, i) => i < daysOfWeek.length - 1).map((day) => (
                                                    <option key={day} value={day}>
                                                        {day}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Text mx={3} fontSize="md" color="gray.900">
                                            to
                                        </Text>
                                        <FormControl isInvalid={errors.end_day}>
                                            <Select
                                                variant="filled"
                                                name="end_day"
                                                id="end_day"
                                                rounded="xl"
                                                borderWidth="1px"
                                                borderColor="gray.300"
                                                color="gray.900"
                                                size="md"
                                                value={selectedEndDay}
                                                onChange={(e) => setSelectedEndDay(e.target.value)}
                                                focusBorderColor="blue.500"
                                            >
                                                {daysOfWeek.filter((day) => daysOfWeek.indexOf(day) > daysOfWeek.indexOf(selectedStartDay)).map((day) => (
                                                    <option key={day} value={day}>
                                                        {day}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Flex>
                                </Box>
                            </Flex>
                            
                            <Box
                                mb={2}
                                mt={6}
                                w="full"
                            >
                                <FormControl>
                                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                                        Specialist Clinic (Optional)
                                    </FormLabel>
                                    <Select
                                        variant="filled"
                                        name="specialist_clinic"
                                        id="specialist_clinic"
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        size="md"
                                        focusBorderColor="blue.500"
                                        {
                                            ...register("specialist_clinic")
                                        }
                                    >
                                        <option value="">General (No Specialization)</option>
                                        <option value="Allergy and Clinical Immunology">Allergy and Clinical Immunology</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Dermatology">Dermatology</option>
                                        <option value="Endocrinology">Endocrinology</option>
                                        <option value="Gastroenterology">Gastroenterology</option>
                                        <option value="Geriatric Medicine">Geriatric Medicine</option>
                                        <option value="Haematology">Haematology</option>
                                        <option value="Immunology">Immunology</option>
                                        <option value="Infectious Diseases">Infectious Diseases</option>
                                        <option value="Nephrology">Nephrology</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Oncology">Oncology</option>
                                        <option value="Paediatrics">Paediatrics</option>
                                        <option value="Psychiatry">Psychiatry</option>
                                        <option value="Rheumatology">Rheumatology</option>
                                        <option value="Urology">Urology</option>
                                        <option value="Pulmonology">Pulmonology</option>
                                        <option value="Otolaryngology (ENT)">Otolaryngology (ENT)</option>
                                        <option value="Gynecology">Gynecology</option>
                                        <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                                        <option value="Dental Surgery">Dental Surgery</option>
                                        <option value="Ophthalmology">Ophthalmology</option>
                                        <option value="Dietetics">Dietetics</option>
                                        <option value="Radiology">Radiology</option>
                                        <option value="Physical Therapy">Physical Therapy</option>
                                        <option value="Sports Medicine">Sports Medicine</option>
                                        <option value="Pain Management">Pain Management</option>
                                        <option value="Hematopathology">Hematopathology</option>
                                        <option value="Forensic Pathology">Forensic Pathology</option>
                                        <option value="Clinical Pathology">Clinical Pathology</option>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box mb={2} mt={6}>
                                <FormControl isInvalid={errors.contact}>
                                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                                        Contact Number <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                    </FormLabel>
                                    <Input
                                        variant="filled"
                                        type="tel"
                                        id="contact"
                                        {
                                            ...register("contact", {
                                                required: "Contact number cannot be empty",
                                            })
                                        }
                                        placeholder="04-345-6789"
                                        defaultValue={clinic?.contact}
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
                            <Box mb={2} mt={6}>
                                <FormControl isInvalid={errors.address}>
                                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                                        Address <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                    </FormLabel>
                                    <Textarea
                                        variant="filled"
                                        name="address"
                                        id="address"
                                        placeholder="Enter clinic address here..."
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        size="md"
                                        focusBorderColor="blue.500"
                                        defaultValue={clinic?.address}
                                        w="full"
                                        p={2.5}
                                        rows={5}
                                        {
                                            ...register("address", {
                                                required: "Address cannot be empty",
                                            })
                                        }
                                    />
                                    <FormErrorMessage>
                                        {errors.address && errors.address.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </Box>
                            <Box mb={2} mt={6}>
                                <Button
                                    type="submit"
                                    w="full"
                                    h="auto"
                                    bg="blue.500"
                                    color="white"
                                    _hover={{bg: "blue.600"}}
                                    _active={{bg: "blue.700"}}
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    rounded="xl"
                                    px={6}
                                    py={3}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </Box>
                        <Box w="full">
                            <FormControl w="full" h="full" display="grid" gridTemplateRows="auto 1fr auto" gridGap={4}>
                                <Box>
                                    <MemoizedMap clinic={clinic} place={place} setPlace={setPlace}/>
                                </Box>
                                <Box>
                                    <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                        Clinic Image <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                    </FormLabel>
                                    <Box
                                        onDragEnter={handleDragEnter}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        rounded="lg"
                                        borderWidth="2px"
                                        border={"dashed"}
                                        borderColor={isDragActive ? "blue.500" : "gray.300"}
                                        p={8}
                                        textAlign="center"
                                        position={"relative"}
                                        cursor="pointer"
                                    >
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            opacity={0}
                                            width="100%"
                                            height="100%"
                                            position="absolute"
                                            top={0}
                                            left={0}
                                            zIndex={1}
                                            cursor="pointer"
                                            ref={imageRef}
                                            onChange={handleFileInputChange}
                                        />
                                        <Flex direction="column" alignItems="center">
                                            <BsFillCloudArrowDownFill
                                                onDragEnter={handleDragEnter}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                size={32}
                                                color={isDragActive ? "blue" : "gray"}
                                            />
                                            <Text mb={2} fontSize="sm" fontWeight="semibold">
                                                {isDragActive ? "Drop the file here" : "Drag & Drop or Click to upload"}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                                (SVG, PNG, JPG, or JPEG)
                                            </Text>
                                        </Flex>
                                    </Box>
                                </Box>
                                <Box
                                    w="full"
                                    h="auto"
                                    id="preview-image-container"
                                    bg={!imageSrc ? "gray.200" : "transparent"}
                                    rounded="lg"
                                    display="flex"
                                    flexDir="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    mt={4}
                                    ref={previewImageContainerRef}
                                >
                                    <Image
                                        id="preview-image"
                                        src={imageSrc || ""}
                                        alt="Preview"
                                        display={imageSrc ? "block" : "none"}
                                        ref={previewImageRef}
                                        w="full"
                                        h="64"
                                        objectFit="cover"
                                    />
                                </Box>
                            </FormControl>
                        </Box>
                    </Grid>
                </form>
            </Flex>
        </Flex>
    </Center>
    );
}

export default EditApprovedClinicDetails;