import React, { useState, useEffect } from 'react';

const PatientSchedule = ({ doctorId }) => {
  const [patientSchedules, setPatientSchedules] = useState([]);

  useEffect(() => {
    // Fetch patient schedules for a specific doctor from an API or database
    // and update the state variable
    const fetchPatientSchedules = async () => {
      try {
        const response = await fetch(`/api/doctor/${doctorId}/patient-schedules`);
        const data = await response.json();
        setPatientSchedules(data);
      } catch (error) {
        console.error('Error fetching patient schedules:', error);
      }
    };

    fetchPatientSchedules();
  }, [doctorId]);

  return (
    <div>
      <h1>Patient Schedules</h1>
      {patientSchedules.map((schedule) => (
        <div key={schedule.id}>
          <p>Patient: {schedule.patientName}</p>
          <p>Date: {schedule.date}</p>
          <p>Time: {schedule.time}</p>
          <p>Appointment Type: {schedule.appointmentType}</p>
          {/* Add more schedule details as needed */}
        </div>
      ))}
    </div>
  );
};

export default PatientSchedule;