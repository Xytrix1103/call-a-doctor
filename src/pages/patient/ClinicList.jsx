import {Box, Flex, Grid, Link, Text,} from '@chakra-ui/react'
import {NavLink} from "react-router-dom";

const clinics = [
	// Define your clinic data here
	{id: 1, name: 'Clinic 1', imageUrl: '/src/assets/images/Picture-Placeholder.jpg'},
	{id: 2, name: 'Clinic 2', imageUrl: '/src/assets/images/Picture-Placeholder.jpg'},
	{id: 3, name: 'Clinic 3', imageUrl: '/src/assets/images/Picture-Placeholder.jpg'},
	{id: 4, name: 'Clinic 4', imageUrl: '/src/assets/images/Picture-Placeholder.jpg'},
	{id: 5, name: 'Clinic 5', imageUrl: '/src/assets/images/Picture-Placeholder.jpg'},
	{id: 6, name: 'Clinic 6', imageUrl: '/src/assets/images/Picture-Placeholder.jpg'},
	{id: 7, name: 'Clinic 7', imageUrl: '/src/assets/images/Picture-Placeholder.jpg'},
	{id: 8, name: 'Clinic 8', imageUrl: '/src/assets/images/Picture-Placeholder.jpg'},
	{id: 9, name: 'Clinic 9', imageUrl: '/src/assets/images/Picture-Placeholder.jpg'},
	{id: 10, name: 'Clinic 10', imageUrl: '/src/assets/images/Picture-Placeholder.jpg'},
];

function ClinicList() {
	return (
		<Grid
			w="full"
			h="auto"
			templateColumns="repeat(4, 1fr)"
			gap={10}
			p={2}
		>
			{clinics.map((clinic) => (
				<Link as={NavLink} to={`/patient/clinics/${clinic.id}`} key={clinic.id}>
					<Flex
						direction="column"
						alignItems="center"
						justifyContent="flex-end" // Align text to the bottom
						bg="white"
						w="100%"
						h="48"
						shadow="lg"
						borderRadius="lg"
						transition="transform 0.2s"
					>
						<Box
							w="100%"
							h="100%" // Set the height for the image
							bgImage={`url(${clinic.imageUrl})`} // Set the image
							bgSize="cover"
							bgPosition="center"
							borderTopRadius="8px" // Rounded top corners
						/>
						<Text fontSize="md" fontWeight="bold" margin="0.5rem" maxW={60}
						      isTruncated> {/* Add space between image and text */}
							{clinic.name}
						</Text>
					</Flex>
				</Link>
			))}
		</Grid>
	);
    return (
        <Grid
            w="full"
            h="auto"
            templateColumns="repeat(4, 1fr)"
            gap={10}
            p={2}
        >
            {clinics.map((clinic) => (
                <Link as={NavLink} to={`/patient/clinics/${clinic.id}`} key={clinic.id}>
                    <Flex
                        direction="column"
                        alignItems="center"
                        justifyContent="flex-end" // Align text to the bottom
                        bg="white"
                        w="100%"
                        h="48"
                        shadow="lg"
                        borderRadius="lg"
                        transition="transform 0.2s"
                    >
                        <Box
                            w="100%"
                            h="100%" // Set the height for the image
                            bgImage={`url(${clinic.imageUrl})`} // Set the image
                            bgSize="cover"
                            bgPosition="center"
                            borderTopRadius="8px" // Rounded top corners
                        />
                        <Text fontSize="md" fontWeight="bold" margin="0.5rem" maxW={60} isTruncated> {/* Add space between image and text */}
                            {clinic.name}
                        </Text>
                    </Flex>
                </Link>
            ))}
        </Grid>
    );
}

export default ClinicList;