import {
    Box,
    Flex,
    Avatar,
    Link,
    Text,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Image,
    Center,
    Input,
    Select,
    InputGroup,
    InputRightElement,
    FormControl,
    FormLabel,
    FormHelperText,
    Textarea,
} from '@chakra-ui/react';
import {useState} from "react";
import {BiChevronDown} from "react-icons/bi";
import {BsFillCloudArrowDownFill} from "react-icons/bs";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

function ClinicRegistry() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      // Read the file and set the image source
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        // Set preview image container bg to white
        const previewImageContainer = document.getElementById(
            "preview-image-container"
        );
        previewImageContainer.style.background = "white";
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Read the file and set the image source
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        // Set preview image container bg to white
        const previewImageContainer = document.getElementById(
          "preview-image-container"
        );
        previewImageContainer.style.background = "white";
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Center minHeight="100vh" bg={"#f4f4f4"}>
        <Flex
            as="nav"
            align="top"
            padding="1rem"
            bg="white" // Set the navbar background color to white
            bgColor={"white"}
            position="fixed"
            top="0"
            left="0"
            right="0"
            zIndex="999"
            width="100%"
            shadow="md"
            justify="space-between" // Align items to the space between
        >
            <Flex align="center">
                <Avatar
                    size="md"
                    src="src\assets\images\Call_A_Doctor_Logo_NoBg.png"
                />
                <Text fontSize="xl" ml={2} fontWeight="bold">
                    Call A Doctor
                </Text>
            </Flex>

            <Flex alignItems="center">
                <Link as={Link} color="#0307fc" to="/" marginRight={6}>
                    Home
                </Link>
                <Link as={Link} color="teal.500" to="/" marginRight={6}>
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
                        <MenuItem as={Link} to="/" _focus={{ boxShadow: 'none' }}>
                        Dashboard
                        </MenuItem>
                        <MenuItem as={Link} to="/" _focus={{ boxShadow: "none" }}>
                        Settings
                        </MenuItem>
                        <MenuItem as={Link} to="/" _focus={{ boxShadow: "none" }}>
                        Earnings
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem as={Link} to="/" _focus={{ boxShadow: "none" }}>
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
            <form action="/" method="post">
                <Flex>
                    <Box my={7} mx={5} w="full">
                        <Text fontSize="xl" fontWeight="bold">
                            Clinic Registry
                        </Text>
                    </Box>
                </Flex>                     
        
                <Flex>
                    <Box mx={5} w="full">
                        <Box>
                            <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                Clinic Name
                            </Text>
                            <Input
                                variant="filled"
                                type="text"
                                name="clinic_name"
                                id="clinic_name"
                                isRequired
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
                        </Box>
                        <Text mt={6} mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                            Operating Hours
                        </Text>                  
                        <Flex alignItems="center" justifyContent="space-between" >
                            <Box flex="1" >
                                <FormControl>
                                    <Select
                                        variant="filled"
                                        name="start_time"
                                        id="start_time"
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        isRequired
                                        size="md"
                                        focusBorderColor="blue.500"
                                    >
                                        <option value="08:00 AM">08:00 AM</option>
                                        <option value="09:00 AM">09:00 AM</option>
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                        <option value="12:00 PM">12:00 PM</option>
                                        <option value="01:00 PM">01:00 PM</option>
                                        <option value="02:00 PM">02:00 PM</option>
                                        <option value="03:00 PM">03:00 PM</option>
                                        <option value="04:00 PM">04:00 PM</option>
                                        <option value="05:00 PM">05:00 PM</option>
                                        <option value="06:00 PM">06:00 PM</option>
                                        <option value="07:00 PM">07:00 PM</option>
                                        <option value="08:00 PM">08:00 PM</option>
                                        <option value="09:00 PM">09:00 PM</option>
                                        <option value="10:00 PM">10:00 PM</option>
                                        <option value="11:00 PM">11:00 PM</option>
                                        <option value="12:00 AM">12:00 AM</option>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Text mx={3} fontSize="md" color="gray.900">
                                to
                            </Text>
                            <Box flex="1">
                                <FormControl>
                                    <Select
                                        variant="filled"
                                        name="end_time"
                                        id="end_time"
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        isRequired
                                        size="md"
                                        focusBorderColor="blue.500"
                                    >
                                        <option value="08:00 AM">08:00 AM</option>
                                        <option value="09:00 AM">09:00 AM</option>
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                        <option value="12:00 PM">12:00 PM</option>
                                        <option value="01:00 PM">01:00 PM</option>
                                        <option value="02:00 PM">02:00 PM</option>
                                        <option value="03:00 PM">03:00 PM</option>
                                        <option value="04:00 PM">04:00 PM</option>
                                        <option value="05:00 PM">05:00 PM</option>
                                        <option value="06:00 PM">06:00 PM</option>
                                        <option value="07:00 PM">07:00 PM</option>
                                        <option value="08:00 PM">08:00 PM</option>
                                        <option value="09:00 PM">09:00 PM</option>
                                        <option value="10:00 PM">10:00 PM</option>
                                        <option value="11:00 PM">11:00 PM</option>
                                        <option value="12:00 AM">12:00 AM</option>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Flex>
                        <Text mt={6} mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                            Operating Days
                        </Text>
                        <Flex alignItems="center" justifyContent="space-between" >
                            <Box flex="1" >
                                <FormControl>
                                    <Select
                                        variant="filled"
                                        name="start_day"
                                        id="start_day"
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        size="md"
                                        isRequired
                                        focusBorderColor="blue.500"
                                    >
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thurday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                        <option value="Sunday">Sunday</option>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Text mx={3} fontSize="md" color="gray.900">
                                to
                            </Text>
                            <Box flex="1">
                                <FormControl>
                                    <Select
                                        variant="filled"
                                        name="end_day"
                                        id="end_day"
                                        rounded="xl"
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        color="gray.900"
                                        size="md"
                                        isRequired
                                        focusBorderColor="blue.500"
                                    >
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thurday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                        <option value="Sunday">Sunday</option>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Flex>
                        <Box>
                            <Text mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900">
                                Address
                            </Text>
                            <Textarea
                                variant="filled"
                                name="address"
                                id="address"
                                placeholder="Enter your address here..."
                                rounded="xl"
                                borderWidth="1px"
                                borderColor="gray.300"
                                color="gray.900"
                                size="md"
                                isRequired
                                focusBorderColor="blue.500"
                                w="full"
                                p={2.5}
                                rows={5}
                            />
                        </Box>
                        <Box mb={3}>
                            <Text mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900">
                                Panel Firms (Optional)
                            </Text>
                            <Textarea
                                variant="filled"
                                name="panel_firm"
                                id="panel_firm"
                                placeholder="Enter your panel firms here..."
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
                    </Box>
                    <Box mx={5} w="full">
                        <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                            Clinic Image
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
                                isRequired
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

                    </Box>
                </Flex>

                <Flex>
                    <Box my={7} mx={5} w="full">
                        <Text fontSize="xl" fontWeight="bold">
                            Clinic Admin Registry
                        </Text>
                    </Box>
                </Flex>   

                <Flex>
                    <Box mx={5} w="full">
                        <Box>
                            <FormControl>
                                <FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
                                    Admin Name
                                </FormLabel>
                                <Input
                                        variant="filled"
                                        type="text"
                                        name="admin_name"
                                        id="admin_name"
                                        placeholder="John Doe"
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
                    </Box>
                    <Box mx={5} w="full">
                        <Box>
                            <FormControl id="password">
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
                        <Box>
                            <FormControl id="confirm_password">
                                <FormLabel mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900">
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
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                        isRequired
                                    />
                                    <InputRightElement>
                                        <IconButton aria-label="Show password" size="lg" variant="ghost"
                                                    icon={showConfirmPassword ? <IoMdEyeOff/> : <IoMdEye/>}
                                                    _focus={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                                    _hover={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                                    _active={{bg: "transparent", borderColor: "transparent", outline: "none"}}
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}/>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
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
                            Submit Request
                        </Button>
                    </Box>
                </Flex>  
            </form>
        </Box>
    </Center>
  );
}

export default ClinicRegistry;
