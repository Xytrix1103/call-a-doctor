import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	IconButton,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Text,
	Textarea,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import {useEffect, useRef, useState} from "react";
import {BsFillCloudArrowDownFill} from "react-icons/bs";
import {useForm} from "react-hook-form";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {db} from "../../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";
import {register_doctor} from "../../../../api/auth.js";
import {update_doctor, update_email, update_password} from "../../../../api/admin.js";
import {useNavigate} from "react-router-dom";

export const DoctorForm = ({user, self=false, clinic_admin=false}) => {
    console.log("self?", self);
    console.log("clinic_admin?", clinic_admin);
    console.log("DoctorForm");
    const {
        setValue,
		reset,
		handleSubmit,
		register,
        getValues,
	    watch,
	    trigger,
		formState: {
			errors
		}
	} = useForm();
	const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isDragActive, setIsDragActive] = useState(false);
	const [imageSrc, setImageSrc] = useState(null);
    const [clinics, setClinics] = useState([]);

    const imageRef = useRef(null);
	const previewImageRef = useRef(null);
	const previewImageContainerRef = useRef(null);
	const toast = useToast();
	const navigate = useNavigate();

    useEffect(() => {
        onValue(query(ref(db, "clinics")), (snapshot) => {
            const clinics = [];
            snapshot.forEach((childSnapshot) => {
                clinics.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });
            console.log(clinics);
            setClinics(clinics);
        });
    }, []);

    useEffect(() => {
		if(clinics.length > 0) {
	        if (user) {
	            setValue('name', user?.name);
	            setValue('email', user?.email);
	            setValue('phone', user?.phone);
	            setValue('date_of_birth', user?.date_of_birth);
				setValue("clinic", user?.clinic);
	            setValue('qualification', user?.qualification);
	            setValue('introduction', user?.introduction);
	        } else {
				setValue('name', null);
				setValue('email', null);
				setValue('phone', null);
				setValue('date_of_birth', null);
				setValue("clinic", clinics?.[0]?.id);
				setValue('qualification', null);
				setValue('introduction', null);
	        }
		} else {
			setValue('name', null);
			setValue('email', null);
			setValue('phone', null);
			setValue('date_of_birth', null);
			setValue('clinic',  '');
			setValue('qualification', null);
			setValue('introduction', null);
		}
    }, [user, clinics]);

    useEffect(() => {
        if (user?.image) {
            setImageSrc(user?.image);
        }
    }, [user]);
	
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
			if (isImageFile(file)) {
				// Read the file and set the image source
				const reader = new FileReader();
				reader.onload = (event) => {
					setImageSrc(event.target.result);
				};
				reader.readAsDataURL(file);
			} else {
				alert("Invalid file type. Please upload an image.");
			}
		} else {
			console.log("No file");
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
	
	const isImageFile = (file) => {
		return file.type.startsWith("image/");
	};
	
	const onSubmit = async () => {
		let data = getValues();
        console.log("Submitting doctor form", data);
		
		if (!user) {
			const valid = await trigger(['name', 'phone', 'date_of_birth', 'qualification', 'introduction', 'clinic', 'email', 'password', 'confirm_password']);
			const password = data["password"];
			const confirm_password = data["confirm_password"];
			
			if (!valid) {
				return;
			}
			
			if (password !== confirm_password) {
				alert("Passwords do not match!");
				return;
			}
			
			console.log(imageRef.current.files)
			
			if (imageRef.current.files.length === 0) {
				alert("Please upload an image");
				return;
			}
			
			
			data = {
				...data,
				image: imageRef.current.files[0],
			}
			
			console.log(data);
			
			register_doctor(data, true).then((res) => {
				console.log(res);
				if (res.error) {
					toast({
						title: "Error!",
						description: "An error has occurred!",
						status: "error",
						duration: 5000,
						isClosable: true,
						position: "top"
					});
				} else {
					toast({
						title: "Success!",
						description: "Doctor has been created!",
						status: "success",
						duration: 5000,
						isClosable: true,
						position: "top"
					});
                    {self ? navigate('/profile') : (clinic_admin ? navigate('/profile') : navigate('/admin/users'))}
				}
			}).catch((err) => {
				console.log(err);
				toast({
					title: "Error!",
					description: "An error has occurred!",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "top"
				});
			});
		} else {
			console.log("Updating doctor");
			const valid = await trigger(['name', 'phone', 'date_of_birth', 'qualification', 'introduction', 'clinic']);
			let update = {};
			
			if (!valid) {
				return;
			}
			
			//loop thru form values
			for (const [key, value] of Object.entries(data)) {
				if (value !== user[key] && key !== 'confirm_password' && key !== 'password' && key !== 'email') {
					update[key] = value;
				}
			}
			
			if (imageSrc !== user.image) {
				update['image'] = imageRef.current.files[0];
			} else {
				update['image'] = null;
			}
			
			if (Object.keys(update).length > 0) {
				update_doctor(user.uid, update).then((res) => {
					console.log(res);
					if (res.error) {
						toast({
							title: "Error!",
							description: "An error has occurred!",
							status: "error",
							duration: 5000,
							isClosable: true,
							position: "top"
						});
					} else {
						toast({
							title: "Success!",
							description: "Doctor has been updated!",
							status: "success",
							duration: 5000,
							isClosable: true,
							position: "top"
						});
                        {self ? navigate('/profile') : (clinic_admin ? navigate('/profile') : navigate('/admin/users'))}
					}
				}).catch((err) => {
					console.log(err);
					toast({
						title: "Error!",
						description: "An error has occurred!",
						status: "error",
						duration: 5000,
						isClosable: true,
						position: "top"
					});
				});
			}
		}
	}

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
	
	const handleEmailSubmit = async () => {
		const valid = await trigger(['new_email']);
		console.log("Submitting email modal");
		
		if (!valid) {
			return;
		}
		
		update_email(user, getValues('new_email')).then((res) => {
			console.log(res);
			if (res.error) {
				toast({
					title: "Error!",
					description: "An error has occurred!",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "top"
				});
			} else {
				toast({
					title: "Success!",
					description: "Email has been updated!",
					status: "success",
					duration: 5000,
					isClosable: true,
					position: "top"
				});
				onCloseEmailModal();
			}
		}).catch((err) => {
			console.log(err);
			toast({
				title: "Error!",
				description: "An error has occurred!",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top"
			});
		});
		onCloseEmailModal();
	};
	
	const handlePasswordSubmit = async () => {
		const valid = await trigger(['new_password', 'new_confirm_password']);
		console.log("Submitting password modal");
		
		if (!valid) {
			return;
		}
		
		if (getValues('new_password') !== getValues('new_confirm_password')) {
			alert("Passwords do not match!");
			onClosePasswordModal();
			return;
		}
		
		update_password(user, getValues('new_password')).then((res) => {
			console.log(res);
			onClosePasswordModal();
			if (res.error) {
				toast({
					title: "Error!",
					description: "An error has occurred!",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "top"
				});
			} else {
				toast({
					title: "Success!",
					description: "Password has been updated!",
					status: "success",
					duration: 5000,
					isClosable: true,
					position: "top"
				});
				onClosePasswordModal();
			}
		}).catch((err) => {
			console.log(err);
			toast({
				title: "Error!",
				description: "An error has occurred!",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top"
			});
		});
		onClosePasswordModal();
	};
	
	
	return (
        <form action="/api/add-doctor-to-list" method="post" encType="multipart/form-data">
            <Flex px={5} gap={8}>
                <Box mb={4} w="full">
                    <Box>
                        <FormControl isInvalid={errors.name} id="name">
                            <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                Name <Text as="span" color="red.500" fontWeight="bold">*</Text>
                            </FormLabel>
                            <Input
                                variant="filled"
                                type="text"
                                name="name"
                                id="name"
                                placeholder="John Doe"
                                rounded="xl"
                                borderWidth="1px"
                                borderColor="gray.300"
                                color="gray.900"
                                size="md"
                                focusBorderColor="blue.500"
                                w="full"
                                p={2.5}
                                {
                                    ...register("name", {
                                        required: "Name is required",
                                    })
                                }
                            />        
	                        <FormErrorMessage>
	                            {errors.name && errors.name.message}
	                        </FormErrorMessage>
                        </FormControl>
                    </Box>
                    <Flex alignItems="center" justifyContent="space-between" mt={6}>
                        <Box flex="1" mr={4}>
                            <FormControl isInvalid={errors.date_of_birth} id='date_of_birth'>
                                <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                    Date of Birth <Text as="span" color="red.500" fontWeight="bold">*</Text>
                                </FormLabel>
                                <InputGroup size="md">
                                    <Input
                                        variant="filled"
                                        type="date"
                                        name="date_of_birth"
                                        id="date_of_birth"
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        {
                                            ...register("date_of_birth", {
                                                required: "Date of birth is required",
                                            })
                                        }
                                        size="md"
                                        focusBorderColor="blue.500"
                                    />
                                </InputGroup>
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
                                    isRequired
                                    borderColor="gray.300"
                                    color="gray.900"
                                    size="md"
                                    focusBorderColor="blue.500"
                                    {
                                        ...register("gender")
                                    }
                                >
                                    <option value="Male" selected={user?.gender === "Male"}>Male</option>
                                    <option value="Female" selected={user?.gender === "Female"}>Female</option>
                                </Select>
                            </FormControl>
                        </Box>
                    </Flex>
                    <Box>
                        <FormControl isInvalid={errors.phone}>
                            <FormLabel mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900">
                                Contact Number <Text as="span" color="red.500" fontWeight="bold">*</Text>
                            </FormLabel>
                            <Input
                                variant="filled"
                                type="tel"
                                id="phone"
                                {
                                    ...register("phone", {
                                        required: "Contact number is required",
                                        pattern: {
                                            value: /^(\+?\d{1,3}[- ]?)?\d{10}$/,
                                            message: "Invalid phone number format",
                                        },
                                    })
                                }
                                placeholder="012-345-6789"
                                rounded="xl"
                                borderWidth="1px"
                                borderColor="gray.300"
                                color="gray.900"
                                size="md"
                                focusBorderColor="blue.500"
                                p={2.5}
                            />
                            <FormErrorMessage>
                                {errors.phone && errors.phone.message}
                            </FormErrorMessage>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl>
                            <FormLabel  mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900">
                                Which clinic does this user belong to?
                            </FormLabel>
                            <Select
                                variant="filled"
                                name="clinic"
                                id="clinic"
                                rounded="xl"
                                borderWidth="1px"
                                isRequired
                                borderColor="gray.300"
                                color="gray.900"
                                size="md"
                                focusBorderColor="blue.500"
                                value={watch("clinic") || clinics?.[0]?.id}
                                {
	                                ...register("clinic")
                                }
                            >
	                            {clinics.map((clinic) => (
		                            <option key={clinic.id} value={clinic.id}>
			                            {clinic.name}
		                            </option>
	                            ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl isInvalid={errors.qualification}>
                            <FormLabel mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900">
                                Qualifications <Text as="span" color="red.500" fontWeight="bold">*</Text>
                            </FormLabel>
                            <Input
                                variant="filled"
                                type="text"
                                id="qualification"
                                {
                                    ...register("qualification", {
                                        required: "Qualifications are required",
                                    })
                                }
                                placeholder="Please enter your qualifications..."
                                rounded="xl"
                                borderWidth="1px"
                                borderColor="gray.300"
                                color="gray.900"
                                size="md"
                                focusBorderColor="blue.500"
                                p={2.5}
                            />
                            <FormErrorMessage>
                                {errors.qualification && errors.qualification.message}
                            </FormErrorMessage>
                        </FormControl>
                    </Box>
                    <Box mb={2} mt={6}>
                        <FormControl isInvalid={errors.introduction}>
                            <FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
                                Introduction <Text as="span" color="red.500" fontWeight="bold">*</Text>
                            </FormLabel>
                            <Textarea
                                variant="filled"
                                name="introduction"
                                id="introduction"
                                placeholder="Enter a short description about yourself..."
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
                                    ...register("introduction", {
                                        required: "Introduction cannot be empty",
                                    })
                                }
                            />
                            <FormErrorMessage>
                                {errors.introduction && errors.introduction.message}
                            </FormErrorMessage>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl isInvalid={errors.email}>
                            <FormLabel mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900">
                                Email <Text as="span" color="red.500" fontWeight="bold">*</Text>
                            </FormLabel>
                            <Input
                                variant="filled"
                                type="email"
                                id="email"
                                {
                                    ...register("email", {
                                        required: "Email is required",
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
                                p={2.5}
                            />
                            <FormErrorMessage>
                                {errors.email && errors.email.message}
                            </FormErrorMessage>
                        </FormControl>
                    </Box>
	                {
						!user && (
							<>
								
								<Box>
									<FormControl isInvalid={errors.password}>
										<FormLabel mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900">
											Password <Text as="span" color="red.500" fontWeight="bold">*</Text>
										</FormLabel>
										<InputGroup size='md'>
											<Input
												variant="filled"
												type={showPassword ? "text" : "password"}
												id="password"
												{
													...register("password", {
														required: "Password is required",
														pattern: {
															value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
															message: "Invalid password format",
														},
													})
												}
												placeholder="•••••••••"
												rounded="xl"
												borderWidth="1px"
												borderColor="gray.300"
												color="gray.900"
												size="md"
												focusBorderColor="blue.500"
												p={2.5}
											/>
											<InputRightElement>
												<IconButton
													aria-label="Show password"
													size="lg"
													variant="ghost"
													icon={showPassword ? <IoMdEyeOff /> : <IoMdEye />}
													_focus={{ bg: "transparent", borderColor: "transparent", outline: "none" }}
													_hover={{ bg: "transparent", borderColor: "transparent", outline: "none" }}
													_active={{ bg: "transparent", borderColor: "transparent", outline: "none" }}
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
									
									<FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900"  id="confirm_password" isInvalid={errors.name}>
										<FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
											Confirm Password <Text as="span" color="red.500" fontWeight="bold">*</Text>
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
														required: "Confirm Password is required",
														pattern: {
															value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/,
															message: "Invalid password format",
														},
													})
												}
											/>
											<InputRightElement>
												<IconButton aria-label="Show password" size="lg" variant="ghost"
												            icon={showConfirmPassword ? <IoMdEyeOff/> : <IoMdEye/>}
												            _focus={{bg: "transparent", borderColor: "transparent", outline: "none"}}
												            _hover={{bg: "transparent", borderColor: "transparent", outline: "none"}}
												            _active={{bg: "transparent", borderColor: "transparent", outline: "none"}}
												            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
												            tabIndex="-1"
												/>
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
                </Box>
                <Box w="full">
                    <FormControl w="full" h="full" display="grid" gridTemplateRows="auto 1fr">
                        <Box>
                            <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                Profile Picture
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
                                    id='image-input'
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
                                            <form>
                                                <ModalOverlay 
                                                    bg='blackAlpha.300'
                                                    backdropFilter='blur(3px) hue-rotate(90deg)'
                                                />
                                                <ModalContent>
                                                    <ModalHeader>Edit Email</ModalHeader>
                                                    <ModalCloseButton />
                                                    <ModalBody>
                                                        <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900" id="email" isInvalid={errors.new_email}>
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
                                                                    ...register("new_email", {
                                                                        required: "Email is required",
                                                                    })
                                                                }
                                                            />
                                                            <FormErrorMessage>
                                                                {errors.new_email && errors.new_email.message}
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
                                            <form>
                                                <ModalOverlay 
                                                    bg='blackAlpha.300'
                                                    backdropFilter='blur(3px) hue-rotate(90deg)'
                                                />
                                                <ModalContent>
                                                    <ModalHeader>Password Modal</ModalHeader>
                                                    <ModalCloseButton />
                                                    <ModalBody>
                                                        <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900" id="password" isInvalid={errors.new_password}>
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
                                                                        ...register("new_password", {
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
                                                                {errors.new_password && errors.new_password.message}
                                                            </FormErrorMessage>
                                                        </FormControl>
                                                        <FormControl mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900" id="confirm_password" isInvalid={errors.new_confirm_password}>
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
                                                                        ...register("new_confirm_password", {
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
                                                                {errors.new_confirm_password && errors.new_confirm_password.message}
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

                        <Box>
                            <Button
	                            onClick={onSubmit}
                                colorScheme="blue"
                                rounded="xl"
                                px={4}
                                py={2}
                                mt={8}
                                mb={4}
                                w="full"
                            >
	                            {
		                            self ? "Save Changes" : (user ? "Edit Doctor" : "Add Doctor")
	                            }
                            </Button>                                
                        </Box>
                    </FormControl>
                </Box>
            </Flex>
        </form>
    );
}
