import {useEffect, useRef, useState} from "react";
import {Autocomplete, GoogleMap, InfoWindow, LoadScript, Marker} from "@react-google-maps/api";
import {Box, Input, InputGroup, InputLeftElement, Text} from "@chakra-ui/react";
import {BiSearchAlt2} from "react-icons/bi";
import {Link} from "react-router-dom";

const ClinicLocationStep = ({placeId, setPlaceId}) => {
	const mapStyle = {
		height: '440px',
		width: '100%',
	};
	const libs = ["places"];
	const [mapRef, setMapRef] = useState(null);
	const [openInfo, setOpenInfo] = useState(false);
	const [center, setCenter] = useState({
		lat: 5.4164,
		lng: 100.3327,
	});
	const inputRef = useRef();
	
	const handlePlaceSelect = () => {
		if (inputRef.current && inputRef.current.getPlace) {
			const place = inputRef.current.getPlace();
			const placeId = place.place_id;
			const { geometry, formatted_address, name } = place;
			const { location } = geometry;
			mapRef.panTo({ lat: location.lat(), lng: location.lng() });
			setPlaceId({
				lat: location.lat(),
				lng: location.lng(),
				name: name,
				address: formatted_address,
				placeId: placeId,
			});
			setOpenInfo(true);
		}
	};
	
	const handleViewOnMaps = () => {
		if (placeId) {
			const { name } = placeId;
			const url = `https://www.google.com/maps/search/?api=1&query=${name}`;
			window.open(url, '_blank');
		}
	};
	
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
						autocomplete.setFields(["geometry", "formatted_address", "place_id", "name"]);
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
							placeholder="Search for clinic location.."
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
				{placeId && (
					<Marker
						position={placeId}
						onClick={() => {
							// Handle marker click
							setOpenInfo(!openInfo);
						}}
					/>
				)}
				{openInfo && placeId && (
					<InfoWindow
						position={{ lat: placeId.lat + 0.0015, lng: placeId.lng }}
						onCloseClick={() => {
							setOpenInfo(false);
						}}
					>
						<Box p={1} maxW="200px">
							<Text fontSize="sm" fontWeight="medium">
								{placeId.name}
							</Text>
							<Text fontSize="xs" fontWeight="medium" color="gray.500" mt={1} mb={2}>
								{placeId.address}
							</Text>
							<Link onClick={handleViewOnMaps} size="sm" fontSize="xs">
								View on Google Maps
							</Link>
						</Box>
					</InfoWindow>
				)}
			</GoogleMap>
		</LoadScript>
	);
}

export default ClinicLocationStep