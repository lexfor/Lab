const ws = new WebSocket('ws://localhost:8080');

async function getCurrent() {
  const response = await fetch('/doctor/patient/current');
  const result = await response.json();
  document.getElementById('currentNumber').innerHTML = result.name;
  ws.send(result.name);
  window.sessionStorage.setItem('current', result.id);
}

async function next() {
  await fetch('/doctor/patient/next');
  await getCurrent();
}

async function setCurrentResolution() {
  const resolution = document.getElementById('resolutionText');
  const body = {
    value: resolution.value,
    id: window.sessionStorage.getItem('current'),
  };
  const response = await fetch('/doctor/patient/current/resolution', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(body),
  });
  await response.json();
  ws.send(resolution.value);
}

async function findResolution() {
  const input = document.getElementById('valueInput');
  const url = new URL('/doctor/patient/resolution', document.location.origin);
  const params = new URLSearchParams();
  params.append('name', input.value);
  url.search = params.toString();
  const response = await fetch(url.href);
  const resolution = await response.json();
  const output = document.getElementById('resolutionOutput');
  output.value = resolution.value;
  window.sessionStorage.setItem('foundedPatient', resolution.patient_id);
}

async function deleteResolution() {
  const url = new URL('/doctor/patient/resolution', document.location.origin);
  const params = new URLSearchParams();
  params.append('patient_id', window.sessionStorage.getItem('foundedPatient'));
  url.search = params.toString();
  await fetch(url.href, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  const output = document.getElementById('resolutionOutput');
  output.value = 'N/A';
}

getCurrent();
