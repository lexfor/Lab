async function getCurrent() {
  const response = await fetch('/get_current');
  const result = await response.json();
  console.log(result);
  document.getElementById('currentNumber').innerHTML = result;
}

async function next() {
  await fetch('/doctor/next',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify("next"),
  });
  await getCurrent();
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
  await fetch('/doctor/delete_resolution', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(input.value),
  });
  const output = document.getElementById('resolutionOutput');
  output.value = "N/A";
}

getCurrent();
