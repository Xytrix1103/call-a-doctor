import {
	Avatar,
	Box,
	Button,
	Center,
	Divider,
	Flex,
	Input,
	InputGroup,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Text,
} from '@chakra-ui/react'
import {useEffect, useState} from "react";
import {db} from "../../../api/firebase.js";
import {equalTo, onValue, orderByChild, query, ref} from "firebase/database";
import {BiSearchAlt2} from 'react-icons/bi';
import {FaEye, FaHospitalUser, FaStethoscope, FaTrash, FaUser} from 'react-icons/fa';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {FilterMatchMode} from 'primereact/api';
import '../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css';
import {NavLink} from 'react-router-dom';
import {useAuth} from "../../components/AuthCtx.jsx";
import {delete_user} from "../../../api/admin.js";

function StaffList() {
	const [users, setUsers] = useState([]);
	const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		name: { value: null, matchMode: FilterMatchMode.CONTAINS },
		role: { value: null, matchMode: FilterMatchMode.EQUALS },
		email: { value: null, matchMode: FilterMatchMode.CONTAINS },
		phone: { value: null, matchMode: FilterMatchMode.CONTAINS },
	});
	const [roles] = useState(['Doctor', 'Clinic Admin']);
	const [globalFilterValue, setGlobalFilterValue] = useState('');
	const [selectedUsers, setSelectedUsers] = useState(null);
	const [rowClick, setRowClick] = useState(true);
	const [clinicAdminCount, setClinicAdminCount] = useState(0);
	const [doctorCount, setDoctorCount] = useState(0);
	const {user} = useAuth();
	
	const onGlobalFilterChange = (e) => {
		const value = e.target.value;
		let _filters = { ...filters };
		
		_filters['global'].value = value;
		
		setFilters(_filters);
		setGlobalFilterValue(value);
	};
	
	const roleBodyTemplate = (rowData) => {
		let icon;
		
		switch (rowData.role.toLowerCase()) {
			case 'doctor':
				icon = <FaStethoscope color='#29cf71'/>;
				break;
			case 'clinic admin':
				icon = <FaHospitalUser color='#ed645a'/>;
				break;
			default:
				icon = null;
		}
		
		return (
			<Box display='flex' alignItems='center' gap={3}>
				{icon}
				{rowData.role}
			</Box>
		);
	};
	
	const phoneBodyTemplate = (rowData) => {
		return (
			<Box display='flex' alignItems='center' gap={1}>
				{rowData.phone}
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
				<Button bg='transparent' as={NavLink} to={`/clinic/staff/${rowData.id}`}><FaEye color='#0078ff'/></Button>
				<Button bg='transparent' _focus={{ boxShadow: 'none', outline: 'none' }} onClick={() => onOpenApprove(rowData.id)}><FaTrash color='#ff0004'/></Button>
				
				{isOpenApprove && selectedUserId === rowData.id && (
					<Modal size='xl' isCentered isOpen={isOpenApprove} onClose={onCloseApprove}>
						<ModalOverlay
							bg='blackAlpha.300'
							backdropFilter='blur(3px) hue-rotate(90deg)'
						/>
						<ModalContent>
							<ModalHeader>Confirm Delete {rowData.role}</ModalHeader>
							<ModalCloseButton _focus={{ boxShadow: 'none', outline: 'none' }} />
							<Divider mb={2} borderWidth='1px' borderColor="blackAlpha.300" />
							<ModalBody>
								<Text fontSize='md' letterSpacing='wide' fontWeight='bold' mb={2}>
									Are you sure you want to delete {rowData.name}?
								</Text>
								<Text mb={2}>
									Deleting {rowData.name} will permanently remove their account.
								</Text>
								<Text fontSize='sm' fontWeight='light' letterSpacing='wide'>
									This action cannot be undone.
								</Text>
							</ModalBody>
							<ModalFooter>
								<Box display='flex'>
									<Button
										mr={3}
										backgroundColor='red'
										color='white'
										onClick={() => {
											delete_user(rowData.email, rowData.password).then(r => {
												if (r.success) {
													toast({
														title: 'User deleted successfully!',
														status: 'success',
														duration: 5000,
														isClosable: true,
														position: 'top-right'
													});
												} else {
													toast({
														title: 'Error deleting user!',
														status: 'error',
														duration: 5000,
														isClosable: true,
														position: 'top-right'
													});
												}
											});
											onCloseApprove();
										}}
									>
										Delete
									</Button>
									<Button backgroundColor='blue.400' color='white' onClick={onCloseApprove}>
										Close
									</Button>
								</Box>
							</ModalFooter>
						</ModalContent>
					
					</Modal>
				)}
			</Flex>
		);
	};
	
	const roleRowFilterTemplate = (options) => {
		return (
			<Select
				value={options.value}
				onChange={(e) => options.filterApplyCallback(e.target.value)}
				focusBorderColor="blue.500"
				variant={'ghost'}
			>
				{roles.map((role) => (
					<option value={role}>
						{role}
					</option>
				))}
			</Select>
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
	
	const phoneRowFilterTemplate = (options) => {
		return (
			<InputText
				value={options.value}
				onChange={(e) => options.filterApplyCallback(e.target.value, filters['phone'].matchMode)}
				placeholder="Search by phone number"
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
						<Text fontSize='2xl' fontWeight='semibold'>List of Staff</Text>
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
		onValue(query(ref(db, 'users'), orderByChild("clinic"), equalTo(user.clinic)), (snapshot) => {
			const users = [];
			let clinicAdminCount = 0;
			let doctorCount = 0;
			
			snapshot.forEach((childSnapshot) => {
				const { name, role, email, phone, image, password } = childSnapshot.val();
				
				let formattedRole = role.replace(/([a-z])([A-Z])/g, '$1 $2');
				users.push({
					id: childSnapshot.key,
					name,
					role: formattedRole,
					email,
					phone,
					image,
					password
				});
				
				switch (role) {
					case 'ClinicAdmin':
						clinicAdminCount++;
						break;
					case 'Doctor':
						doctorCount++;
						break;
					default:
						break;
				}
				
			});
			setUsers(users);
			setClinicAdminCount(clinicAdminCount);
			setDoctorCount(doctorCount);
		});
	}, []);
	
	const header = renderHeader();
	
	return (
		<Center h="auto" bg="#f4f4f4">
			<Flex direction='column' w='full' justifyContent='center' alignItems='center'>
				<Flex w='95%' mb={5} justifyContent='space-between' alignItems='center'>
					<Flex gap={5}>
						<Box bg="white" boxShadow="lg" rounded="lg" p={4}>
							<Flex justifyContent='center' alignItems='center'>
								<FaHospitalUser color='#ed645a' size='30'/>
								<Box ml={4}>
									<Text fontWeight='bold' letterSpacing='wide' fontSize='sm'>Clinic Admin</Text>
									<Text fontSize='lg'>{clinicAdminCount} users</Text>
								</Box>
							</Flex>
						</Box>
						<Box bg="white" boxShadow="lg" rounded="lg" p={4}>
							<Flex justifyContent='center' alignItems='center'>
								<FaStethoscope color='#29cf71' size='30'/>
								<Box ml={4}>
									<Text fontWeight='bold' letterSpacing='wide' fontSize='sm'>Doctor</Text>
									<Text fontSize='lg'>{doctorCount} users</Text>
								</Box>
							</Flex>
						</Box>
					</Flex>
					<Box>
						<Button
							bg="blue.500"
							color="white"
							_hover={{ bg: 'blue.600' }}
							_active={{ bg: 'blue.600' }}
							_focus={{ boxShadow: 'none' }}
							as={NavLink}
							to={`/staff/add`}
						>
							Add Staff
						</Button>
					</Box>
				</Flex>
				<Box
					w="95%"
					h="full"
					bg="white"
					boxShadow="lg"
					rounded="lg"
					p={3}
				>
					<DataTable value={users} header={header} stripedRows showGridlines paginator rows={10}
					           removableSort rowsPerPageOptions={[10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
					           filters={filters} filterDisplay="row" globalFilterFields={['name', 'role', 'email', 'phone']}
					           selectionMode={rowClick ? null : 'checkbox'} selection={selectedUsers}
					           onSelectionChange={(e) => setSelectedUsers(e.value)} dataKey="id"
					>
						<Column field="name" header="Name" sortable filter filterElement={nameRowFilterTemplate} body={nameBodyTemplate} style={{ width:"15%" }}></Column>
						<Column field="email" header="Email" sortable filter filterElement={emailRowFilterTemplate} style={{ width:"15%" }}></Column>
						<Column field="phone" header="Phone Number" sortable filter filterElement={phoneRowFilterTemplate} body={phoneBodyTemplate} style={{ width:"15%" }}></Column>
						<Column field="role" header="Role" sortable filter filterElement={roleRowFilterTemplate} body={roleBodyTemplate} style={{ width:"15%" }}></Column>
						<Column field="action" header="Action" body={actionBodyTemplate} style={{ width:"10%" }}></Column>
					</DataTable>
				</Box>
			
			</Flex>
		</Center>
	);
}

export default StaffList;
