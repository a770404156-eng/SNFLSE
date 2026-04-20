/* membership.js */
import { siteInfo } from './data.js';

// Initialize EmailJS with your Public Key
emailjs.init("YOUR_PUBLIC_KEY"); 

const submitBtn = document.getElementById('submitJoinBtn');
const formEl    = document.getElementById('membershipForm');
const successEl = document.getElementById('joinSuccess');

if (submitBtn) {
    submitBtn.addEventListener('click', () => {
        // Collect data
        const data = {
            first_name: document.getElementById('firstName').value.trim(),
            last_name:  document.getElementById('lastName').value.trim(),
            phone:      document.getElementById('phone').value.trim(),
            state:      document.getElementById('state').value.trim(),
            email:      document.getElementById('userEmail').value.trim()
        };

        // Basic Validation
        if (!data.first_name || !data.last_name || !data.phone || !data.state || !data.email) {
            alert("يرجى ملء جميع الخانات");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "جاري الإرسال...";

        // Send to Client's Email
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
            from_name: `${data.first_name} ${data.last_name}`,
            user_phone: data.phone,
            user_state: data.state,
            user_email: data.email,
            to_email: siteInfo.email // The client's email from data.js
        }).then(() => {
            formEl.style.display = 'none';
            successEl.classList.add('visible');
        }).catch((err) => {
            alert("فشل الإرسال، حاول مرة أخرى");
            submitBtn.disabled = false;
            submitBtn.innerText = "إرسال طلب الانضمام";
        });
    });
}