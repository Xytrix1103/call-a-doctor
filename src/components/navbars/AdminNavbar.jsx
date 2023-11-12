import {Avatar, Flex, Link, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text} from "@chakra-ui/react";
import {NavLink, useLocation} from "react-router-dom";
import {BiChevronDown} from "react-icons/bi";
import {logout} from "../../../api/auth.js";

const AdminNavbar = () => {
	const location = useLocation();
	const currentPath = location.pathname;
    const handleLogout = () => {
		logout();
	};

	return (
		<Flex
			as="nav"
			align="top"
			padding="1rem"
			bg="white" // Set the navbar background color to white
			bgColor={"white"}
			zIndex="999"
			width="100%"
			shadow="md"
			justify="space-between" // Align items to the space between
		>
			<Flex align="center">
				<Avatar
					size="md"
					src="\src\assets\images\Call_A_Doctor_Logo_NoBg.png"
				/>
				<Text fontSize="xl" ml={2} fontWeight="bold">
					Call A Doctor
				</Text>
			</Flex>
			
			<Flex alignItems="center">
				<Link as={NavLink} color="teal.500" to="/" marginRight={6} _activeLink={{ color: "#0307fc" }} _focus={{ boxShadow: "none" }}>
					Home
				</Link>
				<Link as={NavLink} color="teal.500" to="/clinics" marginRight={6} _activeLink={{ color: "#0307fc" }} _focus={{ boxShadow: "none" }}>
					Clinic List
				</Link>
				<Link as={NavLink} color="teal.500" to="/approve-clinics" marginRight={6} _activeLink={{ color: "#0307fc" }} _focus={{ boxShadow: "none" }}>
					Clinic Approval
				</Link>
				<Menu marginRight={6}>
					<MenuButton as={Link} color="teal.500" display="flex" alignItems="center">
						<Flex alignItems="center">
                            <MenuButton
								as={Button}
								rounded={'full'}
								variant={'link'}
								cursor={'pointer'}
								minW={0}>
								<Avatar
								size={'sm'}
								src="\src\assets\images\Default_User_Profile.png"
							/>
							</MenuButton>
							<BiChevronDown />
						</Flex>
					</MenuButton>
					
					<MenuList>
						<MenuItem as={NavLink} to="/" _focus={{ boxShadow: 'none' }}>
							Dashboard
						</MenuItem>
						<MenuItem as={NavLink} to="/" _focus={{ boxShadow: "none" }}>
							Settings
						</MenuItem>
						<MenuItem as={NavLink} to="/" _focus={{ boxShadow: "none" }}>
							Earnings
						</MenuItem>
						<MenuDivider />
						<MenuItem as={NavLink} onClick={handleLogout} _focus={{ boxShadow: "none" }}>
							Sign out
						</MenuItem>
					</MenuList>
				</Menu>
			</Flex>
		</Flex>
	)
}

export default AdminNavbar;