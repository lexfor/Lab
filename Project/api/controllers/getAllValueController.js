import fs from 'fs';
import Clinic from '../Clinic.js';

export default function getAllValue() {
  const clinic = new Clinic();
  try {
    const data = fs.readFileSync('queue.json', 'utf8');
    const result = JSON.parse(data);
    clinic.copy(result);
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`);
  }
  return clinic.getAllValue();
}
