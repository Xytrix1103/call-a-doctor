import {Box, Button, Center, Flex, FormControl, Input, Select, Text, Textarea,} from '@chakra-ui/react'
import {NavLink, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import {db} from "../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";

function ClinicDetails() {
	const [data, setData] = useState({});
	const {id} = useParams();
    
    useEffect(() => {
        onValue(query(ref(db, `clinics/${id}`)), (snapshot) => {
	        const data = snapshot.val();
	        setData(data);
        });
    }, []);
    
    console.log(data)
	
	return (
		<Center w="100%" h="100%" bg="#f4f4f4">
			<Box
				mt={24}
				mb={12}
				w="80%"
				bg="white"
				boxShadow="xl"
				rounded="xl"
				p={5}
				gridGap={4}
				gap={6}
				gridTemplateColumns="1fr 1fr"
			>
				<Flex>
					<Box my={7} mx={5} w="full">
						<Text fontSize="xl" fontWeight="bold">
							Clinic A
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
								name="name"
								id="name"
								placeholder="John Doe"
								rounded="xl"
								borderWidth="1px"
								borderColor="gray.300"
								disabled
								value={"Clinic A"}
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
						<Flex alignItems="center" justifyContent="space-between">
							<Box flex="1">
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
										disabled
										focusBorderColor="blue.500"
									>
										<option value="08:00 AM">08:00 AM</option>
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
										disabled
										size="md"
										focusBorderColor="blue.500"
									>
										<option value="08:00 AM">08:00 AM</option>
									</Select>
								</FormControl>
							</Box>
						</Flex>
						<Text mt={6} mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
							Operating Days
						</Text>
						<Flex alignItems="center" justifyContent="space-between">
							<Box flex="1">
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
										disabled
										isRequired
										focusBorderColor="blue.500"
									>
										<option value="Monday">Monday</option>
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
										disabled
										focusBorderColor="blue.500"
									>
										<option value="Monday">Monday</option>
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
								disabled
								focusBorderColor="blue.500"
								w="full"
								p={2.5}
								rows={5}
							/>
						</Box>
						<Box mb={3}>
							<Text mb={2} mt={6} fontSize="sm" fontWeight="medium" color="gray.900">
								Panel Firms
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
								disabled
								size="md"
								focusBorderColor="blue.500"
								w="full"
								p={2.5}
							/>
						</Box>
					</Box>
					<Box mx={5} w="full">
						<Flex>
							<Box
								my={7}
								mx={5}
								w="full"
								bgImage={`url(https://source.unsplash.com/random)`}
								bgSize="cover"
								bgPosition="center"
								rounded={'lg'}
								h="64"
							>
							</Box>
						</Flex>
						<NavLink to="/patient/request/1">
							<Button
								colorScheme="blue"
								rounded="xl"
								px={4}
								mx={5}
								py={2}
								mt={10}
								w="full"
							>
								Send Doctor Request
							</Button>
						</NavLink>
					</Box>
				</Flex>
			</Box>
		</Center>
	);
}

export default ClinicDetails;
