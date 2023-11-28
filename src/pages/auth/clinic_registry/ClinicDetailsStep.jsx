import {
	Box,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Grid,
	Image,
	Input,
	Select,
	Text,
	Textarea
} from "@chakra-ui/react";
import {BsFillCloudArrowDownFill} from "react-icons/bs";
import {useRef, useState} from "react";

const ClinicDetailsStep = ({form, imageRef, place, image, setImage}) => {
	const {
		register,
		getValues,
		formState: {
			errors
		}
	} = form;
	const [isDragActive, setIsDragActive] = useState(false);
	const [imageSrc, setImageSrc] = useState(null);
	
	const previewImageRef = useRef(null);
	const previewImageContainerRef = useRef(null);

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
  
	const handleStartTimeChange = (value) => {
		setSelectedStartTime(value);
		console.log(value);
		// Logic to set end time to be at least 1 hour more than start time
		const startTimeIndex = startTimeOptions.indexOf(value);
		const nextTimeIndex = startTimeIndex + 1;
		setSelectedEndTime(startTimeOptions[nextTimeIndex]);
	};
  
	const handleStartDayChange = (value) => {
		setSelectedStartDay(value);
		console.log(value);
		// Logic to set end day to be at least 1 day after start day
		const startDayIndex = daysOfWeek.indexOf(value);
		const nextDayIndex = startDayIndex + 1;
		setSelectedEndDay(daysOfWeek[nextDayIndex]);
	};
	
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
		
		if (file) {
			setImage(file);
		} else {
			setImage(null);
		}
	};
	
	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		populatePreviewImage(file);
		
		if (file) {
			setImage(file);
		} else {
			setImage(null);
		}
	};
	
	return (
		<Grid templateColumns="repeat(2, 1fr)" gap={6} w="full" h="full">
			<Box w="full" h="full">
				<Box w="full">
					<FormControl isInvalid={errors.clinic_name}>
						<FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900" requiredIndicator>
							Clinic Name <Text as="span" color="red.500" fontWeight="bold">*</Text>
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
							rounded="xl"
							borderWidth="1px"
							borderColor="gray.300"
							color="gray.900"
							defaultValue={place.name}
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
									onChange={(e) => handleStartTimeChange(e.target.value)}
									focusBorderColor="blue.500"
								>
									{startTimeOptions.map((time) => (
										<option key={time} value={time} disabled={time === selectedEndTime}>
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
									{startTimeOptions.map((time) => (
										<option key={time} value={time} disabled={time === selectedStartTime}>
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
									onChange={(e) => handleStartDayChange(e.target.value)}
									focusBorderColor="blue.500"
								>
									{daysOfWeek.map((day) => (
										<option key={day} value={day} disabled={day === selectedEndDay}>
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
									{daysOfWeek.map((day) => (
										<option key={day} value={day} disabled={day === selectedStartDay}>
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
							defaultValue={place.contact}
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
					<FormControl isInvalid={errors.business_reg_num}>
						<FormLabel fontSize="sm" fontWeight="medium" color="gray.900">
							Business Registration Number <Text as="span" color="red.500" fontWeight="bold">*</Text>
						</FormLabel>
						<Input
							variant="filled"
							type="text"
							id="business_reg_num"
							{
								...register("business_reg_num", {
									required: "Business registration number cannot be empty",
								})
							}
							placeholder="1234567890"
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
							{errors.business_reg_num && errors.business_reg_num.message}
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
							defaultValue={place.address}
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
			<Box w="full">
				<FormControl w="full" h="full" display="grid" gridTemplateRows="auto 1fr">
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
				</FormControl>
			</Box>
		</Grid>
	)
}

export default ClinicDetailsStep;