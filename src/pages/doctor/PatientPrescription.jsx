import React, { useState, useEffect } from 'react';
import VideoConference from 'react-video-conference'; // Import the video conference component

const PatientPrescription = ({ patientId }) => {
  const [patientData, setPatientData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isVideoConferenceOpen, setVideoConferenceOpen] = useState(false);

  useEffect(() => {
    // Fetch patient's details from an API or database
    // and update the state variable
    const fetchPatientDetails = async () => {
      try {
        const response = await fetch(`/api/patient/${patientId}`);
        const data = await response.json();
        setPatientData(data);
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    // Fetch patient's prescriptions from an API or database
    // and update the state variable
    const fetchPatientPrescriptions = async () => {
      try {
        const response = await fetch(`/api/patient/${patientId}/prescriptions`);
        const data = await response.json();
        setPrescriptions(data);
      } catch (error) {
        console.error('Error fetching patient prescriptions:', error);
      }
    };

    fetchPatientDetails();
    fetchPatientPrescriptions();
  }, [patientId]);

  const handleOpenVideoConference = () => {
    setVideoConferenceOpen(true);
  };

  const handleCloseVideoConference = () => {
    setVideoConferenceOpen(false);
  };

  return (
    <div>
      {patientData && (
        <div>
          <h1>Patient Details</h1>
          <p>Name: {patientData.name}</p>
          <p>Age: {patientData.age}</p>
          <p>Gender: {patientData.gender}</p>
          {/* Add more patient details as needed */}
        </div>
      )}

      <h2>Prescriptions</h2>
      {prescriptions.map((prescription) => (
        <div key={prescription.id}>
          <p>Date: {prescription.date}</p>
          <p>Medication: {prescription.medication}</p>
          <p>Dosage: {prescription.dosage}</p>
          <p>Instructions: {prescription.instructions}</p>
          {/* Add more prescription details as needed */}
        </div>
      ))}

      {/* Button to Open Video Conference */}
      <button onClick={handleOpenVideoConference}>Start Video Consultation</button>

      {/* Video Conference Component */}
      {isVideoConferenceOpen && (
        <VideoConference
          onClose={handleCloseVideoConference}
          // Additional props based on the telemedicine library you use
        />
      )}
    </div>
  );
};

export default PatientPrescription;