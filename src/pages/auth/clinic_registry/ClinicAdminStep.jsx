import {
	Box,
	Flex,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	IconButton,
	Input,
	InputGroup,
	InputRightElement
} from "@chakra-ui/react";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useState} from "react";

const ClinicAdminStep = ({form}) => {
	const {
		handleSubmit,
		register,
		formState: {
			errors, isSubmitting
		}
	} = form;
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	
	return (
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
								            tabIndex="-1"
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
			</Box>
		</Flex>
	)
}

export default ClinicAdminStep