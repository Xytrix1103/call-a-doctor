import {
	Box,
	Flex,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Grid,
	InputGroup,
	IconButton,
	InputRightElement,
	Input,
	Select,
	Text,
	Textarea
} from "@chakra-ui/react";
import {useRef, useState} from "react";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

const PatientDetailsStep = ({form, place}) => {
	const {
		register,
		formState: {
			errors
		}
	} = form;
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	
	return (
		<Grid templateColumns="repeat(2, 1fr)" gap={6} w="full" h="full" mt={6}>
			<Box w="full" h="full">
				<Box w="full">
					<FormControl isInvalid={errors.name}>
						<FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900" requiredIndicator>
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
						<FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900" requiredIndicator>
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
			</Box>
			<Box w="full" h="full">
			<Flex alignItems="center" justifyContent="space-between">
					<Box flex="1" mr={4}>
						<FormControl isInvalid={errors.date_of_birth}>
							<FormLabel mb={2} fontSize="sm" fontWeight="medium" color="gray.900" requiredIndicator>
								Date of Birth <Text as="span" color="red.500" fontWeight="bold">*</Text>
							</FormLabel>
							<InputGroup size="md">
								<Input
									variant="filled"
									type="date"
									name="date_of_birth"
									id="date_of_birth"
									{
										...register("date_of_birth", {
											required: "Date of birth cannot be empty",
										})
									}
									rounded="xl"
									borderWidth="1px"
									borderColor="gray.300"
									color="gray.900"
									isRequired
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
							>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</Select>
						</FormControl>
					</Box>
				</Flex>
				<Box mb={2} mt={6}>
					<FormControl fontSize="sm" fontWeight="medium" color="gray.900"  id="phone" isInvalid={errors.phone} requiredIndicator>
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
				<Box mb={2} mt={5}>
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
		</Grid>
	)
}

export default PatientDetailsStep;