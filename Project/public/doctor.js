async function getCurrent() {
  const response = await fetch('/get_current');
  document.getElementById('currentNumber').innerHTML = await response.json();
}

async function CreatePostRequest(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(body),
  });
}

async function next() {
  await CreatePostRequest('/doctor/next', '');
  await getCurrent();
}

async function setCurrentResolution() {
  const resolution = document.getElementById('resolutionText');
  const body = {};
  body.value = resolution.value;
  const response = await CreatePostRequest('/doctor/set_resolution', body);
  await response.json();
}

async function findResolution() {
  const input = document.getElementById('valueInput');
  const response = await CreatePostRequest('/get_resolution', input.value);
  const resolution = await response.json();
  const output = document.getElementById('resolutionOutput');
  output.value = resolution;
}

async function deleteResolution() {
  const input = document.getElementById('valueInput');
  await CreatePostRequest('/doctor/delete_resolution', input.value);
  const output = document.getElementById('resolutionOutput');
  output.value = 'N/A';
}

getCurrent();
