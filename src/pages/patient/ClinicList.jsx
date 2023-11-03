import {Box, Flex, Grid, Link, Text,} from '@chakra-ui/react'
import {NavLink} from "react-router-dom";
import {useEffect, useState} from "react";
import {db} from "../../../api/firebase.js";
import {onValue, query, ref} from "firebase/database";

function ClinicList() {
    const [clinics, setClinics] = useState([]);
    
    useEffect(() => {
        onValue(query(ref(db, "clinics")), (snapshot) => {
            const clinics = [];
            snapshot.forEach((childSnapshot) => {
                clinics.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });
            console.log(clinics);
            setClinics(clinics);
        });
    }, []);
    
    return (
        <Grid
            w="full"
            h="auto"
            templateColumns="repeat(4, 1fr)"
            gap={10}
            p={2}
        >
            {clinics.map((clinic) => (
                <Link as={NavLink} to={`/patient/clinic/${clinic.id}`} key={clinic.id}>
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
                            bgImage={`url(${clinic.image})`} // Set the image
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