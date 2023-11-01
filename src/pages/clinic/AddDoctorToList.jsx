import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Select,
    Text,
} from '@chakra-ui/react';
import {useState} from "react";
import {BiChevronDown} from "react-icons/bi";
import {BsFillCloudArrowDownFill} from "react-icons/bs";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {NavLink} from "react-router-dom";

function AddDoctorToList() {
    const [showPassword, setShowPassword] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);

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
    
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragActive(false);
        const file = e.dataTransfer.files[0];
        
        if (file) {
            if (isImageFile(file)) {
                    // Read the file and set the image source
                    const reader = new FileReader();
                    reader.onload = (event) => {
                    setImageSrc(event.target.result);
                    // Set preview image container bg to white
                    const previewImageContainer = document.getElementById("preview-image-container");
                    previewImageContainer.style.backgroundColor = "white";
                };
                reader.readAsDataURL(file);
            } else {
                alert("Invalid file type. Please upload an image.");
            }
        }
    };
    
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            if (isImageFile(file)) {
                    // Read the file and set the image source
                    const reader = new FileReader();
                    reader.onload = (event) => {
                    setImageSrc(event.target.result);
                    // Set preview image container bg to white
                    const previewImageContainer = document.getElementById("preview-image-container");
                    previewImageContainer.style.backgroundColor = "white";
                };
                reader.readAsDataURL(file);
            } else {
                alert("Invalid file type. Please upload an image.");
            }
        }
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
        <Center minHeight="100vh" bg={"#f4f4f4"}>
            <Flex
                as="nav"
                align="top"
                padding="1rem"
                bg="white"
                bgColor={"white"}
                position="fixed"
                top="0"
                left="0"
                right="0"
                zIndex="999"
                width="100%"
                shadow="md"
                justify="space-between"
            >
                <Flex align="center">
                    <Avatar
                        size="md"
                        src="\src\assets\images\Call_A_Doctor_Logo_NoBg.png"
                    />
                    <Text fontSize="xl" ml={2} fontWeight="bold">
                        Call A Doctor
                    </Text>
                </Flex>

                <Flex alignItems="center">
                    <Link as={NavLink} color="#0307fc" to="/" marginRight={6}>
                        Home
                    </Link>
                    <Link as={NavLink} color="teal.500" to="/" marginRight={6}>
                        Clinic List
                    </Link>
                    <Menu marginRight={6}>
                        <MenuButton as={Link} color="teal.500" display="flex" alignItems="center">
                            <Flex alignItems="center">
                                <Text>More</Text>
                                <BiChevronDown />
                            </Flex>
                        </MenuButton>

                        <MenuList>
                            <MenuItem as={NavLink} to="/" _focus={{ boxShadow: 'none' }}>
                            Dashboard
                            </MenuItem>
                            <MenuItem as={NavLink} to="/" _focus={{ boxShadow: "none" }}>
                            Settings
                            </MenuItem>
                            <MenuItem as={NavLink} to="/" _focus={{ boxShadow: "none" }}>
                            Earnings
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem as={NavLink} to="/" _focus={{ boxShadow: "none" }}>
                            Sign out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>

            <Box
                mt={24}
                mb={10}
                w="85%"
                bg="white"
                boxShadow="xl"
                rounded="xl"
                p={5}
                gridGap={4}
                gridTemplateColumns="1fr 1fr"                
            >
                <form action="/api/add-doctor-to-list" method="post" onSubmit={handleSubmit}>
                    <Flex>
                        <Box my={7} mx={5} w="full">
                            <Text fontSize="xl" fontWeight="bold">
                                Add Doctor To List
                            </Text>
                        </Box>
                    </Flex>                     
            
                    <Flex>
                        <Box mx={5} w="full">
                            <Box>
                                <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                    Doctor Name
                                </Text>
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
                                <Text mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900">
                                    Specialty
                                </Text>
                                <Input
                                    variant="filled"
                                    type="text"
                                    name="specialty"
                                    id="specialty"
                                    placeholder="Enter Primary Specialty (e.g., Cardiology)"
                                    rounded="xl"
                                    borderWidth="1px"
                                    borderColor="gray.300"
                                    color="gray.900"
                                    size="md"
                                    focusBorderColor="blue.500"
                                    isRequired
                                    w="full"
                                    p={2.5}
                                />
                            </Box>
                            <Box>
                                <Text mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900">
                                    Field of Expertise
                                </Text>
                                <Input
                                    variant="filled"
                                    type="text"
                                    name="field_of_expertise"
                                    id="field_of_expertise"
                                    placeholder="Enter Field of Expertise or Subspecialties (e.g., Interventional Cardiology)"
                                    rounded="xl"
                                    borderWidth="1px"
                                    borderColor="gray.300"
                                    color="gray.900"
                                    size="md"
                                    focusBorderColor="blue.500"
                                    w="full"
                                    p={2.5}
                                />
                            </Box>
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
                                                        _focus={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                                        _hover={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                                        _active={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                                        onClick={() => setShowPassword(!showPassword)}/>
                                        </InputRightElement>
                                    </InputGroup>
                                    <FormHelperText fontSize="xs">
                                        Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
                                    </FormHelperText>
                                </FormControl>
                            </Box>
                        </Box>
                        <Box mx={5} w="full">
                            <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                Profile Picture
                            </Text>
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
                            <Box
                                w="full"
                                h="64"
                                id="preview-image-container"
                                bg="gray.200"
                                rounded="lg"
                                display="flex"
                                flexDir="column"
                                alignItems="center"
                                justifyContent="center"
                                mt={12}
                            >
                                <Image
                                    id="preview-image"
                                    src={imageSrc || ""}
                                    alt="Preview"
                                    display={imageSrc ? "block" : "none"}
                                    w="auto"
                                    h="64"
                                />
                            </Box>

                            <Button
                                type="submit"
                                colorScheme="blue"
                                rounded="xl"
                                px={4}
                                py={2}
                                mt={14}
                                w="full"
                            >
                                Add Doctor
                            </Button>
                        </Box>
                    </Flex>
                </form>
            </Box>
        </Center>
    );
}

export default AddDoctorToList;
