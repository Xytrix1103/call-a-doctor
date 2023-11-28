import {Avatar, Box, Button, Center, Divider, Flex, Input, InputGroup, InputLeftElement, Text,} from '@chakra-ui/react'
import {useEffect, useState} from "react";
import {db} from "../../../api/firebase.js";
import {equalTo, get, onValue, orderByChild, query, ref} from "firebase/database";
import {BiSearchAlt2} from 'react-icons/bi';
import {FaEye, FaUser} from 'react-icons/fa';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {FilterMatchMode} from 'primereact/api';
import '../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css';
import {NavLink} from 'react-router-dom';
import {useAuth} from "../../components/AuthCtx.jsx";

function Patients({asAdmin = false}) {
	const [patients, setPatients] = useState([]);
	const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		name: { value: null, matchMode: FilterMatchMode.CONTAINS },
		email: { value: null, matchMode: FilterMatchMode.CONTAINS },
		contact: { value: null, matchMode: FilterMatchMode.CONTAINS },
		address: { value: null, matchMode: FilterMatchMode.CONTAINS },
	});
	const [globalFilterValue, setGlobalFilterValue] = useState('');
	const [selectedUsers, setSelectedUsers] = useState(null);
	const [rowClick, setRowClick] = useState(true);
	const { user } = useAuth();
	
	const onGlobalFilterChange = (e) => {
		const value = e.target.value;
		let _filters = { ...filters };
		
		_filters['global'].value = value;
		
		setFilters(_filters);
		setGlobalFilterValue(value);
	};
	
	const contactBodyTemplate = (rowData) => {
		return (
			<Box display='flex' alignItems='center' gap={1}>
				{rowData.contact}
			</Box>
		);
	};
	
	const nameBodyTemplate = (rowData) => {
		return (
			<Box display='flex' alignItems='center' gap={3}>
				{rowData.image ? (
					<Avatar src={rowData.image} alt={rowData.name} size='sm'/>
				) : (
					<Avatar icon={<FaUser />} size='sm'/>
				)}
				{rowData.name}
			</Box>
		);
	};
	
	const [isOpenApprove, setIsOpenApprove] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState(null);
	
	const onOpenApprove = (userId) => {
		setSelectedUserId(userId);
		setIsOpenApprove(true);
	};
	
	const onCloseApprove = () => {
		setSelectedUserId(null);
		setIsOpenApprove(false);
	};
	
	const actionBodyTemplate = (rowData) => {
		return (
			<Flex justifyContent='center' alignItems='center' gap={2}>
				{
					asAdmin ? 
					(
						<Button bg='transparent' as={NavLink} to={`/admin/patients/${rowData.id}`}><FaEye color='#0078ff'/></Button>
					) : 
						<Button bg='transparent' as={NavLink} to={`/patients/${rowData.id}`}><FaEye color='#0078ff'/></Button>
				}
			</Flex>
		);
	};
	
	const nameRowFilterTemplate = (options) => {
		return (
			<InputText
				value={options.value}
				onChange={(e) => options.filterApplyCallback(e.target.value, filters['name'].matchMode)}
				placeholder="Search by name"
				style={{ width: '100%', padding: '0.5rem' }}
			/>
		);
	};
	
	const addressRowFilterTemplate = (options) => {
		return (
			<InputText
				value={options.value}
				onChange={(e) => options.filterApplyCallback(e.target.value, filters['address'].matchMode)}
				placeholder="Search by address"
				style={{ width: '100%', padding: '0.5rem' }}
			/>
		);
	};
	
	const contactRowFilterTemplate = (options) => {
		return (
			<InputText
				value={options.value}
				onChange={(e) => options.filterApplyCallback(e.target.value, filters['contact'].matchMode)}
				placeholder="Search by contact number"
				style={{ width: '100%', padding: '0.5rem' }}
			/>
		);
	};
	
	const emailRowFilterTemplate = (options) => {
		return (
			<InputText
				value={options.value}
				onChange={(e) => options.filterApplyCallback(e.target.value, filters['email'].matchMode)}
				placeholder="Search by email"
				style={{ width: '100%', padding: '0.5rem' }}
			/>
		);
	};
	
	const renderHeader = () => {
		return (
			<Box>
				<Flex justifyContent='space-between' alignItems='center'>
					<Box>
						<Text fontSize='2xl' fontWeight='semibold'>List of Users</Text>
					</Box>
					<Box>
						<InputGroup>
							<InputLeftElement
								pointerEvents="none"
								children={<BiSearchAlt2 color="gray.300" />}
							/>
							<Input
								w="full"
								placeholder="Search"
								size="md"
								focusBorderColor="blue.500"
								borderRadius="lg"
								borderColor="gray.300"
								backgroundColor="white"
								color="gray.800"
								value={globalFilterValue}
								onChange={onGlobalFilterChange}
							/>
						</InputGroup>
					</Box>
				</Flex>
				<Divider mt={5} borderColor="blackAlpha.300" borderWidth="1px" rounded="lg" />
			</Box>
		);
	};
	
	useEffect(() => {
		onValue(query(ref(db, 'users'), orderByChild('role'), equalTo('Patient')), async (snapshot) => {
			let users = [];
			console.log(snapshot.val());
			
			snapshot.forEach((childSnapshot) => {
				users = [...users, {
					id: childSnapshot.key,
					...childSnapshot.val(),
				}];
			});
			
			if (!asAdmin) {
				await get(query(ref(db, 'requests'), orderByChild('clinic'), equalTo(user.clinic))).then((requests) => {
					console.log(requests);
					let patients = [];
					
					requests.forEach((request) => {
						if (!patients.includes(request.child('uid').val())) {
							patients.push(request.child('uid').val());
						}
					});
					
					users = users.filter((user) => {
						return patients.includes(user.id);
					});
				});
			} else {
				console.log("as admin");
			}
			
			setPatients(users);
		});
	}, []);
	
	useEffect(() => {
		console.log("patients", patients);
	}, [patients]);
	
	const header = renderHeader();
	
	return (
		<Center h="auto" bg="#f4f4f4">
			<Flex direction='column' w='full' justifyContent='center' alignItems='center'>
				<Box
					w="95%"
					h="full"
					bg="white"
					boxShadow="lg"
					rounded="lg"
					p={3}
				>
					<DataTable value={patients} header={header} stripedRows showGridlines paginator rows={10}
					           removableSort rowsPerPageOptions={[10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
					           filters={filters} filterDisplay="row" globalFilterFields={['name', 'role', 'email', 'contact']}
					           selectionMode={rowClick ? null : 'checkbox'} selection={selectedUsers}
					           onSelectionChange={(e) => setSelectedUsers(e.value)} dataKey="id"
					>
						<Column field="name" header="Name" sortable filter filterElement={nameRowFilterTemplate} body={nameBodyTemplate} style={{ width:"15%" }}></Column>
						<Column field="email" header="Email" sortable filter filterElement={emailRowFilterTemplate} style={{ width:"15%" }}></Column>
						<Column field="address" header="Address" sortable filter filterElement={addressRowFilterTemplate} style={{ width:"30%" }}></Column>
						<Column field="contact" header="Contact" sortable filter filterElement={contactRowFilterTemplate} body={contactBodyTemplate} style={{ width:"15%" }}></Column>
						<Column field="action" header="Action" body={actionBodyTemplate} style={{ width:"10%" }}></Column>
					</DataTable>
				</Box>
			
			</Flex>
		</Center>
	);
}

export default Patients;
