import zxcvbn from 'zxcvbn';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    const passwordInput = document.getElementById('motDePasse');
    const passwordError = document.getElementById('passwordError');
    const submitButton = document.getElementById('submitBtn');

    form.addEventListener('submit', function(event) {
        const password = passwordInput.value;
        const passwordStrength = zxcvbn(password);

        if (passwordStrength.score < 3) {
            event.preventDefault(); // Prevent form submission
            passwordError.innerText = 'Mot de passe trop faible.';

        }
    });

    passwordInput.addEventListener('input', function() {
        passwordError.innerText = '';
        submitButton.disabled = false;
    });
});
