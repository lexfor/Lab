import redis from 'redis';
import QueueController from './api/controllers/queueController.js';
import PatientController from './api/controllers/patientController.js';
import PatientService from './api/service/PatientService.js';
import QueueService from './api/service/QueueService.js';
import QueueRedis from './api/repositories/queue.repositories/queueRedis.js';
import PatientRedis from './api/repositories/patient.repositories/patientRedis.js';
import ResolutionRedis from './api/repositories/resolution.repositories/resolutionRedis.js';
import PatientSQL from './api/repositories/patient.repositories/patientSQL.js';
import ResolutionSQL from './api/repositories/resolution.repositories/resolutionSQL.js';
import { initializeDB } from './DBInitializator.js';

import { queueMemoryRepository } from './api/repositories/queue.repositories/queueMemory.js';
import { patientMemoryRepository } from './api/repositories/patient.repositories/patientMemory.js';
import { resolutionMemoryRepository } from './api/repositories/resolution.repositories/resolutionMemory.js';

import { envConfig } from './config.js';

let client;

class Injector {
  constructor() {
    switch (envConfig.storage.name) {
      case 'redis':
        console.log('using redis');
        client = redis.createClient({
          host: envConfig.storage.host,
          port: envConfig.storage.port,
        });
        client.flushdb();
        this.patientRepository = new PatientRedis(client);
        this.resolutionRepository = new ResolutionRedis(client);
        break;
      case 'sql':
        console.log('using SQL');
        initializeDB().then(console.log('Database initialized'));
        this.patientRepository = new PatientSQL();
        this.resolutionRepository = new ResolutionSQL();
        break;
      default:
        console.log('using memory');
        this.patientRepository = patientMemoryRepository;
        this.resolutionRepository = resolutionMemoryRepository;
    }
    switch (envConfig.queueStorage.name) {
      case 'redis':
        console.log('using redis for queue');
        client = redis.createClient({
          host: envConfig.queueStorage.host,
          port: envConfig.queueStorage.port,
        });
        client.flushdb();
        this.queueRepository = new QueueRedis(client);
        break;
      default:
        console.log('using memory for queue');
        this.queueRepository = queueMemoryRepository;
        break;
    }
    this.patientService = new PatientService(
      this.patientRepository,
      this.resolutionRepository,
      this.queueRepository,
    );
    this.queueService = new QueueService(this.queueRepository, this.patientRepository);
    this.queueController = new QueueController(this.queueService);
    this.resolutionController = new PatientController(this.queueService, this.patientService);
  }

  get getQueueController() {
    return this.queueController;
  }

  get getResolutionController() {
    return this.resolutionController;
  }
}

const injector = new Injector();
export { injector };
