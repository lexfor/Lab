async function getAllValue() {
  let response = await fetch('/get_all_value');
  response = await response.json();

  const select = document.getElementById('valueSelect');
  select.options.length = 0;
  select.append(new Option('Выберите', 'Выберите'));
  response.forEach((item) => {
    const option = new Option(item, item);
    select.append(option);
  });
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

async function Add() {
  const inputValue = document.getElementById('inputValue');
  const response = await CreatePostRequest('/add_patient', inputValue.value);
  await response.json();
  await getAllValue();
}

async function getCurrent() {
  const response = await fetch('/get_current');
  document.getElementById('currentNumber').innerHTML = await response.json();
}

async function getSelectedResolution() {
  const select = document.getElementById('valueSelect');
  let response = await CreatePostRequest('/get_resolution', select.value);
  response = await response.json();
  const textarea = document.getElementById('resolution');
  textarea.value = response;
}

getAllValue();
setInterval(getCurrent, 3000);
