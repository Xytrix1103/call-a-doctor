import {useEffect, useRef, useState} from "react";
import {Autocomplete, GoogleMap, InfoWindow, LoadScript, Marker} from "@react-google-maps/api";
import {Box, HStack, Input, InputGroup, InputLeftElement, Link, Text} from "@chakra-ui/react";
import {BiLinkExternal, BiSearchAlt2} from "react-icons/bi";

const PatientLocationStep = ({place, setPlace}) => {
	const mapStyle = {
		height: '450px',
		width: '100%',
	};
	const libs = ["places"];
	const [mapRef, setMapRef] = useState(null);
	const [center, setCenter] = useState({
		lat: 5.4164,
		lng: 100.3327,
	});
	const inputRef = useRef();
	
	const handlePlaceSelect = () => {
		if (inputRef.current && inputRef.current.getPlace) {
			const place = inputRef.current.getPlace();
			const place_id = place.place_id;
			const { geometry, formatted_address, name, formatted_phone_number } = place;
			console.log(place);
			const { location } = geometry;
			mapRef.panTo({ lat: location.lat(), lng: location.lng() });
			setPlace({
				lat: location.lat(),
				lng: location.lng(),
				name: name,
				address: formatted_address,
				place_id: place_id,
				contact: formatted_phone_number
			});
		}
	};
	
	const getMapsLink = () => {
		if (place) {
			const { name } = place;
			return `https://www.google.com/maps/search/?api=1&query=${name}`;
		}
	}
	
	useEffect(() => {
		if(navigator.geolocation) {
			console.log("Geolocation is supported by this browser.");
			navigator.geolocation.getCurrentPosition((position) => {
				console.log(position);
				setCenter({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
			});
		}
	}, []);
	
	return (
		<LoadScript
			googleMapsApiKey="AIzaSyCxkZ_qonH-WY9cbiHZsUgp9lE3PdkWH_A"
			libraries={libs}
		>
			
			<Box
				mb={3}
				mt={2}
				w="full"
			>
				<Autocomplete
					onLoad={(autocomplete) => {
						inputRef.current = autocomplete;
						autocomplete.setFields(["geometry", "formatted_address", "place_id", "name", "formatted_phone_number"]);
					}}
					onPlaceChanged={handlePlaceSelect}
				>
					<InputGroup size="md">
						<InputLeftElement
							pointerEvents="none"
							children={<BiSearchAlt2 color="gray.500" />}
						/>
						<Input
							type='text'
							placeholder="Search for home location..."
							ref={inputRef}
							focusBorderColor='blue.500'
						/>
					</InputGroup>
				</Autocomplete>
			</Box>
			<GoogleMap
				onLoad={(map) => {
					setMapRef(map);
				}}
				center={center}
				zoom={15} // Adjust the zoom level as needed
				mapContainerStyle={mapStyle}
			>
				{place && (
					<Marker
						position={{ lat: place.lat, lng: place.lng }}
					/>
				)}
				{place && (
					<InfoWindow
						position={{ lat: place.lat + 0.0015, lng: place.lng }}
					>
						<Box p={1} maxW="sm">
							<Text fontSize="sm" fontWeight="medium">
								{place.name}
							</Text>
							<Text fontSize="xs" fontWeight="medium" color="gray.500" mt={1} mb={2}>
								{place.address}
							</Text>
							<Link href={getMapsLink()} isExternal target="_blank" rel="noreferrer" _hover={{textDecoration: "none"}} textDecoration="none" onClick={(e) => e.stopPropagation()}>
								<HStack spacing={1} fontSize="xs" fontWeight="medium" color="blue.500">
									<Text outline="none">View on Google Maps</Text>
									<BiLinkExternal/>
								</HStack>
							</Link>
						</Box>
					</InfoWindow>
				)}
			</GoogleMap>
		</LoadScript>
	);
}

export default PatientLocationStep