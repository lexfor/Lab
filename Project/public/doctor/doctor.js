const ws = new WebSocket('ws://localhost:8080');
let foundedPatientID = null;

const searchInput = document.getElementById('searchInput');
const search = document.getElementById('search');
const table = document.getElementById('table');

function addTD(key, tr) {
  const td = document.createElement('td');
  if (key) {
    td.innerText = key;
  } else {
    td.innerText = '---';
  }
  tr.appendChild(td);
}

async function onInput() {
  const searchInputValue = searchInput.value;
  const response = await fetch(`/patients?patientInfo=${searchInputValue}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${window.sessionStorage.getItem('jwt')}`,
    },
  });

  if (response.ok) {
    const json = await response.json();
    search.innerHTML = '';

    json.forEach((element) => {
      const option = document.createElement('option');
      option.value = element.name;
      option.label = element.mail;
      option.id = element.name;
      option.patient_id = element.id;

      search.appendChild(option);
    });
  } else {
    alert('Somthing went wrong');
  }
}

async function deleteButton(event) {
  const response = await fetch(`/resolution/${event.target.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });

  if (response.ok) {
    Array.from(table.children).forEach((item) => {
      const tds = Array.from(item.children);
      const lastTD = tds[tds.length - 1];
      const button = lastTD.children[0];
      if (button.id === event.target.id) {
        item.innerHTML = '';
      }
    });
  }
}

async function refreshTableContent(patient_id) {
  const getResolutions = await fetch(`/patient/${patient_id}/resolutions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${window.sessionStorage.getItem('jwt')}`,
    },
  });

  if (getResolutions.ok) {
    const tableContent = await getResolutions.json();

    if (tableContent) {
      table.innerHTML = '';
      let id = 0;

      tableContent.forEach((element) => {
        const tr = document.createElement('tr');
        id += 1;

        addTD(id, tr);
        addTD(element.doctor_specialization, tr);
        addTD(element.doctor_name, tr);
        addTD(element.value, tr);
        addTD(new Date(+element.updatedTime).toISOString().substr(0, 10), tr);

        const td = document.createElement('td');
        const button = document.createElement('button');

        button.innerText = 'DELETE';
        button.style.alignSelf = 'center';
        button.id = element.id;

        button.addEventListener('click', deleteButton);

        td.appendChild(button);
        tr.appendChild(td);

        table.appendChild(tr);
      });
    }
  }
}

async function onChange() {
  const searchInputValue = searchInput.value;
  const option = document.getElementById(searchInputValue);
  const { patient_id } = option;

  if (patient_id) {
    refreshTableContent(patient_id);
  } else {
    alert('Somthing went wrong');
  }
}

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
