import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';

const AppointmentTable = ({ appointments }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    onOpen();
  };

  return (
    <>
      <Table variant="simple">
        <TableCaption placement="top">List of Appointments</TableCaption>
        <Thead>
          <Tr>
            <Th>Patient Name</Th>
            <Th>Date</Th>
            <Th>Time</Th>
            <Th>Appointment Type</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {appointments.map((appointment) => (
            <Tr key={appointment.id}>
              <Td>{appointment.patientName}</Td>
              <Td>{appointment.date}</Td>
              <Td>{appointment.time}</Td>
              <Td>{appointment.appointmentType}</Td>
              <Td>
                <Button onClick={() => handleViewDetails(appointment)} colorScheme="blue" size="sm">
                  View Details
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* View Appointment Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Appointment Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedAppointment && (
              <div>
                <p>Patient Name: {selectedAppointment.patientName}</p>
                <p>Date: {selectedAppointment.date}</p>
                <p>Time: {selectedAppointment.time}</p>
                <p>Appointment Type: {selectedAppointment.appointmentType}</p>
                {/* Add more details as needed */}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AppointmentTable;
