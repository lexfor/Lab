async function register() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const nameInput = document.getElementById('name');
  const birthdayInput = document.getElementById('birthday');
  const genderInput = document.getElementById('gender');
  const reqBodyInput = {
    login: emailInput.value,
    password: passwordInput.value,
    name: nameInput.value,
    birthday: birthdayInput.value,
    gender: genderInput.value,
  };
  const response = await fetch('/registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(reqBodyInput),
  });
  if (response.ok) {
    document.location.href = '/login';
  }
}
