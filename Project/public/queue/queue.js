const doctorsType = document.getElementById('doctorsType');
const doctorsNames = document.getElementById('doctorsNames');
const doctorTypesInput = document.getElementById('doctorTypesInput');
const doctorNamesInput = document.getElementById('doctorNamesInput');
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

async function refreshTableContent() {
  const getResolutions = await fetch('/patient/me/resolutions', {
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
      let id = 1;

      tableContent.forEach((element) => {
        const tr = document.createElement('tr');

        addTD(id, tr);
        addTD(element.doctor_specialization, tr);
        addTD(element.doctor_name, tr);
        addTD(element.value, tr);
        addTD(new Date(+element.createdTime).toISOString().substr(0, 10), tr);
        id += 1;

        table.appendChild(tr);
      });
    }
  }
}

async function getCurrent() {
  const doctorNameValue = doctorNamesInput.value;
  const { doctorID } = document.getElementById(doctorNameValue);
  if (doctorID) {
    const response = await fetch(`/queue/${doctorID}/current`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${window.sessionStorage.getItem('jwt')}`,
      },
    });
    const result = await response.json();

    if (response.ok) {
      document.getElementById('currentNumber').innerHTML = result.name;
    } else {
      document.getElementById('currentNumber').innerHTML = 'N/A';
    }
  }
}

async function Add() {
  const doctorNameValue = doctorNamesInput.value;
  const ID = document.getElementById(doctorNameValue).doctorID;
  const response = await fetch(`/queue/${ID}/patient/me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${window.sessionStorage.getItem('jwt')}`,
    },
  });

  if (response.ok) {
    await getCurrent();
  }
}

async function getAllDoctorsBySpecializations() {
  const ID = doctorTypesInput.value;
  const doctorsTypeID = document.getElementById(ID).specializationID;
  const response = await fetch(`/doctor/specialization/${doctorsTypeID}`);

  if (response.ok) {
    const json = await response.json();

    doctorsNames.innerHTML = '';

    json.forEach((element) => {
      const option = document.createElement('option');
      option.value = element.first_name;
      option.id = element.first_name;
      option.label = element.email;
      option.doctorID = element.id;

      doctorsNames.appendChild(option);
    });
  }
}

window.onload = async () => {
  const response = await fetch('/doctor/specializations');

  if (response.ok) {
    const json = await response.json();

    doctorsType.innerHTML = '';

    json.forEach((element) => {
      const option = document.createElement('option');
      option.value = element.name;
      option.id = element.name;
      option.specializationID = element.id;

      doctorsType.appendChild(option);
    });
  }
};
