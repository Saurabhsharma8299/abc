// Check if user is logged in
function checkAuth() {
    const patientInfo = sessionStorage.getItem('patientInfo');
    if (!patientInfo) {
        window.location.href = 'patient-login.html';
        return null;
    }
    return JSON.parse(patientInfo);
}

// Initialize dashboard
async function initializeDashboard() {
    const patient = checkAuth();
    if (!patient) return;

    // Set patient name and ID
    document.getElementById('patientName').textContent = `${patient.first_name} ${patient.last_name}`;
    document.getElementById('patientId').textContent = patient.id;

    // Load initial data
    await Promise.all([
        loadNextAppointment(),
        loadAppointments(),
        loadMedicalHistory(),
        loadProfile()
    ]);
}

// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Load next appointment
async function loadNextAppointment() {
    try {
        const response = await fetch('php/get-next-appointment.php');
        const data = await response.json();
        
        if (data.success && data.appointment) {
            document.getElementById('nextAppointment').innerHTML = `
                <p><strong>Date:</strong> ${data.appointment.date}</p>
                <p><strong>Time:</strong> ${data.appointment.time}</p>
                <p><strong>Doctor:</strong> ${data.appointment.doctor}</p>
                <p><strong>Department:</strong> ${data.appointment.department}</p>
            `;
        } else {
            document.getElementById('nextAppointment').innerHTML = 'No upcoming appointments';
        }
    } catch (error) {
        document.getElementById('nextAppointment').innerHTML = 'Error loading appointment';
    }
}

// Load all appointments
async function loadAppointments() {
    try {
        const response = await fetch('php/get-appointments.php');
        const data = await response.json();
        
        if (data.success && data.appointments.length > 0) {
            const appointmentsList = document.getElementById('appointmentsList');
            appointmentsList.innerHTML = data.appointments.map(apt => `
                <li class="appointment-item">
                    <p><strong>Date:</strong> ${apt.date}</p>
                    <p><strong>Time:</strong> ${apt.time}</p>
                    <p><strong>Doctor:</strong> ${apt.doctor}</p>
                    <p><strong>Department:</strong> ${apt.department}</p>
                    <p><strong>Status:</strong> <span class="status-${apt.status.toLowerCase()}">${apt.status}</span></p>
                </li>
            `).join('');
        } else {
            document.getElementById('appointmentsList').innerHTML = 'No appointments found';
        }
    } catch (error) {
        document.getElementById('appointmentsList').innerHTML = 'Error loading appointments';
    }
}

// Load medical history
async function loadMedicalHistory() {
    try {
        const response = await fetch('php/get-medical-history.php');
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('medicalHistory').innerHTML = `
                <p><strong>Blood Group:</strong> ${data.history.blood_group}</p>
                <p><strong>Allergies:</strong> ${data.history.allergies || 'None'}</p>
                <p><strong>Current Medications:</strong> ${data.history.medications || 'None'}</p>
                <h4>Past Visits</h4>
                ${data.history.visits.map(visit => `
                    <div class="visit-record">
                        <p><strong>Date:</strong> ${visit.date}</p>
                        <p><strong>Diagnosis:</strong> ${visit.diagnosis}</p>
                        <p><strong>Treatment:</strong> ${visit.treatment}</p>
                    </div>
                `).join('')}
            `;
        } else {
            document.getElementById('medicalHistory').innerHTML = 'No medical history available';
        }
    } catch (error) {
        document.getElementById('medicalHistory').innerHTML = 'Error loading medical history';
    }
}

// Load profile information
async function loadProfile() {
    const patient = checkAuth();
    if (!patient) return;

    document.getElementById('profileInfo').innerHTML = `
        <p><strong>Name:</strong> ${patient.first_name} ${patient.last_name}</p>
        <p><strong>Date of Birth:</strong> ${patient.dob}</p>
        <p><strong>Gender:</strong> ${patient.gender}</p>
        <p><strong>Phone:</strong> ${patient.phone}</p>
        <p><strong>Email:</strong> ${patient.email || 'Not provided'}</p>
        <p><strong>Address:</strong> ${patient.address}</p>
        <p><strong>City:</strong> ${patient.city}</p>
        <p><strong>PIN Code:</strong> ${patient.pincode}</p>
        <h4>Emergency Contact</h4>
        <p><strong>Name:</strong> ${patient.emergency_name}</p>
        <p><strong>Phone:</strong> ${patient.emergency_phone}</p>
        <p><strong>Relationship:</strong> ${patient.emergency_relation}</p>
    `;
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('patientInfo');
    window.location.href = 'patient-login.html';
});

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', initializeDashboard);
