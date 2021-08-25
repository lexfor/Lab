import QueueController from './api/controllers/queueController.js';
import PatientController from './api/controllers/patientController.js';
import PatientService from './api/service/PatientService.js';
import QueueService from './api/service/QueueService.js';

import { queueMemoryRepository } from './api/repositories/queue.repositories/queueMemory.js';
import { patientMemoryRepository } from './api/repositories/patient.repositories/patientMemory.js';
import { resolutionMemoryRepository } from './api/repositories/resolution.repositories/resolutionMemory.js';
import { queueRedisRepository } from './api/repositories/queue.repositories/queueRedis.js';
import { patientRedisRepository } from './api/repositories/patient.repositories/patientRedis.js';
import { resolutionRedisRepository } from './api/repositories/resolution.repositories/resolutionRedis.js';
import { patientSQLRepository } from './api/repositories/patient.repositories/patientSQL.js';
import { resolutionSQLRepository } from './api/repositories/resolution.repositories/resolutionSQL.js';

import { envConfig } from './config.js';

class Injector {
  constructor() {
    switch (envConfig.storage.name) {
      case 'redis':
        console.log('using redis');
        this.patientStorage = patientRedisRepository;
        this.resolutionStorage = resolutionRedisRepository;
        break;
      case 'sql':
        console.log('using SQL');
        this.patientStorage = patientSQLRepository;
        this.resolutionStorage = resolutionSQLRepository;
        break;
      default:
        console.log('using memory');
        this.patientStorage = patientMemoryRepository;
        this.resolutionStorage = resolutionMemoryRepository;
    }
    switch (envConfig.queueStorage.name) {
      case 'redis':
        console.log('using redis for queue');
        this.queueStorage = queueRedisRepository;
        break;
      default:
        console.log('using memory for queue');
        this.queueStorage = queueMemoryRepository;
        break;
    }
    this.patientService = new PatientService(this.patientStorage, this.resolutionStorage);
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
