async function getAllValue() {
  let response = await fetch('/queue/patient/all');
  response = await response.json();

  const select = document.getElementById('valueSelect');
  select.options.length = 0;
  select.append(new Option('Выберите', 'Выберите'));
  response.forEach((item) => {
    const option = new Option(item, item);
    select.append(option);
  });
}

async function Add() {
  const inputValue = document.getElementById('inputValue');
  await fetch('/queue/patient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(inputValue.value),
  });
  await getAllValue();
  await getCurrent();
}

async function getCurrent() {
  const response = await fetch('/queue/patient/current');
  document.getElementById('currentNumber').innerHTML = await response.json();
}

async function getSelectedResolution() {
  const select = document.getElementById('valueSelect');
  const url = new URL('/queue/patient/resolution', document.location.origin);
  const params = new URLSearchParams();
  params.append('value', select.value);
  url.search = params.toString();
  const response = await fetch(url.href);
  const json = await response.json();
  const textarea = document.getElementById('resolution');
  textarea.value = json;
}

getCurrent();
getAllValue();
setInterval(getCurrent, 3000);
