const ws = new WebSocket('ws://localhost:8080');
let foundedPatientID = null;

async function getCurrent() {
  const response = await fetch('/queue/current', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${window.sessionStorage.getItem('jwt')}`,
    },
  });

  if (response.ok) {
    const result = await response.json();
    document.getElementById('currentNumber').innerHTML = result.name;
    window.sessionStorage.setItem('currentPatientID', result.id);
  } else {
    document.getElementById('currentNumber').innerHTML = 'N/A';
  }
}

async function next() {
  const response = await fetch('/queue/next', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${window.sessionStorage.getItem('jwt')}`,
    },
  });

  if (response.ok) {
    const { firstName: doctorName, specializationName: doctorType } = await response.json();

    await getCurrent();
    ws.send('next');
  }
}

async function setCurrentResolution() {
  const resolution = document.getElementById('resolutionText');
  const body = {
    value: resolution.value,
  };
  const response = await fetch(`/patient/${window.sessionStorage.getItem('currentPatientID')}/resolution`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${window.sessionStorage.getItem('jwt')}`,
    },
    body: JSON.stringify(body),
  });
  await response.json();
  ws.send(resolution.value);
}

async function findResolution() {
  const input = document.getElementById('valueInput');
  const output = document.getElementById('resolutionOutput');
  const url = new URL('/patient/resolution', document.location.origin);
  const params = new URLSearchParams();
  params.append('name', input.value);
  url.search = params.toString();
  const response = await fetch(url.href);
  if (response.ok) {
    const resolution = await response.json();
    output.value = resolution.value;
    foundedPatientID = resolution.patient_id;
  } else {
    output.value = 'N/A';
  }
}

async function deleteResolution() {
  await fetch(`/resolution/${foundedPatientID}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  foundedPatientID = null;
  const output = document.getElementById('resolutionOutput');
  output.value = 'N/A';
}

getCurrent();
