import {Badge, Box, Flex, Grid, GridItem, Input, InputGroup, InputLeftElement, Link, Text} from '@chakra-ui/react'
import {NavLink} from "react-router-dom";
import {useEffect, useState} from "react";
import {db} from "../../../api/firebase.js";
import {AiFillStar} from "react-icons/ai";
import {BiSearchAlt2} from "react-icons/bi";
import {onValue, query, ref} from "firebase/database";

function ClinicList() {
    const [clinics, setClinics] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    
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

    const filteredClinics = clinics.filter((clinic) =>
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
        <Box w="full" h="full" p={2} direction="column" mb={4}>
            <Flex
                w="30%"
                h="auto"
                p={2}
                direction="column"
                justify="center"
                align="center"
                mb={4}
            >
                <InputGroup size="md">
                    <InputLeftElement
                        pointerEvents="none"
                        children={<BiSearchAlt2 color="gray.500" />}
                    />
                    <Input
                        type="text"
                        placeholder="Search clinics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="md"
                        focusBorderColor="blue.500"
                        borderRadius="xl"
                        borderColor="gray.300"
                        backgroundColor="white"
                        color="gray.800"
                    />
                </InputGroup>
            </Flex>
            <Box w="full" h="auto" p={2} direction="column">
                <Grid
                    w="full"
                    h="auto"
                    templateColumns="repeat(4, auto)"
                    gap={10}
                    p={2}
                >
                    {[...filteredClinics,...filteredClinics,...filteredClinics,...filteredClinics,...filteredClinics].map((clinic) => (
                        <GridItem w="auto" h="64" key={clinic.id} maxW="80">
                            <Link as={NavLink} to={`/clinics/${clinic.id}`} key={clinic.id} style={{ textDecoration: 'none' }}>
                                <Flex
                                    direction="column"
                                    justify="flex-end"
                                    bg="white"
                                    w="full"
                                    h="full"
                                    shadow="lg"
                                    borderRadius="lg"
                                    transition="transform 0.2s"
                                    _hover={{
                                        transform: 'scale(1.05)',
                                        shadow: 'xl',
                                    }}
                                >
                                    <Box
                                        w="full"
                                        h="full"
                                        bgImage={`url(${clinic.image})`}
                                        bgSize="cover"
                                        bgPosition="center"
                                        borderTopRadius="8px"
                                    />
                                    <Box px={4} py={3} w="full" h="full">
                                        <Box display='flex' alignItems='baseline' mb={1}>
                                            <Badge borderRadius='full' px='2' colorScheme='blue'>
                                                Immunology
                                            </Badge>
                                            <Box
                                                color='gray.500'
                                                fontWeight='semibold'
                                                letterSpacing='wide'
                                                fontSize='xs'
                                                textTransform='uppercase'
                                                ml='2'
                                            >
                                                3.75 km away
                                            </Box>
                                        </Box>
                                        
                                        <Text fontSize="lg" fontWeight="bold" isTruncated w="full">
                                            {clinic.name}
                                        </Text>
                                        
                                        <Text fontSize="md" fontWeight="md" isTruncated w="full">
                                            {clinic.address}
                                        </Text>
                                        
                                        <Box display='flex' mt={1} alignItems='center'>
                                            {
                                                Array(5)
                                                    .fill('')
                                                    .map((_, i) => (
                                                        <AiFillStar
                                                            key={i}
                                                            color={i < 4 ? 'gold' : 'gray'}
                                                        />
                                                    ))
                                            }
                                            <Box as='span' ml='2' color='gray.600' fontSize='sm'>
                                                4.0 reviews
                                            </Box>
                                        </Box>
                                    </Box>
                                </Flex>
                            </Link>
                        </GridItem>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

export default ClinicList;