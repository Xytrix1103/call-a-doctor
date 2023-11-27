import {
	Box,
	Button,
	Center,
	Checkbox,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Grid,
	Image,
	Input,
	Link,
	Text,
	useToast
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {forgot_password} from "../../../api/auth.js";

// import { set } from "lodash";

function ForgotPassword() {
	const {
		handleSubmit,
		register,
		formState: {
			errors, isSubmitting
		}
	} = useForm();
	const toast = useToast();
	
	const onSubmit = async (data) => {
		const res = await forgot_password(data.email);
		console.log(res);
		
		if (res) {
			if (res.error) {
				toast({
					title: "Login failed.",
					description: "Please try again with valid credentials.",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "top"
				});
			} else {
				toast({
					title: "Password reset email sent.",
					description: "Please check your email for instructions.",
					status: "success",
					duration: 3000,
					isClosable: true,
					position: "top"
				});
			}
		}
	}
	
	return (
		<Center h="full" bg={"#f4f4f4"}>
			<Box w="85%">
				<Flex
					bg="white"
					boxShadow="xl"
					rounded="xl"
					p={3}
					gridGap={4}
					gridTemplateColumns="1fr 1fr"
				>
					<Box my={7} w="full">
						<Box ml={10}>
							<Text fontSize="xl" fontWeight="bold">
								Call A Doctor
							</Text>
						</Box>
						<Center my={3}>
							<Image src="/src/assets/svg/login-doctor.svg" alt="Login" w="96" h="80" />
						</Center>
						<Text textAlign="center">
							Registering a clinic?{' '}
							<Link color="blue.500" href="/register-clinic">
								Register here
							</Link>
						</Text>
					</Box>
					<Box my={7} mr={5} w="full" h="full">
						<form action="/api/login" method="post" onSubmit={handleSubmit(onSubmit)}>
							<Text fontSize="xl" fontWeight="bold" mb={7}>
								Forget Password
							</Text>
							<Grid templateRows="auto 1fr" w="100%" h="100%" overflow="hidden">
								<Box w="full" my={10}>
									<FormControl isInvalid={errors.email}>
										<FormLabel mb={2} mt={7} fontSize="sm" fontWeight="medium" color="gray.900">
											Email
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
									
									<Flex alignItems="center" justifyContent="space-between" mt={6}>
										<Flex alignItems="center">
											<Checkbox name="remember" id="remember" mr={2} />
											<Text htmlFor="remember">Remember me</Text>
										</Flex>
										<Text as="a" href="/login" textColor="blue.500" fontSize="sm" fontWeight="medium" _hover={{ textDecoration: "underline" }}>
											Return to login
										</Text>
									</Flex>
								</Box>
								<Button
									type="submit"
									colorScheme="blue"
									rounded="xl"
									px={4}
									py={2}
									mt={12}
									w="full"
								>
									Request Password Reset
								</Button>
							</Grid>
							<Text textAlign="center" mt={5}>
								Don't have an account?{" "}
								<Text as="a" href="/register" textColor="blue.500" fontWeight="medium" _hover={{ textDecoration: "underline" }}>
									Sign Up
								</Text>
							</Text>
						</form>
					</Box>
				</Flex>
			</Box>
		</Center>
	);
}

export default ForgotPassword
