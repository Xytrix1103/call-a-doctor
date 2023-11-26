import {
	Box,
	Button,
	Center,
	Divider,
	Flex,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	SimpleGrid,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import {equalTo, get, onValue, orderByChild, query, ref} from 'firebase/database';
import {memo, useEffect, useRef, useState} from 'react';
import {db} from "../../../api/firebase.js";
import {useForm} from "react-hook-form";
import {useAuth} from "../../components/AuthCtx.jsx";
import { PendingAppointmentsCard } from './PendingAppointmentsCard.jsx';

function PendingAppointments() {
	const {user} = useAuth();
	const [appointments, setAppointments] = useState([]);
	const [clinic, setClinic] = useState({});
	const form = useForm();

	useEffect(() => {
		onValue(query(ref(db, 'requests'), orderByChild('doctor'), equalTo(user.uid)), (snapshot) => {
			const requests = [];
			snapshot.forEach((reqSnapshot) => {
				const { date, appointment_time, ...rest } = reqSnapshot.val();
	
				const formattedDate = new Date(date).toLocaleDateString('en-GB', {
					day: 'numeric',
					month: 'long',
					year: 'numeric',
				});
	
				const [startTime, endTime] = appointment_time.split('-');
				const formattedAppointmentTime = `${startTime.trim()} to ${endTime.trim()}`;

				const birthDate = new Date(reqSnapshot.val().patient.dob);
				const currentDate = new Date();
				const age = currentDate.getFullYear() - birthDate.getFullYear() - (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) ? 1 : 0);

				requests.push({
					id: reqSnapshot.key,
					date: formattedDate,
					appointment_time: formattedAppointmentTime,
					age: age,
					...rest,
				});
			});
			setAppointments(requests);
		});

		onValue(query(ref(db, `clinics/${user.clinic}`)), (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            setClinic(data);
        });
	}, []);
	
	return (
		<Center h="auto" bg="#f4f4f4">
			<Box
				w="85%"
				h='100%'
				bg='transparent'
			>
				<Box m={3}>
					<Text fontSize='xl' fontWeight='bold' letterSpacing='wide'>Pending Patient Appointments</Text>
				</Box>
				{appointments.map((appointment) => (
					<PendingAppointmentsCard clinic={clinic} appointment={appointment} form={form}/>
				))}
			</Box>
		</Center>
	);
}

export default PendingAppointments;