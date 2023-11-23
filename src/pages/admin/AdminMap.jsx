import {
	Box,
    HStack,
    Link,
	Text,
} from '@chakra-ui/react';
import {useState, useEffect} from "react";
import {onValue, query, ref} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {BiLinkExternal} from "react-icons/bi";
import "../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css";
import {GoogleMap, Marker, useLoadScript, InfoWindow} from '@react-google-maps/api';

export const AdminMap = () => {
    const [clinics, setClinics] = useState([]);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const mapStyle = {
        height: '75vh',
        width: '100%',
    };
    const libs = ['places'];
    const [mapRef, setMapRef] = useState(null);
    const [center, setCenter] = useState({
        lat: 5.4164,
        lng: 100.3327,
    });
    const [isMapLoading, setIsMapLoading] = useState(true);
    const [mapLoadError, setMapLoadError] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyCxkZ_qonH-WY9cbiHZsUgp9lE3PdkWH_A',
        libraries: libs,
    });

    const getMapsLink = (clinic) => {
        return `https://www.google.com/maps/search/?api=1&query=${clinic.name}`;
	};

    useEffect(() => {
        console.log('useEffect');
        onValue(query(ref(db, "clinics")), (snapshot) => {
            const clinics = [];
            const promises = [];
    
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().placeId && window.google && window.google.maps) {
                    const service = new window.google.maps.places.PlacesService(mapRef);
                    const promise = new Promise((resolve) => {
                        service.getDetails(
                            {
                                placeId: childSnapshot.val().placeId,
                            },
                            (result, status) => {
                                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                                    clinics.push({
                                        id: childSnapshot.key,
                                        ...childSnapshot.val(),
                                        lat: result.geometry.location.lat(),
                                        lng: result.geometry.location.lng(),
                                    });
                                } else {
                                    console.error(`Error retrieving place details: Status - ${status}`);
                                }
                                resolve(); // Resolve the promise regardless of success or failure
                            }
                        );
                    });
                    promises.push(promise);
                }
            });
    
            Promise.all(promises).then(() => {
                console.log("Map clinics", clinics);
                setClinics(clinics);
            });
        });
    }, [mapRef]);

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading maps";

    return (
        <Box w='full' h='full'>
            <GoogleMap
                onLoad={(map) => {
                    setIsMapLoading(false);
                    setMapRef(() => map);
                }}
                center={center}
                zoom={11}
                mapContainerStyle={mapStyle}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                }}
            >
                {clinics.map((clinic) => (
                    <Marker
                        key={clinic.id}
                        position={{ lat: clinic.lat, lng: clinic.lng }}
                        onClick={() => setSelectedClinic(clinic)}
                    />
                ))}

                {selectedClinic && (
                    <InfoWindow
                        position={{ lat: selectedClinic.lat + 0.0015, lng: selectedClinic.lng }}
                        onCloseClick={() => setSelectedClinic(null)}
                    >
                        <Box p={1} maxW="sm">
                            <Text fontSize="sm" fontWeight="medium">
                                {selectedClinic.name}
                            </Text>
                            <Text fontSize="xs" fontWeight="medium" color="gray.500" mt={1} mb={2}>
                                {selectedClinic.address}
                            </Text>
                            <Link
                                href={getMapsLink(selectedClinic)}
                                isExternal
                                target="_blank"
                                rel="noreferrer"
                                _hover={{ textDecoration: "none" }}
                                textDecoration="none"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <HStack spacing={1} fontSize="xs" fontWeight="medium" color="blue.500">
                                    <Text outline="none">View on Google Maps</Text>
                                    <BiLinkExternal />
                                </HStack>
                            </Link>
                        </Box>
                    </InfoWindow>
                )}
            </GoogleMap>
        </Box>
    );
}