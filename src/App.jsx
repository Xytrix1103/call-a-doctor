import { useState } from 'react'
import {Routes, Route} from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
	fonts: {
		body: 'Poppins, sans-serif',
		heading: 'Poppins, sans-serif',
	},
	config: {
		initialColorMode: 'light',
		useSystemColorMode: false,
	},
	colors: {
		brand: {
			100: '#f7fafc',
			900: '#1a202c',
		},
	},
})

function App() {
  return (
	  <ChakraProvider theme={theme}>
		  <Routes>
			  <Route path="/" element={<Login />} />
		  </Routes>
      </ChakraProvider>
  )
}

export default App
