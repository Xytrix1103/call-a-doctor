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
import Lottie from 'lottie-react';

const LoadingAnimation = () => {
	const [animationData, setAnimationData] = useState(null);

	useEffect(() => {
        fetch('https://lottie.host/01b692d0-0b70-4293-9eb9-3d1d6a8b648f/G7oFls431Z.json')
        .then((response) => response.json())
        .then((data) => {
            setAnimationData(data);
        })
        .catch((error) => {
            console.error('Failed to fetch animation data:', error);
        });
    }, []);

	return (
		<Lottie
			animationData={animationData}
			loop={true}
			autoplay={true}
			size={400}
		/>
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

// import Lottie from 'lottie-react';
// import {Box, Center, Spinner} from "@chakra-ui/react";
// import { useEffect, useState } from 'react';

// const LoadingAnimation = () => {
//     const [animationData, setAnimationData] = useState(null);

//     useEffect(() => {
//         fetch('https://lottie.host/75c4859e-03e8-4aa7-9abf-804c91611aea/o5Ehm7ofRo.json')
//         .then((response) => response.json())
//         .then((data) => {
//             setAnimationData(data);
//         })
//         .catch((error) => {
//             console.error('Failed to fetch animation data:', error);
//         });
//     }, []);

    
//     if (!animationData) {
//         return (
//             <Box w="full" h="100vh" bg="white" pos="fixed" top="0" left="0" zIndex="1000" display="flex" justifyContent="center" alignItems="center">
//                 <Center w="full" h="full">
//                     <Spinner size="xl" color="brand.900"/>
//                 </Center>
//             </Box>
//         )
//     } else {
//         return (
//             <Box w="full" h="100vh" bg="white" pos="fixed" top="0" left="0" zIndex="1000" display="flex" justifyContent="center" alignItems="center">
//                 <Center w="full" h="full">
//                     <Lottie
//                         animationData={animationData}
//                         loop={true}
//                         autoplay={true}
//                     />
//                 </Center>
//             </Box>
//         )        
//     }

// }

// export default LoadingAnimation;