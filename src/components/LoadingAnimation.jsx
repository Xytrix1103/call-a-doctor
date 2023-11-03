import Lottie from 'lottie-react';
import {Box, Center, Spinner} from "@chakra-ui/react";
import { useEffect, useState } from 'react';

const LoadingAnimation = () => {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch('https://lottie.host/75c4859e-03e8-4aa7-9abf-804c91611aea/o5Ehm7ofRo.json')
        .then((response) => response.json())
        .then((data) => {
            setAnimationData(data);
        })
        .catch((error) => {
            console.error('Failed to fetch animation data:', error);
        });
    }, []);

    
    if (!animationData) {
        return (
            <Box w="full" h="100vh" bg="white" pos="fixed" top="0" left="0" zIndex="1000" display="flex" justifyContent="center" alignItems="center">
                <Center w="full" h="full">
                    <Spinner size="xl" color="brand.900"/>
                </Center>
            </Box>
        )
    } else {
        return (
            <Box w="full" h="100vh" bg="white" pos="fixed" top="0" left="0" zIndex="1000" display="flex" justifyContent="center" alignItems="center">
                <Center w="full" h="full">
                    <Lottie
                        animationData={animationData}
                        loop={true}
                        autoplay={true}
                    />
                </Center>
            </Box>
        )        
    }

}

export default LoadingAnimation;