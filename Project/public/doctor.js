async function getCurrent() {
  const response = await fetch('/doctor/patient/current');
  document.getElementById('currentNumber').innerHTML = await response.json();
}

async function next() {
  await fetch('/doctor/patient/next');
  await getCurrent();
}

async function setCurrentResolution() {
  const resolution = document.getElementById('resolutionText');
  const body = {};
  body.value = resolution.value;
  const response = await fetch('/doctor/patient/current/resolution', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(body),
  });
  await response.json();
}

async function findResolution() {
  const input = document.getElementById('valueInput');
  const response = await fetch(`/doctor/patient/${input.value}/resolution`);
  const resolution = await response.json();
  const output = document.getElementById('resolutionOutput');
  output.value = resolution;
}

async function deleteResolution() {
  const input = document.getElementById('valueInput');
  await fetch(`/doctor/patient/${input.value}/resolution`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  const output = document.getElementById('resolutionOutput');
  output.value = 'N/A';
}

getCurrent();
