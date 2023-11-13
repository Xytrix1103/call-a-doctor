import {
    Badge,
    Box,
    Flex,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    SimpleGrid,
    Text,
    VStack
} from '@chakra-ui/react'
import {useEffect, useState} from "react";
import {db} from "../../../api/firebase.js";
import {BiSearchAlt2} from "react-icons/bi";
import {onValue, query, ref} from "firebase/database";
import {NavLink} from "react-router-dom";
import {AiFillStar} from "react-icons/ai";

function ApprovedClinicList() {
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
            <Box
                w="30%"
                h="auto"
                py={2}
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
            <Flex w="full" h="auto" pb={6}>
                <SimpleGrid
                    columns={[1, 1, 2, 3, 4]}
                    gap={10}
                >
                    {filteredClinics.map((clinic) => (
                        <Flex bg="white" h="full" shadow="lg" borderRadius="lg" transition="transform 0.2s" _hover={{ transform: 'scale(1.05)', shadow: 'xl' }}>
                            <Link as={NavLink} to={`/admin/clinics/${clinic.id}`} key={clinic.id} style={{ textDecoration: 'none' }} w="full" h="full">
                                <VStack w="full" h="full">
                                    <Image
                                        w="full"
                                        h="32"
                                        fit="cover"
                                        src={clinic.image}
                                        alt={clinic.name}
                                        borderTopRadius="lg"
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
                                </VStack>
                            </Link>
                        </Flex>
                    ))}
                </SimpleGrid>
            </Flex>
        </Box>
    );
}

export default ApprovedClinicList;