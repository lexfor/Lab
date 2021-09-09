const socket = new WebSocket('ws://localhost:8080');

async function getSelectedResolution() {
  const textarea = document.getElementById('resolution');
  const response = await fetch(`/patient/${window.sessionStorage.getItem('patient')}/resolution`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${window.sessionStorage.getItem('jwt')}`,
    },
  });
  if (response.ok) {
    const json = await response.json();
    textarea.value = json.value;
  } else {
    textarea.value = 'N/A';
  }
}

async function getCurrent() {
  const response = await fetch('/queue/current');
  const result = await response.json();
  if (response.ok) {
    document.getElementById('currentNumber').innerHTML = result.name;
  } else {
    document.getElementById('currentNumber').innerHTML = 'N/A';
  }
  await getSelectedResolution();
}

async function Add() {
  await fetch(`/queue/patient/${window.sessionStorage.getItem('patient')}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${window.sessionStorage.getItem('jwt')}`,
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
