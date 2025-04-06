document.getElementById('patientRegistrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Get all form data
    const formData = new FormData(this);
    const patientData = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('php/register-patient.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            this.reset(); // Reset form on success
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        } else {
            throw new Error(result.message || 'Registration failed');
        }
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Hide error message after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
});
