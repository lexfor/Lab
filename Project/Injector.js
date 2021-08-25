import redis from 'redis';
import QueueController from './api/controllers/queueController.js';
import PatientController from './api/controllers/patientController.js';
import PatientService from './api/service/PatientService.js';
import QueueService from './api/service/QueueService.js';
import ResolutionService from './api/service/ResolutionService.js';
import QueueRedis from './api/repositories/queue.repositories/queueRedis.js';
import PatientRedis from './api/repositories/patient.repositories/patientRedis.js';
import ResolutionRedis from './api/repositories/resolution.repositories/resolutionRedis.js';
import PatientSQL from './api/repositories/patient.repositories/patientSQL.js';
import ResolutionSQL from './api/repositories/resolution.repositories/resolutionSQL.js';
import { sequelize } from './modelInitializator.js';

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
        this.patientStorage = new PatientRedis(client);
        this.resolutionStorage = new ResolutionRedis(client);
        break;
      case 'sql':
        console.log('using SQL');
        this.patientStorage = new PatientSQL(sequelize.models.patient);
        this.resolutionStorage = new ResolutionSQL(sequelize.models.resolution);
        break;
      default:
        console.log('using memory');
        this.patientStorage = patientMemoryRepository;
        this.resolutionStorage = resolutionMemoryRepository;
    }
    switch (envConfig.queueStorage.name) {
      case 'redis':
        console.log('using redis for queue');
        client = redis.createClient({
          host: envConfig.queueStorage.host,
          port: envConfig.queueStorage.port,
        });
        client.flushdb();
        this.queueStorage = new QueueRedis(client);
        break;
      default:
        console.log('using memory for queue');
        this.queueStorage = queueMemoryRepository;
        break;
    }
    this.resolutionService = new ResolutionService(this.resolutionStorage);
    this.patientService = new PatientService(this.patientStorage, this.resolutionService);
    this.queueService = new QueueService(this.queueStorage, this.patientService);
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
