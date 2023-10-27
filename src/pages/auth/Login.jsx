import {
	Box,
	Center,
	Text,
	Input,
	Checkbox,
	Button,
	Flex,
	Spacer,
	Image, InputGroup, InputRightElement, IconButton,
} from "@chakra-ui/react";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useState} from "react";

function Login() {
	const [show, setShow] = useState(false);

	return (
		<Center h="100vh">
			<Box w="80%">
				<Flex
					bg="white"
					boxShadow="lg"
					rounded="xl"
					p={5}
					gridGap={4}
					gridTemplateColumns="1fr 1fr"
				>
					<Box my={7} w="full">
						<Box ml={10}>
							<Text fontSize="xl" fontWeight="bold">
								Call A Doctor
							</Text>
						</Box>
						<Center>
							<Image src="/src/assets/svg/login-doctor.svg" alt="Login" w="96" h="96"/>
						</Center>
					</Box>
					<Box my={7} mr={5} w="full">
						<form action="/api/login" method="post">
							<Text fontSize="xl" fontWeight="bold">
								Log In
							</Text>
							<Box>
								<Text mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
									Email
								</Text>
								<Input
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
								/>
							</Box>
							<Box>
								<Text mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
									Password
								</Text>
								<Box position="relative">
									<InputGroup size='md'>
										<Input
											type={show ? "text" : "password"}
											name="password"
											id="password"
											placeholder="•••••••••"
											required
											rounded="xl"
											borderWidth="1px"
											borderColor="gray.300"
											color="gray.900"
											size="md"
											focusBorderColor="blue.500"
											w="full"
											p={2.5}
										/>
										<InputRightElement>
											<IconButton aria-label="Show password" size="lg" variant="ghost"
											            icon={show ? <IoMdEyeOff/> : <IoMdEye/>}
											            _focus={{bg: "transparent", borderColor: "transparent", outline: "none"}}
											            _hover={{bg: "transparent", borderColor: "transparent", outline: "none"}}
											            _active={{bg: "transparent", borderColor: "transparent", outline: "none"}}
											            onClick={() => setShow(!show)}/>
										</InputRightElement>
									</InputGroup>
								</Box>
							</Box>
							<Flex alignItems="center" justifyContent="space-between" mt={4}>
								<Flex alignItems="center">
									<Checkbox name="remember" id="remember" mr={2}/>
									<Text htmlFor="remember">Remember me</Text>
								</Flex>
								<Text>
									<a href="#" className="text-blue-500 hover:underline">
										Forgot password?
									</a>
								</Text>
							</Flex>
							<Button
								type="submit"
								colorScheme="blue"
								rounded="xl"
								px={4}
								py={2}
								mt={7}
								w="full"
							>
								Log In
							</Button>
							<Text textAlign="center" mt={5}>
								Don't have an account?{" "}
								<a href="/register" className="text-blue-500 hover:underline">
									Sign up
								</a>
							</Text>
						</form>
					</Box>
				</Flex>
			</Box>
		</Center>
	);
}

export default Login;
