import fs from 'fs';
import Clinic from '../Clinic.js';

export default function setResolution(value) {
  const clinic = new Clinic();
  try {
    const data = fs.readFileSync('queue.json', 'utf8');
    const result = JSON.parse(data);
    clinic.copy(result);
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`);
  }
  clinic.setCurrentResolution(value);
  try {
    const data = JSON.stringify(clinic);
    fs.writeFileSync('queue.json', data, 'utf8');
    console.log('File is written successfully!');
  } catch (err) {
    console.log(`Error writing file: ${err}`);
  }
}
