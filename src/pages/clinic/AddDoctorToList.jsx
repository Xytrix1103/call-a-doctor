import {
	Box,
	Button,
	Flex,
	FormControl,
	FormHelperText,
	FormLabel,
	Grid,
	IconButton,
	Image,
	Input,
	InputGroup,
    Center,
	InputRightElement,
	Select,
	Text,
} from '@chakra-ui/react';
import {useRef, useState} from "react";
import {BsFillCloudArrowDownFill} from "react-icons/bs";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

function AddDoctorToList() {
	const [showPassword, setShowPassword] = useState(false);
	const [isDragActive, setIsDragActive] = useState(false);
	const [imageSrc, setImageSrc] = useState(null);

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
			setImageSrc(null);
		}
	}
	
	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragActive(false);
		const file = e.dataTransfer.files[0];
		populatePreviewImage(file);
	};
	
	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		populatePreviewImage(file);
	};
	
	const isImageFile = (file) => {
		return file.type.startsWith("image/");
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData(e.target);
		
		if (res) {
			console.log("Adding doctor to list");
		}
	}
	
	return (
        <Center h="100%" bg="#f4f4f4">
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
                <form action="/api/add-doctor-to-list" method="post" onSubmit={handleSubmit}
                    encType="multipart/form-data">
                    <Flex>
                        <Box my={7} mx={5} w="full">
                            <Text fontSize="xl" fontWeight="bold">
                                Add Doctor To List
                            </Text>
                        </Box>
                    </Flex>
                    
                    <Flex>
                        <Box px={5} w="full">
                            <Box>
                                <FormControl id="name">
                                    <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                        Name
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
                                        isRequired
                                        size="md"
                                        focusBorderColor="blue.500"
                                        w="full"
                                        p={2.5}
                                    />                                    
                                </FormControl>
                            </Box>
                            <Flex alignItems="center" justifyContent="space-between" mt={6}>
                                <Box flex="1" mr={4}>
                                    <FormControl>
                                        <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                            Age
                                        </FormLabel>
                                        <InputGroup size="md">
                                            <Input
                                                variant="filled"
                                                type="number"
                                                name="age"
                                                id="age"
                                                rounded="xl"
                                                borderWidth="1px"
                                                borderColor="gray.300"
                                                color="gray.900"
                                                isRequired
                                                size="md"
                                                focusBorderColor="blue.500"
                                            />
                                        </InputGroup>
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
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Flex>
                            <Box>
                                <FormControl id="email">
                                    <FormLabel mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900">
                                        Email
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
                                        isRequired
                                    />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl id="password">
                                    <FormLabel mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900">
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
                                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                            isRequired
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
                                                        onClick={() => setShowPassword(!showPassword)}/>
                                        </InputRightElement>
                                    </InputGroup>
                                    <FormHelperText fontSize="xs">
                                        Minimum eight characters, at least one uppercase letter, one lowercase letter, one
                                        number and one special character
                                    </FormHelperText>
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
									mt={8}
									ref={previewImageContainerRef}
								>
									<Image
										id="preview-image"
										src={imageSrc || ""}
										alt="Preview"
										display={imageSrc ? "block" : "none"}
										ref={previewImageRef}
										w="full"
										h="full"
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
