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
import { BsCalendar2DateFill } from "react-icons/bs";
import {db} from "../../../api/firebase.js";
import {useForm} from "react-hook-form";
import {useAuth} from "../../components/AuthCtx.jsx";
import { PendingAppointmentsCard } from './PendingAppointmentsCard.jsx';

function PendingAppointments() {
	const {user} = useAuth();
	const [appointments, setAppointments] = useState([]);
	const [clinic, setClinic] = useState({});
	const [date, setDate] = useState('');
	const form = useForm();

	useEffect(() => {
		// get todays date
		const today = new Date();
		const dd = String(today.getDate()).padStart(2, '0');
		const mm = String(today.getMonth() + 1).padStart(2, '0');
		const yyyy = today.getFullYear();
		const todayDate = `${dd}/${mm}/${yyyy}`;
		setDate(todayDate);
		console.log(todayDate);

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
				<Flex m={3} alignItems='center' justifyContent='space-between'>
					<Text fontSize='xl' fontWeight='bold' letterSpacing='wide'>Patient Appointments</Text>
					<Flex alignItems='center'>
						<BsCalendar2DateFill size={30} color='#036ffc'/>
						<Box ml={2}>
							<Text fontSize='sm' fontWeight='semibold' letterSpacing='wide' color='grey'>Today's Date</Text>
							<Text fontSize='sm' fontWeight='semibold' letterSpacing='wide'>{date}</Text>
						</Box>
						
					</Flex>
				</Flex>
				{appointments.map((appointment) => (
					<PendingAppointmentsCard clinic={clinic} appointment={appointment} form={form}/>
				))}
			</Box>
		</Center>
	);
}

export default PendingAppointments;