// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Local Storage for demo purposes
const users = JSON.parse(localStorage.getItem('users')) || [];
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Check if user is logged in
if (currentUser && window.location.pathname.includes('login.html')) {
    window.location.href = 'patient-dashboard.html';
}

// Login Function
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'patient-dashboard.html';
        } else {
            alert('Invalid credentials');
        }
    });
}

// Registration Function
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };
        
        // Check if user already exists
        if (users.some(u => u.email === formData.email)) {
            alert('User already exists');
            return;
        }
        
        users.push(formData);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful! Please login.');
        window.location.href = 'patient-login.html';
    });
}

// Dashboard Functions
function loadDashboard() {
    if (!currentUser) {
        window.location.href = 'patient-login.html';
        return;
    }
    
    // Update user info
    document.getElementById('userName').textContent = currentUser.name;
    
    // Load appointments (demo data)
    const appointments = [
        { date: '2024-03-01', doctor: 'Dr. Smith', time: '10:00 AM' },
        { date: '2024-03-15', doctor: 'Dr. Johnson', time: '02:30 PM' }
    ];
    
    const appointmentsList = document.getElementById('appointmentsList');
    if (appointmentsList) {
        appointmentsList.innerHTML = appointments.map(app => `
            <div class="card">
                <h3>Appointment with ${app.doctor}</h3>
                <p>Date: ${app.date}</p>
                <p>Time: ${app.time}</p>
            </div>
        `).join('');
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'patient-login.html';
}

// Initialize dashboard if on dashboard page
if (window.location.pathname.includes('patient-dashboard.html')) {
    loadDashboard();
} 