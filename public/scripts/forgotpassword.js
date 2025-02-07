function resetPassword() {
  const emailInput = document.querySelector('.email-input');
  const emailError = document.querySelector('.email-error');

  emailError.textContent = '';

  if (!emailInput.value.includes('@')) {
      emailError.textContent = 'Please enter a valid email address.';
      return;
  }

  // Simulate sending a reset email
  alert('Password reset link has been sent to ' + emailInput.value);
  emailInput.value = ''; // Clear input
}
