import QueueController from './api/controllers/queueController.js';
import ResolutionController from './api/controllers/resolutionController.js';
import PatientService from './api/service/PatientService.js';
import QueueService from './api/service/QueueService.js';

import { queueInMemoryStorage } from './api/repositories/queueStorage.js';
import { patientInMemoryStorage } from './api/repositories/patientStorage.js';
import { resolutionInMemoryStorage } from './api/repositories/resolutionStorage.js';
import { queueInRedisStorage } from './api/repositories/queueRedis.js';
import { patientInRedisStorage } from './api/repositories/patientRedis.js';
import { resolutionInRedisStorage } from './api/repositories/resolutionRedis.js';
import { queueInSQL } from './api/repositories/queueSQL.js';
import { patientInSQL } from './api/repositories/patientSQL.js';
import { resolutionInSQL } from './api/repositories/resolutionSQL.js';

import { envConfig } from './config.js';

class Injector {
  constructor() {
    switch (envConfig.storage.name) {
      case 'redis':
        console.log('using redis');
        this.queueStorage = queueInRedisStorage;
        this.patientStorage = patientInRedisStorage;
        this.resolutionStorage = resolutionInRedisStorage;
        break;
      case 'sql':
        console.log('using SQL');
        this.queueStorage = queueInSQL;
        this.patientStorage = patientInSQL;
        this.resolutionStorage = resolutionInSQL;
        break;
      default:
        console.log('using memory');
        this.queueStorage = queueInMemoryStorage;
        this.patientStorage = patientInMemoryStorage;
        this.resolutionStorage = resolutionInMemoryStorage;
    }
    this.patientService = new PatientService(this.patientStorage, this.resolutionStorage);
    this.queueService = new QueueService(this.queueStorage, this.patientService);
    this.queueController = new QueueController(this.queueService);
    this.resolutionController = new ResolutionController(this.queueService, this.patientService);
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
