import {
	Box,
	Button,
	Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
	Flex,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Grid,
	HStack,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Link,
	Select,
	Text,
	Textarea,
	useToast,
} from '@chakra-ui/react';
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {memo, useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {BiLinkExternal, BiSearchAlt2} from "react-icons/bi";
import {Autocomplete, GoogleMap, InfoWindow, LoadScript, Marker} from "@react-google-maps/api";
import {update_patient} from "../../../../api/admin.js";
import {useNavigate} from "react-router-dom";
import {register as registerUser} from "../../../../api/auth.js";

const Map = ({user, place, setPlace}) => {
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
        if (mapRef && user?.address) {
            const autocompleteService = new window.google.maps.places.AutocompleteService();
            const placesService = new window.google.maps.places.PlacesService(mapRef);
    
            setServices({
                autocomplete: autocompleteService,
                places: placesService,
            });
    
            console.log("Fetching place details for user's address");
    
            autocompleteService.getPlacePredictions(
	            {input: user.address},
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
    }, [mapRef, user]);
	
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
		<LoadScript
			googleMapsApiKey="AIzaSyCxkZ_qonH-WY9cbiHZsUgp9lE3PdkWH_A"
			libraries={libs}
		>
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
		</LoadScript>
	);
}

const MemoizedMap = memo(Map);

