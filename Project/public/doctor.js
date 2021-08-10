async function getCurrent() {
  const response = await fetch('/current');
  document.getElementById('currentNumber').innerHTML = await response.json();
}

async function next() {
  await fetch('/doctor/next');
  await getCurrent();
}

async function setCurrentResolution() {
  const resolution = document.getElementById('resolutionText');
  const body = {};
  body.value = resolution.value;
  const response = await fetch('/doctor/set-resolution', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(body),
  });
  await response.json();
}

async function findResolution() {
  const input = document.getElementById('valueInput');
  let url = new URL('/resolution', document.location.origin);
  let params = new URLSearchParams();
  params.append("value", input.value);
  url.search = params.toString();
  const response = await fetch(url.href);
  const resolution = await response.json();
  const output = document.getElementById('resolutionOutput');
  output.value = resolution;
}

async function deleteResolution() {
  const input = document.getElementById('valueInput');
  let url = new URL('/doctor/resolution', document.location.origin);
  let params = new URLSearchParams();
  params.append("value", input.value);
  url.search = params.toString();
  await fetch(url.href, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    }
  });
  const output = document.getElementById('resolutionOutput');
  output.value = 'N/A';
}

getCurrent();
