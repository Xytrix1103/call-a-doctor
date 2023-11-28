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
	console.log("LoadingAnimation");
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
			zoom={1.5}
		/>			
	);
};

const RejectedAnimation = () => {
	console.log("RejectedAnimation");
	const [animationData, setAnimationData] = useState(null);

	useEffect(() => {
        fetch('https://lottie.host/f40a14b7-6f3c-4eca-9583-f0cd6f525dee/nIMaJjSk7I.json')
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
			loop={false}
			autoplay={true}
			zoom={1.5}
		/>			
	);
};
  
const VerificationPending = () => {
	const {user, loading} = useAuth();
	const [clinic, setClinic] = useState({});
	
	useEffect(() => {
		console.log("VerificationPending");
		console.log(user, loading);
		
		onValue(query(ref(db, `clinic_requests`), orderByChild('admin'), equalTo(user.uid)), (snapshot) => {
			const data = snapshot.val();
			const clinicId = Object.keys(data)[0];
			const singleClinic = data[clinicId];
			setClinic(singleClinic);
		});
	}, []);

	console.log(clinic)
	console.log(clinic.rejected)

	return (
		<Flex w='full' h='full' bg='#f4f4f4' justifyContent='center'>
			<Flex
				w="50%"
				h="full"
				bg="white"
				boxShadow="xl"
				rounded="xl"
				alignItems="center"
				direction="column"
				position="relative"
				p={10}
			>
				<Text fontSize="2xl" fontWeight='bold' letterSpacing='wide' color={clinic.rejected ? 'red' : 'purple'}>
					{clinic.rejected ? 'Verification Rejected'  :  'Verification Pending' }
				</Text>
				{
					clinic.rejected ? (
						<>
							<Box w='300px' zIndex={99} position='fixed' mt={14}>
								<RejectedAnimation />
							</Box>
							<Text
								fontSize="xl"
								fontWeight='semibold'
								letterSpacing='wide'
								position="absolute"
								bottom="150px" 
							>
								Reason for rejection
							</Text>
							<Text
								fontSize="lg"
								fontWeight='medium'
								letterSpacing='wide'
								position="absolute"
								bottom="100px"
							>
								{clinic.reject_reason}
							</Text>
						</>
					) : (
						<Box w='600px' zIndex={99} position='fixed'>
							<LoadingAnimation />
						</Box>
					)
				}
			</Flex>
		</Flex>
	);
}

export default VerificationPending;