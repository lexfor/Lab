import fs from 'fs';
import Queue from '../Queue.js';

export default function getResolution(value) {
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
  return queue.findResolution(value);
}
