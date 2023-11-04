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
		<Center w="100%" h="auto" bg="#f4f4f4">
			<Box
				w="85%"
				h="full"
				bg="white"
				boxShadow="xl"
				rounded="xl"
				p={3}
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
							<Text
								as="input" 
								variant="filled"
								type="text"
								name="name"
								id="name"
								placeholder="John Doe"
								rounded="xl"
								borderWidth="1px"
								borderColor="gray.300"
								value={data.name}
								color="gray.900"
								size="md"
								focusBorderColor="blue.500"
								w="full"
								p={2.5}
								isReadOnly 
								pointerEvents="none"
								tabIndex="-1"
							/>
						</Box>
						<Text mt={4} mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
							Operating Hours
						</Text>
						<Flex alignItems="center" justifyContent="space-between">
							<Box flex="1">
								<Text
									as="input" 
									variant="filled"
									type="text"
									name="name"
									id="name"
									placeholder="John Doe"
									rounded="xl"
									borderWidth="1px"
									borderColor="gray.300"
									value={data.start_time}
									color="gray.900"
									size="md"
									focusBorderColor="blue.500"
									w="full"
									p={2.5}
									isReadOnly 
									pointerEvents="none"
									tabIndex="-1"
								/>
							</Box>
							<Text mx={3} fontSize="md" color="gray.900">
								to
							</Text>
							<Box flex="1">
								<Text
									as="input" 
									variant="filled"
									type="text"
									name="name"
									id="name"
									placeholder="John Doe"
									rounded="xl"
									borderWidth="1px"
									borderColor="gray.300"
									value={data.end_time}
									color="gray.900"
									size="md"
									focusBorderColor="blue.500"
									w="full"
									p={2.5}
									isReadOnly 
									pointerEvents="none"
									tabIndex="-1"
								/>
							</Box>
						</Flex>
						<Text mt={4} mb={2} fontSize="sm" fontWeight="medium" color="gray.900">
							Operating Days
						</Text>
						<Flex alignItems="center" justifyContent="space-between">
							<Box flex="1">
								<Text
									as="input" 
									variant="filled"
									type="text"
									name="name"
									id="name"
									placeholder="John Doe"
									rounded="xl"
									borderWidth="1px"
									borderColor="gray.300"
									value={data.start_day}
									color="gray.900"
									size="md"
									focusBorderColor="blue.500"
									w="full"
									p={2.5}
									isReadOnly 
									pointerEvents="none"
									tabIndex="-1"
								/>
							</Box>
							<Text mx={3} fontSize="md" color="gray.900">
								to
							</Text>
							<Box flex="1">
								<Text
									as="input" 
									variant="filled"
									type="text"
									name="name"
									id="name"
									placeholder="John Doe"
									rounded="xl"
									borderWidth="1px"
									borderColor="gray.300"
									value={data.end_day}
									color="gray.900"
									size="md"
									focusBorderColor="blue.500"
									w="full"
									p={2.5}
									isReadOnly 
									pointerEvents="none"
									tabIndex="-1"
								/>
							</Box>
						</Flex>
						<Box>
							<Text mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900">
								Address
							</Text>
							<Text
								as="textarea"
								variant="filled"
								type="text"
								name="name"
								id="name"
								placeholder="John Doe"
								rounded="xl"
								borderWidth="1px"
								borderColor="gray.300"
								value={data.address}
								color="gray.900"
								size="md"
								focusBorderColor="blue.500"
								w="full"
								p={2.5}
								isReadOnly 
								pointerEvents="none"
								tabIndex="-1"
							/>
						</Box>
						<Box mb={3}>
							<Text mb={2} mt={4} fontSize="sm" fontWeight="medium" color="gray.900">
								Panel Firms
							</Text>
							<Text
								as="textarea" 
								variant="filled"
								type="text"
								name="name"
								id="name"
								placeholder="No Panel Firms"
								rounded="xl"
								borderWidth="1px"
								borderColor="gray.300"
								value={data.panel_firms}
								color="gray.900"
								size="md"
								focusBorderColor="blue.500"
								w="full"
								p={2.5}
								isReadOnly 
								pointerEvents="none"
								tabIndex="-1"
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
						<NavLink to={`/clinics/${id}/request`}>
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
