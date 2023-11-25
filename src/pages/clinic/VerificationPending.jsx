import {
	Box,
	Flex,
	Image,
    Link,
	Input,
	InputGroup,
	Text,
    Avatar,
    InputLeftElement,
    Badge,
    VStack,
    Button,
    IconButton,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel,
    Divider,
} from '@chakra-ui/react';
import {useAuth} from "../../components/AuthCtx.jsx";
import {useEffect, useState} from "react";
import {equalTo, onValue, orderByChild, query, ref} from "firebase/database";
import {db} from "../../../api/firebase.js";
import Lottie from 'lottie-web';
import animationData from 'https://lottie.host/214951eb-e4a0-4bfd-8c83-87253cbc856d/gp9OL0aRBN.json';

const LoadingAnimation = () => {
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};

	return (
		<Flex alignItems="center" justifyContent="center" height="200px" width="200px">
			<Lottie options={defaultOptions} height={200} width={200} />
		</Flex>
	);
};
  

const VerificationPending = () => {
	const {user, loading} = useAuth();
	const [clinic, setClinic] = useState(null);
	
	useEffect(() => {
		console.log("VerificationPending");
		console.log(user, loading);
		
		onValue(query(ref(db, `clinic_requests`), orderByChild('admin'), equalTo(user.uid)), (snapshot) => {
			const clinic_requests = [];
			snapshot.forEach((reqSnapshot) => {
				clinic_requests.push({
					id: reqSnapshot.key,
					...reqSnapshot.val(),
				});
			});
			setClinic(clinic_requests[0]);
		});
	}, []);
	
	return (
		<Flex w='full' h='full' bg='#f4f4f4' justifyContent='center'>
			<Flex
				w="60%"
				h="auto"
				bg="white"
				boxShadow="xl"
				rounded="xl"
				alignItems="center"
				direction="column"
				p={10}
			>
				<Text fontSize="2xl" fontWeight='bold' letterSpacing='wide'>
					Verification Pending
				</Text>
				<LoadingAnimation />
			</Flex>
		</Flex>
		// <div>
		// 	<h1>Verification Pending</h1>
		// 	{
		// 		clinic ?
		// 			(
		// 				<>
		// 					<p>{clinic.name}</p>
		// 					<p>{clinic.address}</p>
		// 					<p>{clinic.phone}</p>
		// 					<p>{clinic.email}</p>
		// 					<p>{clinic.admin}</p>
		// 					<p>{clinic.image}</p>
		// 					<p>{clinic.place_id}</p>
		// 					{
		// 						clinic.rejected ?
		// 							(
		// 								<p>Rejected</p>
		// 							) :
		// 							(
		// 								<p>Pending</p>
		// 							)
		// 					}
		// 				</>
		// 			) :
		// 			(
		// 				<p>No Clinic</p>
		// 			)
		// 	}
		// </div>
	);
}

export default VerificationPending;