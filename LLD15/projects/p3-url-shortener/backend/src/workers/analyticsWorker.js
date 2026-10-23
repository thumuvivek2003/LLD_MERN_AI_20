import { Worker } from "bullmq";
import redisClient from "../config/redisClient.js";

import { recordClick } from "../services/ClickService.js";
import { recordClick } from "../";
import { incrementClicks } from "../repositories/URLRepository.js";


const analyticsWorker = new Worker(
  "analyticsQueue",

  async (job) => {

    console.log('Doinog by worker',job.data)
    const { shortCode, ipAddress, userAgent } = job.data;

    await recordClick({
      shortCode,
      ipAddress,
      userAgent
    });
    await incrementClicks(shortCode)

  },

  {
    connection: redisClient
  }
);

analyticsWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

analyticsWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed`, err);
});

export default analyticsWorker;