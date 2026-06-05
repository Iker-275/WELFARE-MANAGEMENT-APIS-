import { Queue } from "bullmq";

import {
  bullRedisConnection} from "../bullmq.js";


const importQueue = new Queue("imports", {
  connection: bullRedisConnection,
});

module.exports = importQueue;