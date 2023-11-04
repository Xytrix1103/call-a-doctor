import {Box, Flex, Grid, Link, Text, Badge, Input, InputGroup, InputLeftElement} from '@chakra-ui/react'
import {NavLink} from "react-router-dom";
import {useEffect, useState} from "react";
import {db} from "../../../api/firebase.js";
import {AiFillStar} from "react-icons/ai";
import {BiSearchAlt2} from "react-icons/bi";
import {onValue, query, ref} from "firebase/database";

function ClinicList() {
    const [clinics, setClinics] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    
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
        <Box>
            <Box
                w="30%"
                h="auto"
                p={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
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
            </Box>
            <Grid
                w="full"
                h="auto"
                templateColumns="repeat(4, 1fr)"
                gap={10}
                p={2}
            >
                {filteredClinics.map((clinic) => (
                    <Link as={NavLink} to={`/clinics/${clinic.id}`} key={clinic.id} style={{ textDecoration: 'none' }}>
                        <Flex
                            direction="column"
                            justifyContent="flex-end"
                            bg="white"
                            w="100%"
                            h="64"
                            shadow="lg"
                            borderRadius="lg"
                            transition="transform 0.2s" 
                            _hover={{ 
                                transform: 'scale(1.05)', 
                                shadow: 'xl', 
                            }}
                        >
                            <Box
                                w="100%"
                                h="100%" 
                                bgImage={`url(${clinic.image})`}
                                bgSize="cover"
                                bgPosition="center"
                                borderTopRadius="8px"
                            />
                            <Box px={4} py={3}>
                                <Box display='flex' alignItems='baseline' mb={1}>
                                    <Badge borderRadius='full' px='2' colorScheme='teal'>
                                        Specialty
                                    </Badge>
                                    <Box
                                        color='gray.500'
                                        fontWeight='semibold'
                                        letterSpacing='wide'
                                        fontSize='xs'
                                        textTransform='uppercase'
                                        ml='2'
                                    >
                                        Distance from user
                                    </Box>
                                </Box>

                                <Text fontSize="lg" fontWeight="bold" isTruncated>
                                    {clinic.name}
                                </Text>

                                <Text fontSize="md" fontWeight="md" isTruncated>
                                    {clinic.address}
                                </Text>

                                <Box display='flex' mt={1} alignItems='center'>
                                    {
                                        Array(5)
                                            .fill('')
                                            .map((_, i) => (
                                                <AiFillStar
                                                    key={i}
                                                    color={i < 4 ? 'teal' : 'gray'}
                                                />
                                            ))
                                    }
                                    <Box as='span' ml='2' color='gray.600' fontSize='sm'>
                                        reviews
                                    </Box>
                                </Box>
                            </Box>                       
                        </Flex>
                    </Link>
                ))}
            </Grid>
        </Box>
    );
}

export default ClinicList;