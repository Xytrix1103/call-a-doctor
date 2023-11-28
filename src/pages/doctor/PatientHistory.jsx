import React, { useState, useEffect } from 'react';

const PatientHistory = ({ doctorId }) => {
  const [patientHistory, setPatientHistory] = useState([]);

  useEffect(() => {
    // Fetch patient's history data for a specific doctor from an API or database
    // and update the state variable
    const fetchPatientHistory = async () => {
      try {
        const response = await fetch(`/api/doctor/${doctorId}/patient/history`);
        const data = await response.json();
        setPatientHistory(data);
      } catch (error) {
        console.error('Error fetching patient history:', error);
      }
    };

    fetchPatientHistory();
  }, [doctorId]);

  
  return (
    <div>
      <h1>Patient History</h1>
      {/* Render the patient's history data */}
      {patientHistory.map((historyItem) => (
        <div key={historyItem.id}>
          <p>Date: {historyItem.date}</p>
          <p>Diagnosis: {historyItem.diagnosis}</p>
          <p>Treatment: {historyItem.treatment}</p>
          <p>Prescription: {historyItem.prescription}</p>
        </div>
      ))}
    </div>
  );
};

export default PatientHistory;