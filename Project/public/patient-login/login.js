async function logIn() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const body = {
    login: emailInput.value,
    password: passwordInput.value,
  };

  const response = await fetch('/patient/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(body),
  });

  const res = await response.json();

  if (response.ok) {
    window.sessionStorage.setItem('jwt', res.jwt);
    document.location.href = '/queue';
  }
}
