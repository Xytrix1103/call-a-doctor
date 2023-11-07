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
import {useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {register_clinic} from "../../../../api/clinic_registry.js";
import ClinicLocationStep from "./ClinicLocationStep.jsx";
import ClinicDetailsStep from "./ClinicDetailsStep.jsx";
import ClinicAdminStep from "./ClinicAdminStep.jsx";

function ClinicRegistry() {
	const [placeId, setPlaceId] = useState(null);
	
	const form = useForm();
	const {handleSubmit, trigger} = form;
	const imageRef = useRef(null);
	
	const steps = [
		{ title: 'First', description: 'Clinic Address', component: <ClinicLocationStep placeId= {placeId} setPlaceId={setPlaceId}/> },
		{ title: 'Second', description: 'Clinic Registry', component: <ClinicDetailsStep form={form} imageRef={imageRef}/> },
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
				if (placeId) {
					setActiveStep(activeStep + 1);
				} else {
					alert("Please select a location")
				}
				break;
			case 1:
				//trigger certain fields
				trigger(["name", "address", "phone", "start_time", "end_time", "start_day", "end_day"]).then(r => {
					if (r) {
						setActiveStep(activeStep + 1);
					} else {
						alert("Please fill in all the fields")
					}
				});
				break;
			case 2:
				trigger(["admin_name", "email", "assword", "confirm_password"]).then(r => {
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
	
	return (
		<Center h="auto" bg={"#f4f4f4"} py={10}>
			<Box
				w="85%"
				bg="white"
				boxShadow="xl"
				rounded="xl"
				p={3}
				gridGap={4}
				gridTemplateColumns="1fr 1fr"
			>
				<form action="/api/register-clinic" method="post" onSubmit={handleSubmit(onSubmit)}
				      encType="multipart/form-data">
					<Flex>
						<Box my={7} mx={5} w="full">
							<Text fontSize="xl" fontWeight="bold">
								{steps[activeStep].title}
							</Text>
						</Box>
					</Flex>
					{steps[activeStep].component}
					<Stepper index={activeStep}>
						{steps.map((step, index) => (
							<Step key={index}>
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
					<Flex>
						<Box my={7} mx={5} w="full">
							<Button
								type="button"
								onClick={() => setActiveStep(activeStep - 1)}
								disabled={activeStep === 0}
							>
								Back
							</Button>
							<Button
								type="button"
								onClick={onNext}
								disabled={activeStep === steps.length - 1}
							>
								Next
							</Button>
						</Box>
					</Flex>
				</form>
			</Box>
		</Center>
	);
}

export default ClinicRegistry;
