import QueueController from './api/controllers/queueController.js';
import ResolutionController from './api/controllers/resolutionController.js';
import PatientsResolutionsService from './api/service/PatientsResolutionsService.js';
import QueueService from './api/service/QueueService.js';

import { queueInMemoryStorage } from './api/repositories/queueStorage.js';
import { resolutionInMemoryStorage } from './api/repositories/resolutionStorage.js';
import { queueInRedisStorage } from './api/repositories/queueRedis.js';
import { resolutionInRedisStorage } from './api/repositories/resolutionRedis.js';

import { envConfig } from './config.js';

class Injector {
  constructor() {
    switch (envConfig.storage.name) {
      case 'redis':
        this.queueStorage = queueInRedisStorage;
        this.resolutionStorage = resolutionInRedisStorage;
        break;

      default:
        this.queueStorage = queueInMemoryStorage;
        this.resolutionStorage = resolutionInMemoryStorage;
    }

    this.resolutionService = new PatientsResolutionsService(this.resolutionStorage);
    this.queueService = new QueueService(this.queueStorage);
    this.queueController = new QueueController(this.queueService, this.resolutionService);
    this.resolutionController = new ResolutionController(this.queueService, this.resolutionService);
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
