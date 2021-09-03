const socket = new WebSocket('ws://localhost:8080');

async function getSelectedResolution() {
  const response = await fetch('/queue/patient/resolution', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${window.sessionStorage.getItem('patient')}`,
    },
  });
  const json = await response.json();
  const textarea = document.getElementById('resolution');
  textarea.value = json.value;
}

async function getCurrent() {
  const response = await fetch('/queue/patient/current');
  const result = await response.json();
  document.getElementById('currentNumber').innerHTML = result.name;
  await getSelectedResolution();
}

async function Add() {
  await fetch('/queue/patient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${window.sessionStorage.getItem('patient')}`,
    },
    body: JSON.stringify({}),
  });
  await getCurrent();
}

window.onload = () => {
  if (!window.sessionStorage.getItem('patient')) {
    document.location.href = '/login';
  }
};

getCurrent();

socket.addEventListener('message', () => {
  getCurrent();
});
