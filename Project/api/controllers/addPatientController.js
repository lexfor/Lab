import fs from 'fs';
import Queue from '../Queue.js';

export default function addPatient(value) {
  let queue;
  try {
    const data = fs.readFileSync('queue.json', 'utf8');
    const result = JSON.parse(data);
    queue = new Queue();
    queue.copy(result);
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`);
    queue = new Queue();
  }
  queue.push(value, 'N/A');
  try {
    const data = JSON.stringify(queue);
    fs.writeFileSync('queue.json', data, 'utf8');
    console.log('File is written successfully!');
  } catch (err) {
    console.log(`Error writing file: ${err}`);
  }
}
