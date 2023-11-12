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
    Divider,
    Text,
    VStack
} from '@chakra-ui/react'
import {useEffect, useState} from "react";
import {db} from "../../../api/firebase.js";
import {BiSearchAlt2} from "react-icons/bi";
import {onValue, query, ref, orderByChild, equalTo} from "firebase/database";
import {NavLink, useParams} from "react-router-dom";
import {AiFillStar} from "react-icons/ai";
import {MdOutlineWork} from "react-icons/md";
import {FcAbout} from "react-icons/fc";

function ClinicDoctorList() {
    const {id} = useParams();
    console.log(id);
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    useEffect(() => {
        const usersRef = ref(db, "users");
        onValue(
            query(
                usersRef,
                orderByChild("role"),
                equalTo("Doctor")
            ),
            (snapshot) => {
                const doctors = [];
                snapshot.forEach((childSnapshot) => {
                    const user = childSnapshot.val();
                    console.log(user);
                    if (user.clinic === (id)) { // Filter doctors by clinic ID
                        console.log(user.clinic);
                        doctors.push({
                        id: childSnapshot.key,
                        ...user,
                        });
                    }
                });
                console.log(doctors);
                setDoctors(doctors);
            }
        );
    }, [id]);

    const filteredDoctors = doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                        placeholder="Search doctors..."
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
                    w="full"
                >
                    {filteredDoctors.map((doctor) => (
                        <Flex bg="white" h="full" shadow="lg" borderRadius="lg" transition="transform 0.2s" _hover={{ transform: 'scale(1.05)', shadow: 'xl' }}>
                            <VStack w="full" h="full">
                                <Box
                                    w="full"
                                    h="48"
                                >
                                    <Image
                                        w="full"
                                        h="48"
                                        fit="cover"
                                        src={doctor.image}
                                        alt={doctor.name}
                                        borderTopRadius="lg"
                                    />
                                </Box>
                                <Box px={4} pb={3} w="full" h="full">
                                    <Flex
                                        direction={'column'}
                                    >
                                        <Box display='flex' mt={1} alignItems='center'>
                                            {
                                                Array(5)
                                                    .fill('')
                                                    .map((_, i) => (
                                                        <AiFillStar
                                                            key={i}
                                                            size={15}
                                                            color={i < 4 ? 'gold' : 'gray'}
                                                        />
                                                    ))
                                            }
                                            <Box as='span' ml='2' color='gray.600' fontSize='xs'>
                                                4.0 ratings
                                            </Box>
                                        </Box>
                                        <Text fontSize="lg" fontWeight="bold" isTruncated w="full" letterSpacing='wide' mb={1}>
                                            Dr. {doctor.name}
                                        </Text>               
                                        <Divider w="full" mb={2} borderColor="blackAlpha.300" borderWidth="1px" rounded="lg" alignSelf='center'/>                                         
                                    </Flex>
                                    <Flex alignItems='center' mb={2}>
                                        <MdOutlineWork color='blue' />
                                        <Box
                                            color='gray.900'
                                            fontWeight='bold'
                                            letterSpacing='wide'
                                            fontSize='xs'
                                            textTransform='uppercase'
                                            mx='1'
                                        >
                                            Specialties:
                                        </Box>             
                                        <Box
                                            color='gray.600'
                                            fontWeight='semibold'
                                            letterSpacing='wide'
                                            fontSize='xs'
                                        >
                                            {doctor.specialty ? doctor.specialty : "General Physician"}
                                        </Box>   
                                    </Flex>
                                    <Flex alignItems='center' mb={1}>
                                        <FcAbout />
                                        <Box
                                            color='gray.900'
                                            fontWeight='bold'
                                            letterSpacing='wide'
                                            fontSize='xs'
                                            textTransform='uppercase'
                                            ml='1'
                                        >
                                            About
                                        </Box>                                            
                                    </Flex>

                                    <Text
                                        fontSize="xs"
                                        fontWeight='semibold'
                                        color="gray.600"
                                        h="32"
                                    >
                                        {doctor.introduction ? 
                                            doctor.introduction : 
                                            "With a passion for providing comprehensive and compassionate healthcare, I am dedicated to [specific area of focus, e.g., promoting wellness, preventing diseases, or delivering personalized treatment plans]."}
                                    </Text>
                                </Box>
                            </VStack>
                        </Flex>
                    ))}
                </SimpleGrid>
            </Flex>
        </Box>
    );
}

export default ClinicDoctorList;