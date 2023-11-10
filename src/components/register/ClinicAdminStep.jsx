import {
	Box,
	Button,
	Center,
	Flex,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	IconButton,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	InputLeftElement,
	Select,
	Text,
	Textarea,
} from '@chakra-ui/react';
import { useRef, useState } from "react";
import { BsFillCloudArrowDownFill } from "react-icons/bs";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useForm } from "react-hook-form";
import { register_clinic } from "../../../api/clinic_registry.js";
import { BiSearchAlt2 } from "react-icons/bi";
import { LoadScript, Marker, GoogleMap, Autocomplete, InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';