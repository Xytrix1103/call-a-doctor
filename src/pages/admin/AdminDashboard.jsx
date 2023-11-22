import {
	Box,
	Flex,
	Image,
    Link,
	Input,
	InputGroup,
	Text,
    Avatar,
    InputLeftElement,
    Badge,
    VStack,
    Button,
    IconButton,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel,
    Divider,
} from '@chakra-ui/react';
import {useRef, useState, useEffect} from "react";
import {onValue, query, ref, orderByChild, equalTo} from "firebase/database";
import {db} from "../../../api/firebase.js";
import {useAuth} from "../../components/AuthCtx.jsx";
import {NavLink} from "react-router-dom";
import { FaUser, FaStethoscope, FaStar, FaStarHalf } from "react-icons/fa";
import { BiSearchAlt2 } from "react-icons/bi";
import { GiMedicines } from "react-icons/gi";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { BarChart } from '../../components/charts/BarChart';
import { DoughnutChart } from '../../components/charts/DoughnutChart';
import {AppointmentTimelineChart} from "../../components/charts/AppointmentTimelineChart.jsx"
import "../../../node_modules/primereact/resources/themes/lara-light-blue/theme.css";
import {GoogleMap, LoadScript, Marker, useLoadScript, InfoWindow, DirectionsRenderer} from '@react-google-maps/api';

function AdminDashboard() {
	
    return (
        <Flex>
            <Text>
                Admin Dashboard
            </Text>
        </Flex>
    );
}

export default AdminDashboard;