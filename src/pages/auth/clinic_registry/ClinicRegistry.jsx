import {
	Box,
	Button,
	Center,
	Flex,
	Step,
	StepDescription,
	StepIcon,
	StepIndicator,
	StepNumber,
	Stepper,
	StepSeparator,
	StepStatus,
	StepTitle,
	IconButton,
	useSteps,
	Text,
	Alert,
	AlertIcon,
	AlertDescription,
	CloseButton,
} from '@chakra-ui/react';
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {register_clinic} from "../../../../api/clinic_registry.js";
import {AiOutlineArrowLeft} from "react-icons/ai";
import ClinicLocationStep from "./ClinicLocationStep.jsx";
import ClinicDetailsStep from "./ClinicDetailsStep.jsx";
import ClinicAdminStep from "./ClinicAdminStep.jsx";

function ClinicRegistry() {
	const [place, setPlace] = useState(null);
	const navigate = useNavigate();
	const form = useForm();
	const {handleSubmit, trigger} = form;
	const [image, setImage] = useState(null);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	
	const steps = [
		{ title: 'First', description: 'Clinic Address', component: <ClinicLocationStep place= {place} setPlace={setPlace}/> },
		{ title: 'Second', description: 'Clinic Registry', component: <ClinicDetailsStep form={form} image={image} setImage={setImage} place={place} setPlace={setPlace}/> },
		{ title: 'Third', description: 'Admin Registry', component: <ClinicAdminStep form={form}/> },
	];
	
	const {activeStep, setActiveStep} = useSteps({
		steps,
		initialStep: 0,
	});

	const handleBack = () => {
		navigate('/login');
	};

	const onClose = () => {
		setError(null);
		setSuccess(null);
	}
	
	const onSubmit = async (data) => {
		data = {
			...data,
			image: image,
			placeId: place.placeId,
		}
		await register_clinic(data);
		console.log(data);
		
		return true
	}
	
	const onNext = () => {
		console.log(activeStep);
		switch (activeStep) {
			case 0:
				if (place) {
					setActiveStep(activeStep + 1);
					setError(null);
					setSuccess(null);
				} else {
					setError("Please select a location")
				}
				break;
			case 1:
				console.log("Step 2");
				trigger(["clinic_name", "address", "phone", "start_time", "end_time", "start_day", "end_day"]).then(r => {
					if (r && image) {
						setActiveStep(activeStep + 1);
						setError(null);
						setSuccess(null);
					} else {
						setError("Please fill in all the fields")
					}
				});
				break;
			case 2:
				console.log("Step 3");
				trigger(["admin_name", "email", "password", "confirm_password"]).then(r => {
					if (r) {
						onSubmit(form.getValues()).then(r => {
							if (r) {
								setSuccess("Clinic registered successfully");
							} else {
								setError("Please fill in all the fields")
							}
						});
					} else {
						setError("Please fill in all the fields")
					}
				});
				break;
			default:
				break;
		}
	}

	const [isContentOverflowing, setContentOverflowing] = useState(false);

	const contentRef = useRef(null); // Create a ref for the content

	useEffect(() => {
	  const handleResize = () => {
		// Check if the content height exceeds the window height
		if (contentRef.current) {
			const contentHeight = contentRef.current.getBoundingClientRect().height;
			const windowHeight = window.innerHeight;
			setContentOverflowing(contentHeight > windowHeight);
		}
	  };
  
	  // Add event listener for window resize
	  window.addEventListener("resize", handleResize);
  
	  // Call it initially
	  handleResize();
  
	}, [activeStep]);
	
	return (
		<Center w="100%" h="auto" bg="#f4f4f4" p={5}>
			{
                error && (
                    <Alert 
						status="error"
						variant="left-accent"
						position="fixed"
						top="0"
						zIndex={2}
					>
                        <AlertIcon />
						<AlertDescription>{error}</AlertDescription>
						<CloseButton position="absolute" right="8px" top="8px" onClick={onClose}/>
                    </Alert>
                )

            }
			{
				success && (
					<Alert
						status="success"
						variant="left-accent"
						position="fixed"
						top="0"
						zIndex={2}
					>
						<AlertIcon />
						<AlertDescription>{success}</AlertDescription>
						<CloseButton position="absolute" right="8px" top="8px" onClick={onClose}/>
					</Alert>
				)
			}
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
								Don't have an account?{" "}
								<Text as="a" href="/register" textColor="blue.500" fontWeight="medium" _hover={{ textDecoration: "underline" }}>
									Sign Up
								</Text>
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

export default ClinicRegistry;
