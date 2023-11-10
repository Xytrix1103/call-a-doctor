import {
	Box,
	Input,
	InputGroup,
	InputLeftElement,
	Text,
} from '@chakra-ui/react';
import { useRef, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { LoadScript, Marker, GoogleMap, Autocomplete, InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';

function MapWithSearch() {
	const mapStyle = {
	  height: '400px',
	  width: '100%',
	};
	const [mapRef, setMapRef] = useState(null);
	const [selected, setSelected] = useState(null);
	const [openInfo, setOpenInfo] = useState(false);
	const [center] = useState({
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
			setSelected({
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
		if (selected) {
			const { name } = selected;
			const url = `https://www.google.com/maps/search/?api=1&query=${name}`;
			window.open(url, '_blank');
		}
	};
  
	return (
		<LoadScript
			googleMapsApiKey="AIzaSyCxkZ_qonH-WY9cbiHZsUgp9lE3PdkWH_A"
			libraries={["places"]}
		>
				
			<Box
				mb={2}
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
				zoom={15}
				mapContainerStyle={mapStyle}
			>
				{selected && (
					<Marker
						position={selected}
						onClick={() => {
							// Handle marker click
							setOpenInfo(!openInfo);
						}}
					/>
				)}
				{openInfo && selected && (
					<InfoWindow
						position={{ lat: selected.lat + 0.0015, lng: selected.lng }}
						onCloseClick={() => {
							setOpenInfo(false);
						}}
					>
						<Box p={1} maxW="200px">
							<Text fontSize="sm" fontWeight="medium">
								{selected.name}
							</Text>
							<Text fontSize="xs" fontWeight="medium" color="gray.500" mt={1} mb={2}>
								{selected.address}
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

export default MapWithSearch;