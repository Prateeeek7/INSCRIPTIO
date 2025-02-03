
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('signupForm');
            const aadhaarInput = document.getElementById('aadhaar');
            const verifyAadhaarBtn = document.getElementById('verifyAadhaar');
            const otpSection = document.getElementById('otpSection');
            const verifyOTPBtn = document.getElementById('verifyOTP');
            const submitBtn = document.querySelector('.signup-button');

            // Format Aadhaar number
            aadhaarInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
                }
                e.target.value = value;
            });

            // Verify Aadhaar
            verifyAadhaarBtn.addEventListener('click', () => {
                const aadhaar = aadhaarInput.value.replace(/\s/g, '');
                if (aadhaar.length === 12) {
                    otpSection.style.display = 'block';
                    startTimer();
                } else {
                    alert('Please enter valid 12-digit Aadhaar number');
                }
            });

            // Start OTP timer
            function startTimer() {
                let timeLeft = 30;
                const timerElement = document.getElementById('timer');
                const timer = setInterval(() => {
                    timeLeft--;
                    timerElement.textContent = timeLeft;
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        timerElement.parentElement.innerHTML = 
                            '<button class="verify-button" onclick="startTimer()">Resend OTP</button>';
                    }
                }, 1000);
            }

            // Verify OTP
            verifyOTPBtn.addEventListener('click', () => {
                const otp = document.getElementById('otp').value;
                if (otp.length === 6) {
                    submitBtn.disabled = false;
                    alert('OTP verified successfully!');
                } else {
                    alert('Please enter valid 6-digit OTP');
                }
            });

            // Form submission
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (password !== confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                }

                // Add your form submission logic here
                console.log('Form submitted successfully!');
            });
        });
        document.getElementById('verifyAadhaar').addEventListener('click', async () => {
    const aadhaar = document.getElementById('aadhaar').value;
    const statusDiv = document.getElementById('aadhaarStatus');
    
    if (!/^\d{4}\s\d{4}\s\d{4}$/.test(aadhaar)) {
        statusDiv.textContent = 'Please enter valid Aadhaar number';
        return;
    }

    statusDiv.textContent = 'Verifying...';
    const result = await verifyAadhaar(aadhaar);
    
    if (result.success) {
        statusDiv.textContent = 'Aadhaar verified successfully!';
        document.getElementById('otpSection').style.display = 'block';
    } else {
        statusDiv.textContent = 'Verification failed. Please try again.';
    }
});
 