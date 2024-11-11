import {
	Box,
	Button,
	Center,
	Checkbox,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	IconButton,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	Text,
	useToast
} from "@chakra-ui/react";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {login} from "../../../api/auth.js";

// import { set } from "lodash";

function Login() {
	const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm();
	const [show, setShow] = useState(false);
	const [attempts, setAttempts] = useState(parseInt(localStorage.getItem("loginAttempts") || "0", 10));
	const [isLocked, setIsLocked] = useState(false);
	const [lockoutTime, setLockoutTime] = useState(parseInt(localStorage.getItem("lockoutTime") || "0", 10));
	const [timeLeft, setTimeLeft] = useState(0);
	const toast = useToast();

	const MAX_ATTEMPTS = 3;
	const LOCKOUT_DURATION = 300000; // 5 minutes in milliseconds

	useEffect(() => {
		if (lockoutTime > Date.now()) {
			setIsLocked(true);
			const interval = setInterval(() => {
				const remainingTime = lockoutTime - Date.now();
				if (remainingTime <= 0) {
					clearInterval(interval);
					setIsLocked(false);
					setTimeLeft(0);
					localStorage.removeItem("lockoutTime");
					setAttempts(0);
					localStorage.removeItem("loginAttempts");
				} else {
					setTimeLeft(remainingTime);
				}
			}, 1000);

			return () => clearInterval(interval);
		} else {
			setIsLocked(false);
			localStorage.removeItem("lockoutTime");
		}
	}, [lockoutTime]);

	const onSubmit = async (data) => {
		if (isLocked) {
			toast({
				title: "Account locked.",
				description: `Please wait ${Math.ceil(timeLeft / 1000)} seconds before trying again.`,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		const res = await login(data);
		if (res.error) {
			const newAttempts = attempts + 1;
			setAttempts(newAttempts);
			localStorage.setItem("loginAttempts", newAttempts);

			if (newAttempts >= MAX_ATTEMPTS) {
				const lockoutExpiration = Date.now() + LOCKOUT_DURATION;
				setLockoutTime(lockoutExpiration);
				localStorage.setItem("lockoutTime", lockoutExpiration);
				setIsLocked(true);
				setTimeLeft(LOCKOUT_DURATION);
				toast({
					title: "Too many attempts.",
					description: `Account locked. Please wait ${Math.ceil(LOCKOUT_DURATION / 1000)} seconds before trying again.`,
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "top",
				});
			} else {
				toast({
					title: "Login failed.",
					description: `You have ${MAX_ATTEMPTS - newAttempts} attempts left.`,
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "top",
				});
			}
		} else {
			setAttempts(0);
			localStorage.removeItem("loginAttempts");
		}
	};

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
				<Box my={7} mr={5} w="full">
					<form action="/api/login" method="post" onSubmit={handleSubmit(onSubmit)}>
						<Text fontSize="xl" fontWeight="bold" mb={7}>
                            Log In
                        </Text>
						<Box>
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
						</Box>
						<Box>
							<FormControl isInvalid={errors.password}>
								<FormLabel mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900">
									Password
								</FormLabel>
								<InputGroup size='md'>
									<Input
										variant="filled"
										type={show ? "text" : "password"}
										id="password"
										{
											...register("password", {
												required: "Password is required",
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
											icon={show ? <IoMdEyeOff /> : <IoMdEye />}
											_focus={{ bg: "transparent", borderColor: "transparent", outline: "none" }}
											_hover={{ bg: "transparent", borderColor: "transparent", outline: "none" }}
											_active={{ bg: "transparent", borderColor: "transparent", outline: "none" }}
											onClick={() => setShow(!show)}
											tabIndex="-1"
										/>
									</InputRightElement>
								</InputGroup>
								<FormErrorMessage>
									{errors.password && errors.password.message}
								</FormErrorMessage>
							</FormControl>
						</Box>
						<Flex alignItems="center" justifyContent="space-between" mt={6}>
							<Flex alignItems="center">
								<Checkbox name="remember" id="remember" mr={2} />
								<Text htmlFor="remember">Remember me</Text>
							</Flex>
							<Text as="a" href="/forgot" textColor="blue.500" fontSize="sm" fontWeight="medium" _hover={{ textDecoration: "underline" }}>
								Forgot password?
							</Text>
						</Flex>
						<Button
							type="submit"
							colorScheme="blue"
							rounded="xl"
							px={4}
							py={2}
							mt={12}
							w="full"
						>
							Log In
						</Button>
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

export default Login;
