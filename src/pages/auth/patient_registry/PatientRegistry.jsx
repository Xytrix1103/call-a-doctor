import {
	Box,
	Button,
	Center,
	Flex,
	IconButton,
	Link,
	Step,
	StepDescription,
	StepIcon,
	StepIndicator,
	StepNumber,
	Stepper,
	StepSeparator,
	StepStatus,
	StepTitle,
	Text,
	useSteps,
	useToast,
} from '@chakra-ui/react';
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useAuth} from "../../../components/AuthCtx.jsx";
import {Navigate, useNavigate} from "react-router-dom";
import {register as registerUser} from "../../../../api/auth.js";
import {AiOutlineArrowLeft} from "react-icons/ai";
import PatientDetailsStep from './PatientDetailsStep';
import PatientLocationStep from './PatientLocationStep';

function PatientRegistry() {
	const [place, setPlace] = useState(null);
    const {user} = useAuth();
	const form = useForm();
	const {handleSubmit, trigger} = form;
	const navigate = useNavigate();
	const toast = useToast();
	
	const steps = [
		{ title: 'First', description: 'Address', component: <PatientLocationStep place={place} setPlace={setPlace}/> },
		{ title: 'Second', description: 'Details', component: <PatientDetailsStep form={form} place={place}/> },
	];
	
	const {activeStep, setActiveStep} = useSteps({
		steps,
		initialStep: 0,
	});

	const handleBack = () => {
		navigate('/login');
	};

    useEffect(() => {
        if (user) return <Navigate to="/" />;
    }, [user]);
	
	const onSubmit = async (data) => {
		data = {
			...data,
			placeId: place.placeId,
		}
        const password = data["password"];
        const confirm_password = data["confirm_password"];
        
        if (password !== confirm_password) {
            toast({
				title: "Registration failed.",
				description: "Passwords do not match",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top"
			});
            return;
        }
        const res = await registerUser(data);
        
		if (res) {
			if (res.error) {
				toast({
					title: "Registration failed.",
					description: res.error,
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "top"
				});
			} else {
				return true;
			}
		} else {
			toast({
				title: "Registration failed.",
				description: res.error,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top"
			});
			return false;
		}
	}
	
	const onNext = () => {
		console.log(activeStep);
		switch (activeStep) {
			case 0:
				if (place) {
					setActiveStep(activeStep + 1);
				} else {
					toast({
						title: "Failed to proceed to next step.",
						description: "Please select a location.",
						status: "error",
						duration: 3000,
						isClosable: true,
						position: "top"
					});
				}
				break;
			case 1:
				console.log("Step 2");
				trigger(["name", "address", "phone", "age", "password", "confirm_password"]).then(r => {
					if (r) {
                        onSubmit(form.getValues()).then(r => {
                            if (r) {
								toast({
									title: "Registration successful.",
									status: "success",
									duration: 3000,
									isClosable: true,
									position: "top"
								});
                            } else {
								toast({
									title: "Registration failed.",
									description: "Please fill in all the fields",
									status: "error",
									duration: 3000,
									isClosable: true,
									position: "top"
								});
                            }
                        });
					} else {
						toast({
							title: "Registration failed.",
							description: "Please fill in all the fields",
							status: "error",
							duration: 3000,
							isClosable: true,
							position: "top"
						});
					}
				});
				break;
			default:
				break;
		}
	}

	const [isContentOverflowing, setContentOverflowing] = useState(false);

	const contentRef = useRef(null); 

	useEffect(() => {
		const handleResize = () => {

			if (contentRef.current) {
				const contentHeight = contentRef.current.getBoundingClientRect().height;
				const windowHeight = window.innerHeight;
				setContentOverflowing(contentHeight > windowHeight);
			}
		};

		window.addEventListener("resize", handleResize);

		handleResize();
  
	}, [activeStep]);
	
	return (
		<Center w="100%" h="auto" bg="#f4f4f4" p={5}>
			<Flex
				w="85%"
				h="full"
				bg="white"
				boxShadow="xl"
				rounded="xl"
				px={8}
				py={4}
				direction="column"
			>
				<form action="/api/register-clinic" method="post" onSubmit={handleSubmit(onSubmit)}
				      encType="multipart/form-data">
					<Flex justifyContent="center" alignItems="center" mb={4}>
						<Box>
							<IconButton
								icon={<AiOutlineArrowLeft />}
								aria-label="Back"
								onClick={handleBack}
								bg="transparent"
							/>
						</Box>
						<Box w="full" ml={3}>
							<Text fontSize="xl" fontWeight="bold">
							{steps[activeStep].description}
							</Text>
						</Box>
						<Flex w="full" alignItems="center" justifyContent="end">
							<Text textAlign="center">
								Registering a clinic?{' '} <Link color="blue.500" href="/register-clinic"> Register here </Link>
							</Text>
						</Flex>
					</Flex>
					<Flex w="full" h="full" grow={1} direction="column" ref={contentRef}>
						{steps[activeStep].component}
					</Flex>
					<Flex w="full" justifyContent="center" alignItems="center" direction="column">
						<Box w="70%" mt={6} mb={5}>
							<Stepper index={activeStep}>
								{steps.map((step, index) => (
									<Step
										key={index}
										onClick={() => {
											// Handle step transitions
											if (index > activeStep) {
												// Move to the next step
												if (activeStep < steps.length - 1) {
													onNext();
												}
											} else if (index < activeStep) {
												// Move to the previous step
												if (activeStep > 0) {
													setActiveStep(activeStep - 1);
												}
											}
										}}
									>
										<StepIndicator>
											<StepStatus
												complete={<StepIcon />}
												incomplete={<StepNumber />}
												active={<StepNumber />}
											/>
										</StepIndicator>
										
										<Box flexShrink='0'>
											<StepTitle>{step.title}</StepTitle>
											<StepDescription>{step.description}</StepDescription>
										</Box>
										
										<StepSeparator />
									</Step>
								))}
							</Stepper>
						</Box>
						<Flex w="70%" justifyContent="center">
							{
								activeStep > 0 && (
									<Box>
										<Button
											variant="solid"
											colorScheme="blue"
											size="md"
											mx={2}
											onClick={() => {
												if (activeStep > 0) {
													setActiveStep(activeStep - 1);
												}
											}}
										>
											Back
										</Button>
									</Box>
								)
							}
							<Box>
								<Button
									variant="solid"
									colorScheme="blue"
									size="md"
									mx={2}
									onClick={onNext}
								>
									{
										activeStep === steps.length - 1 ? "Submit" : "Next"
									}
								</Button>
							</Box>
						</Flex>
					</Flex>
				</form>
			</Flex>
		</Center>
	);
}

export default PatientRegistry;