export const PatientForm = ({user}) => {
    console.log("PatientForm");
    const {
        setValue,
		handleSubmit,
		register,
	    trigger,
		formState: {
			errors
		}
	} = useForm();
	const [place, setPlace] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const toast = useToast();
	const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log('Submitting patient form', data);
		
		if (!place) {
			toast({
				title: "Failed to add patient.",
				description: "Please select a location",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top"
			});
			return;
		}
	    
	    if (!user) {
		    await trigger();
		    const password = data["password"];
		    const confirm_password = data["confirm_password"];
		    
		    if (password !== confirm_password) {
			    alert("Passwords do not match!");
			    return;
		    }
			
			data = {
				...data,
				place_id: place.place_id,
				role: "Patient",
			}
			
			console.log(data);
		    
		    registerUser(data, true).then((res) => {
			    console.log(res);
			    if (res.error) {
				    toast({
					    title: "Error!",
					    description: res.error,
					    status: "error",
					    duration: 5000,
					    isClosable: true,
				    });
			    } else {
				    toast({
					    title: "Success!",
					    description: "Clinic admin has been registered!",
					    status: "success",
					    duration: 5000,
					    isClosable: true,
				    });
				    navigate('/admin/users');
			    }
		    }).catch((err) => {
			    console.log(err);
			    toast({
				    title: "Error!",
				    description: "An error has occurred!",
				    status: "error",
				    duration: 5000,
				    isClosable: true,
			    });
		    });
	    } else {
		    await trigger(['name', 'phone', 'address', 'dob']);
		    let update = {};
		    
		    //loop thru form values
		    for (const [key, value] of Object.entries(data)) {
			    if (value !== user[key] && key !== 'confirm_password' && key !== 'password' && key !== 'email') {
				    update[key] = value;
			    }
		    }
		    
		    if (Object.keys(update).length > 0) {
			    update_patient(user.uid, update).then((res) => {
				    console.log(res);
				    if (res.error) {
					    toast({
						    title: "Error!",
						    description: res.error,
						    status: "error",
						    duration: 5000,
						    isClosable: true,
					    });
				    } else {
					    toast({
						    title: "Success!",
						    description: "User has been updated!",
						    status: "success",
						    duration: 5000,
						    isClosable: true,
					    });
					    navigate('/admin/users');
				    }
			    }).catch((err) => {
				    console.log(err);
				    toast({
					    title: "Error!",
					    description: "An error has occurred!",
					    status: "error",
					    duration: 5000,
					    isClosable: true,
				    });
			    });
		    }
	    }
    }

    useEffect(() => {
        if (user) {
            setValue('name', user?.name);
            setValue('email', user?.email);
            setValue('phone', user?.phone);
            setValue('address', user?.address);
            setValue('dob', user?.dob);
        } else {
			setValue('name', null);
			setValue('email', null);
			setValue('phone', null);
			setValue('address', null);
			setValue('dob', null);
	       
        }
	}, [user]);
	
	useEffect(() => {
		if(place) {
			setValue('address', place.address);
		}
	}, [place]);

	const {
        isOpen: isPasswordModalOpen,
        onOpen: onOpenPasswordModal,
        onClose: onClosePasswordModal,
    } = useDisclosure();

    const {
        isOpen: isEmailModalOpen,
        onOpen: onOpenEmailModal,
        onClose: onCloseEmailModal,
    } = useDisclosure();

    const handleOpenPasswordModal = () => {
        onOpenPasswordModal();
    };

    const handleOpenEmailModal = () => {
        onOpenEmailModal();
    };

    const handleEmailSubmit = (data) => {
        console.log(data);
        console.log("Submitting email modal")

    };

    const handlePasswordSubmit = (data) => {
        console.log(data);
        console.log("Submitting password modal");

    };

    return (
        <form action="/api/register" method="post" onSubmit={handleSubmit(onSubmit)}>
            <Grid templateColumns="repeat(2, 1fr)" gap={8} w="full" h="full" px={5}>
                <Box w="full" h="full">
                    <Box w="full">
                        <FormControl isInvalid={errors.name}>
                            <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900" >
                                Name <Text as="span" color="red.500" fontWeight="bold">*</Text>
                            </FormLabel>
                            <Input
                                variant="filled"
                                type="text"
                                id="name"
                                {
                                    ...register("name", {
                                        required: "Name cannot be empty",
                                    })
                                }
                                placeholder="John Doe"
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
                                {errors.name && errors.name.message}
                            </FormErrorMessage>
                        </FormControl>
                    </Box>

                    <Box w="full" mt={6}>
                        <FormControl isInvalid={errors.email}>
                            <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900" >
                                Email <Text as="span" color="red.500" fontWeight="bold">*</Text>
                            </FormLabel>
                            <Input
                                variant="filled"
                                type="email"
                                id="email"
                                {
                                    ...register("email", {
                                        required: "Email cannot be empty",
                                    })
                                }
	                            disabled={!!user}
                                placeholder="john.doe@gmail.com"
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
                                {errors.email && errors.email.message}
                            </FormErrorMessage>
                        </FormControl>
                    </Box>

                    <Flex alignItems="center" justifyContent="space-between" mt={6}>
                        <Box flex="1" mr={4}>
                            <FormControl isInvalid={errors.dob}>
                                <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900" >
                                    Date of Birth <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                </FormLabel>
                                <InputGroup size="md">
                                    <Input
                                        variant="filled"
                                        type="date"
                                        name="dob"
                                        id="dob"
                                        {
                                            ...register("dob", {
                                                required: "Date of birth cannot be empty",
                                            })
                                        }
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        size="md"
                                        focusBorderColor="blue.500"
                                    />
                                </InputGroup>
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
                                    isRequired
                                    borderColor="gray.300"
                                    color="gray.900"
                                    size="md"
                                    focusBorderColor="blue.500"
                                    defaultValue="Male"
                                >
                                    <option value="Male" selected={user?.gender === "Male"}>Male</option>
                                    <option value="Female" selected={user?.gender === "Female"}>Female</option>
                                </Select>
                            </FormControl>
                        </Box>
                    </Flex>
                    <Box mb={2} mt={6}>
                        <FormControl fontSize="sm" fontWeight="medium" color="gray.900"  id="phone" isInvalid={errors.phone} >
                            <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                                Contact Number <Text as="span" color="red.500" fontWeight="bold">*</Text>
                            </FormLabel>
                            <Input
                                variant="filled"
                                type="tel"
                                name="phone"
                                id="phone"
                                placeholder="+60 12-345 6789"
                                rounded="xl"
                                borderWidth="1px"
                                borderColor="gray.300"
                                color="gray.900"
                                size="md"
                                focusBorderColor="blue.500"
                                w="full"
                                p={2.5}
                                {
                                    ...register("phone", {
                                        required: "Contact Number is required",
                                        pattern: {
                                            value: /^(\+?\d{1,3}[- ]?)?\d{10}$/,
                                            message: "Invalid phone number format",
                                        },
                                    })
                                }
                            />
                            <FormErrorMessage>
                                {errors.phone && errors.phone.message}
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

                </Box>
                <Box w="full" h="full">
                    <Box mb={2}>
                        <MemoizedMap user={user} place={place} setPlace={setPlace}/>
                    </Box>

					{
						user && (
							<>
								<Flex mt={6} w='full' justifyContent='space-between' alignItems='center' gap={10}>
									<Button 
										w='full' 
										onClick={(e) => {
											handleOpenEmailModal();
										}}
										_hover={{ transform: 'scale(1.02)' }}
										_focus={{ boxShadow: 'none', outline: 'none' }}    
									>
										Edit Email
									</Button>
									<Modal isOpen={isEmailModalOpen} onClose={onCloseEmailModal} size='xl' isCentered>
										<form onSubmit={handleSubmit(handleEmailSubmit)}> 
											<ModalOverlay 
												bg='blackAlpha.300'
												backdropFilter='blur(3px) hue-rotate(90deg)'
											/>
											<ModalContent>
												<ModalHeader>Edit Email</ModalHeader>
												<ModalCloseButton />
												<ModalBody>
													<FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900" id="email" isInvalid={errors.email}>
														<FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
															Email <Text as="span" color="red.500" fontWeight="bold">*</Text>
														</FormLabel>
														<Input
															variant="filled"
															type="email"
															name="email"
															id="email"
															placeholder="john.doe@gmail.com"
															rounded="xl"
															borderWidth="1px"
															borderColor="gray.300"
															color="gray.900"
															size="md"
															focusBorderColor="blue.500"
															w="full"
															p={2.5}
															{
																...register("email", {
																	required: "Email is required",
																})
															}
														/>
														<FormErrorMessage>
															{errors.email && errors.email.message}
														</FormErrorMessage>
													</FormControl>
												</ModalBody>
												<ModalFooter>
													<Button colorScheme="blue" type='button' onClick={handleEmailSubmit}>
														Save Changes
													</Button>
												</ModalFooter>
											</ModalContent>                        
										</form>
									</Modal>  

									<Button 
										w='full' 
										onClick={(e) => {
											handleOpenPasswordModal();
										}}
										_hover={{ transform: 'scale(1.02)' }}
										_focus={{ boxShadow: 'none', outline: 'none' }}    
									>
										Edit Password
									</Button>
									<Modal isOpen={isPasswordModalOpen} onClose={onClosePasswordModal} size='xl' isCentered>
										<form onSubmit={handleSubmit(handlePasswordSubmit)}>
											<ModalOverlay 
												bg='blackAlpha.300'
												backdropFilter='blur(3px) hue-rotate(90deg)'
											/>
											<ModalContent>
												<ModalHeader>Password Modal</ModalHeader>
												<ModalCloseButton />
												<ModalBody>
													<FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900" id="password" isInvalid={errors.password}>
														<FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
															Password
														</FormLabel>
														<InputGroup>
															<Input
																type={showPassword ? 'text' : 'password'}
																variant="filled"
																name="password"
																placeholder="•••••••••"
																rounded="xl"
																borderWidth="1px"
																borderColor="gray.300"
																color="gray.900"
																size="md"
																focusBorderColor="blue.500"
																{
																	...register("password", {
																		required: "Password is required",
																		pattern: {
																			value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
																			message: "Invalid password format",
																		},            
																	})
																}
															/>
															<InputRightElement>
															<IconButton
																aria-label="Show password"
																size="lg"
																variant="ghost"
																icon={showPassword ? <IoMdEyeOff /> : <IoMdEye />}
																onClick={() => setShowPassword(!showPassword)}
																tabIndex="-1"
															/>
															</InputRightElement>
														</InputGroup>
														<FormHelperText fontSize="xs">
															Minimum eight characters, at least one uppercase letter, one lowercase letter,
															one number and one special character
														</FormHelperText>
														<FormErrorMessage>
															{errors.password && errors.password.message}
														</FormErrorMessage>
													</FormControl>
													<FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900" id="confirm_password" isInvalid={errors.confirm_password}>
														<FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
															Confirm Password
														</FormLabel>
														<InputGroup>
															<Input
																type={showConfirmPassword ? 'text' : 'password'}
																name="confirm_password"
																variant="filled"
																placeholder="•••••••••"
																rounded="xl"
																borderWidth="1px"
																borderColor="gray.300"
																color="gray.900"
																size="md"
																focusBorderColor="blue.500"
																{
																	...register("confirm_password", {
																		required: "Confirm password is required",
																		pattern: {
																			value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
																			message: "Invalid password format",
																		},            
																	})
																}
															/>
															<InputRightElement>
															<IconButton
																aria-label="Show password"
																size="lg"
																variant="ghost"
																icon={showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
																onClick={() => setShowConfirmPassword(!showConfirmPassword)}
																tabIndex="-1"
															/>
															</InputRightElement>
														</InputGroup>
														<FormErrorMessage>
															{errors.confirm_password && errors.confirm_password.message}
														</FormErrorMessage>
													</FormControl>
												</ModalBody>
												<ModalFooter>
													<Button colorScheme="blue" type='button' onClick={handlePasswordSubmit}>
														Save Changes
													</Button>
												</ModalFooter>
											</ModalContent>
										</form>
									</Modal>
								</Flex>
							</>
						)
					}
	                {
						!user && (
							<>
								<Box mb={2} mt={6}>
									<FormControl id="password" isInvalid={errors.password}>
										<FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
											Password
										</FormLabel>
										<InputGroup>
											<Input
												type={showPassword ? 'text' : 'password'}
												variant="filled"
												name="password"
												id="password"
												placeholder="•••••••••"
												rounded="xl"
												borderWidth="1px"
												borderColor="gray.300"
												color="gray.900"
												size="md"
												focusBorderColor="blue.500"
												w="full"
												p={2.5}
												{
													...register("password", {
														required: "Password cannot be empty",
														pattern: {
															value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/,
															message: "Invalid password format",
														},
													})
												}
											/>
											<InputRightElement>
												<IconButton aria-label="Show password" size="lg" variant="ghost"
												            icon={showPassword ? <IoMdEyeOff/> : <IoMdEye/>}
												            _focus={{
													            bg: "transparent",
													            borderColor: "transparent",
													            outline: "none"
												            }}
												            _hover={{
													            bg: "transparent",
													            borderColor: "transparent",
													            outline: "none"
												            }}
												            _active={{
													            bg: "transparent",
													            borderColor: "transparent",
													            outline: "none"
												            }}
												            tabIndex="-1"
												            onClick={() => setShowPassword(!showPassword)}/>
											</InputRightElement>
										</InputGroup>
										{
											errors.password ?
												<FormErrorMessage>
													{errors.password && errors.password.message}
												</FormErrorMessage> :
												<FormHelperText fontSize="xs">
													Minimum eight characters, at least one uppercase letter, one lowercase letter,
													one number and one special character
												</FormHelperText>
										}
									</FormControl>
								</Box>
								<Box mb={2} mt={6}>
									<FormControl id="confirm_password" isInvalid={errors.confirm_password}>
										<FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
											Confirm Password
										</FormLabel>
										<InputGroup>
											<Input
												type={showConfirmPassword ? 'text' : 'password'}
												name="confirm_password"
												id="confirm_password"
												variant="filled"
												placeholder="•••••••••"
												rounded="xl"
												borderWidth="1px"
												borderColor="gray.300"
												color="gray.900"
												size="md"
												focusBorderColor="blue.500"
												w="full"
												p={2.5}
												{
													...register("confirm_password", {
														required: "Confirm password cannot be empty",
														pattern: {
															value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
															message: "Invalid password format",
														},
													})
												}
											/>
											<InputRightElement>
												<IconButton aria-label="Show password" size="lg" variant="ghost"
												            icon={showConfirmPassword ? <IoMdEyeOff/> : <IoMdEye/>}
												            _focus={{
													            bg: "transparent",
													            borderColor: "transparent",
													            outline: "none"
												            }}
												            _hover={{
													            bg: "transparent",
													            borderColor: "transparent",
													            outline: "none"
												            }}
												            _active={{
													            bg: "transparent",
													            borderColor: "transparent",
													            outline: "none"
												            }}
												            tabIndex="-1"
												            onClick={() => setShowConfirmPassword(!showConfirmPassword)}/>
											</InputRightElement>
										</InputGroup>
										<FormErrorMessage>
											{errors.confirm_password && errors.confirm_password.message}
										</FormErrorMessage>
									</FormControl>
								</Box>
							</>
                        )
	                }
					<Box>
						<Button
							type="submit"
							colorScheme="blue"
							rounded="xl"
							px={4}
							py={2}
							mt={8}
							mb={4}
							w="full"
						>
							{user ? "Edit Patient" : "Add Patient"}
						</Button>
					</Box>
                </Box>
            </Grid>
        </form>
    );
}

