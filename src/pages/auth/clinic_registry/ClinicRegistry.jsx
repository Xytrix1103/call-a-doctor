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
	Text,
	useSteps,
} from '@chakra-ui/react';
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {register_clinic} from "../../../../api/clinic_registry.js";
import ClinicLocationStep from "./ClinicLocationStep.jsx";
import ClinicDetailsStep from "./ClinicDetailsStep.jsx";
import ClinicAdminStep from "./ClinicAdminStep.jsx";

function ClinicRegistry() {
	const [place, setPlace] = useState(null);
	
	const form = useForm();
	const {handleSubmit, trigger} = form;
	const imageRef = useRef(null);
	
	const steps = [
		{ title: 'First', description: 'Clinic Address', component: <ClinicLocationStep place= {place} setPlace={setPlace}/> },
		{ title: 'Second', description: 'Clinic Registry', component: <ClinicDetailsStep form={form} imageRef={imageRef} place={place} setPlace={setPlace}/> },
		{ title: 'Third', description: 'Admin Registry', component: <ClinicAdminStep form={form}/> },
	];
	
	const {activeStep, setActiveStep} = useSteps({
		steps,
		initialStep: 0,
	});
	
	const onSubmit = async (data) => {
		data = {
			...data,
			image: imageRef.current.files[0],
		}
		await register_clinic(data);
		console.log(data);
	}
	
	const onNext = () => {
		switch (activeStep) {
			case 0:
				if (place) {
					setActiveStep(activeStep + 1);
				} else {
					alert("Please select a location")
				}
				break;
			case 1:
				//trigger certain fields
				trigger(["clinic_name", "address", "phone", "start_time", "end_time", "start_day", "end_day"]).then(r => {
					if (r && imageRef.current.files[0]) {
						setActiveStep(activeStep + 1);
					} else {
						alert("Please fill in all the fields")
					}
				});
				break;
			case 2:
				trigger(["admin_name", "email", "password", "confirm_password"]).then(r => {
					if (r) {
						setActiveStep(activeStep + 1);
					} else {
						alert("Please fill in all the fields")
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
		<Center w="100%" h="auto" bg="#f4f4f4">
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
					<Flex>
						<Box w="full" mb={4}>
							<Text fontSize="xl" fontWeight="bold">
								{steps[activeStep].description}
							</Text>
						</Box>
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
									{activeStep === steps.length - 1 ? "Submit" : "Next"}
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
