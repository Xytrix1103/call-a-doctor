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
	Textarea,
} from '@chakra-ui/react';
import {useRef, useState} from "react";
import {BsFillCloudArrowDownFill} from "react-icons/bs";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useForm} from "react-hook-form";
import {register_clinic} from "../../../api/clinic_registry.js";

function ClinicRegistry() {
	const {
		handleSubmit,
		register,
		formState: {
			errors, isSubmitting
		}
	} = useForm();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
		populatePreviewImage(file);
	};
	
	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		populatePreviewImage(file);
	};
	
	const onSubmit = async (data) => {
		data = {
			...data,
			image: imageRef.current.files[0],
		}
		await register_clinic(data);
		console.log(data);
	}
	
	return (
		<Center h="auto" bg={"#f4f4f4"} py={10}>
			<Box
				w="85%"
				bg="white"
				boxShadow="xl"
				rounded="xl"
				p={3}
				gridGap={4}
				gridTemplateColumns="1fr 1fr"
			>
				<form action="/api/register-clinic" method="post" onSubmit={handleSubmit(onSubmit)}
				      encType="multipart/form-data">
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
								<FormControl isInvalid={errors.clinic_name}>
									<FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
										Clinic Name
									</FormLabel>
									<Input
										variant="filled"
										type="text"
										id="clinic_name"
										{
											...register("clinic_name", {
												required: "Clinic name cannot be empty",
											})
										}
										placeholder="Clinic A"
										defaultValue=""
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
										{errors.clinic_name && errors.clinic_name.message}
									</FormErrorMessage>
								</FormControl>
							</Box>
							<Flex alignItems="center" justifyContent="space-between">
								<Box flex="1">
									<Text fontSize="sm" fontWeight="medium" color="gray.900" mt={6} mb={2}>
										Operating Hours
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
												focusBorderColor="blue.500"
												{
													...register("start_time", {
														required: "Start time cannot be empty",
													})
												}
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
												focusBorderColor="blue.500"
												{
													...register("end_time", {
														required: "End time cannot be empty",
													})
												}
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
									</Flex>
								</Box>
								<Box flex="1" ml={4}>
									<Text mt={6} mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
										Operating Days
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
												focusBorderColor="blue.500"
												{
													...register("start_day", {
														required: "Start day cannot be empty",
													})
												}
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
												focusBorderColor="blue.500"
												{
													...register("end_day", {
														required: "End day cannot be empty",
													})
												}
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
									>
										<option value="None">None</option>
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
							<Box mb={2} mt={4}>
								<FormControl isInvalid={errors.address}>
									<FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
										Address
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
							<Box mb={2} mt={4}>
								<FormControl isInvalid={errors.panel_firms}>
									<FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
										Panel Firms (Optional)
									</FormLabel>
									<Textarea
										variant="filled"
										name="panel_firm"
										id="panel_firm"
										placeholder="Enter clinic panel firms here..."
										rounded="xl"
										borderWidth="1px"
										borderColor="gray.300"
										color="gray.900"
										size="md"
										focusBorderColor="blue.500"
										w="full"
										p={2.5}
										{
											...register("panel_firms")
										}
									/>
								</FormControl>
							</Box>
						</Box>
						<Box mx={5} w="full">
							<FormControl w="full" h="full" display="grid" gridTemplateRows="auto 1fr">
								<Box>
									<FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
										Clinic Image
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
										h="full"
										objectFit="cover"
									/>
								</Box>
							</FormControl>
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
								<FormControl isInvalid={errors.admin_name}>
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
										{
											...register("admin_name", {
												required: "Admin name cannot be empty",
											})
										}
									/>
									<FormErrorMessage>
										{errors.admin_name && errors.admin_name.message}
									</FormErrorMessage>
								</FormControl>
							</Box>
							<Box>
								<FormControl id="email" isInvalid={errors.email}>
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
										{
											...register("email", {
												required: "Email cannot be empty",
											})
										}
									/>
									<FormErrorMessage>
										{errors.email && errors.email.message}
									</FormErrorMessage>
								</FormControl>
							</Box>
						</Box>
						<Box mx={5} w="full">
							<Box>
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
											pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
											{
												...register("password", {
													required: "Password cannot be empty",
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
							<Box>
								<FormControl id="confirm_password" isInvalid={errors.confirm_password}>
									<FormLabel mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900">
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
											{
												...register("confirm_password", {
													required: "Confirm password cannot be empty",
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
											            onClick={() => setShowConfirmPassword(!showConfirmPassword)}/>
										</InputRightElement>
									</InputGroup>
									{
										errors.confirm_password ?
											<FormErrorMessage>
												{errors.confirm_password && errors.confirm_password.message}
											</FormErrorMessage> :
											<FormHelperText fontSize="xs">
												Minimum eight characters, at least one uppercase letter, one lowercase letter,
												one number and one special character
											</FormHelperText>
									}
								</FormControl>
							</Box>
							<Button
								type="submit"
								colorScheme="blue"
								rounded="xl"
								px={4}
								py={2}
								mt={8}
								mb={2}
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
