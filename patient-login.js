document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const patientId = document.getElementById('patientId').value;
    const messageDiv = document.getElementById('loginMessage');
    
    try {
        const response = await fetch('php/patient-login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, patientId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Store patient info in session storage
            sessionStorage.setItem('patientInfo', JSON.stringify(result.patient));
            // Redirect to dashboard
            window.location.href = 'patient-dashboard.html';
        } else {
            messageDiv.style.display = 'block';
            messageDiv.style.backgroundColor = '#f44336';
            messageDiv.style.color = 'white';
            messageDiv.textContent = result.message;
        }
    } catch (error) {
        messageDiv.style.display = 'block';
        messageDiv.style.backgroundColor = '#f44336';
        messageDiv.style.color = 'white';
        messageDiv.textContent = 'An error occurred. Please try again.';
    }
});
