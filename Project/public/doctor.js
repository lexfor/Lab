async function next() {
  const response = await fetch('/doctor/next');
  const result = await response.json();
  if (!result) {
    alert('Wait for new patient');
  }
  await getCurrent();
}

async function getCurrent() {
  const response = await fetch('/get_current');
  document.getElementById('currentNumber').innerHTML = await response.json();
}

async function setCurrentResolution() {
  const resolution = document.getElementById('resolutionText');
  const response = await fetch('/doctor/set_resolution', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(resolution.value),
  });
  await response.json();
}

async function findResolution() {
  const input = document.getElementById('valueInput');
  const response = await fetch('/get_resolution', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(input.value),
  });
  const resolution = await response.json();
  const output = document.getElementById('resolutionOutput');
  output.value = resolution;
}

async function deleteResolution() {
  const input = document.getElementById('valueInput');
  const response = await fetch('/doctor/delete_resolution', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(input.value),
  });
  const resolution = await response.json();
  const output = document.getElementById('resolutionOutput');
  output.value = resolution;
}

getCurrent();
