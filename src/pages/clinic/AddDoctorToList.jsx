import {
	Box,
	Button,
	Center,
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
	Select,
	Text,
	Textarea
} from '@chakra-ui/react';
import {useRef, useState} from "react";
import {BsFillCloudArrowDownFill} from "react-icons/bs";
import {useForm} from "react-hook-form";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useAuth} from "../../components/AuthCtx.jsx";
import {add_doctor} from "../../../api/clinic.js";

function AddDoctorToList() {
    const {
		reset,
		handleSubmit,
		register,
		formState: {
			errors, isSubmitting
		}
	} = useForm();
	const [showPassword, setShowPassword] = useState(false);
	const [isDragActive, setIsDragActive] = useState(false);
	const [imageSrc, setImageSrc] = useState(null);
	const {user} = useAuth();

    const imageRef = useRef(null);
	const previewImageRef = useRef(null);
	const previewImageContainerRef = useRef(null);
	
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
	
	const onSubmit = async (data) => {
		data = {
			...data,
			image: imageRef.current.files[0],
			clinic: Object.keys(user.clinic)[0],
		}
		
		await add_doctor(data);
	}
	
	return (
        <Center w="full" h="auto" bg="#f4f4f4">
            <Box
                w="85%"
                h="auto"
                bg="white"
                boxShadow="xl"
                rounded="xl"
                p={3}
                gridGap={4}
				gridTemplateColumns="1fr 1fr"
            >
                <form action="/api/add-doctor-to-list" method="post" onSubmit={handleSubmit(onSubmit)}
                    encType="multipart/form-data">
                    <Flex>
                        <Box my={7} mx={5} w="full">
                            <Text fontSize="xl" fontWeight="bold">
                                Add Doctor To List
                            </Text>
                        </Box>
                    </Flex>
                    
                    <Flex>
                        <Box px={5} mb={4} w="full">
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
									{errors.email && errors.email.message}
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
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
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
                            </Box>
                        </Box>
                        <Box px={5} w="full">
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
                                            accept="image/*"
                                            opacity={0}
                                            width="100%"
                                            height="100%"
                                            position="absolute"
                                            top={0}
                                            left={0}
                                            zIndex={1}
                                            cursor="pointer"
                                            isRequired
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
                                        Add Doctor
                                    </Button>                                
                                </Box>
							</FormControl>
                        </Box>
                    </Flex>
                </form>
            </Box>
        </Center>
	);
}

export default AddDoctorToList;
