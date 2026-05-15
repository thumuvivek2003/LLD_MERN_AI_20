import { Router } from "express";
import {
  createHallRequest,
  createCabinRequest,
  getSystemSnapshot,
  controlSimulation,
  setSimulationConfig,
} from "../controller/elevator.controller.js";

export function registerElevatorRoutes(app) {
  const router = Router();
  router.post("/hall-request", createHallRequest);
  router.post("/cabin-request", createCabinRequest);
  router.get("/snapshot", getSystemSnapshot);
  router.post("/simulation/control", controlSimulation);
  router.post("/simulation/config", setSimulationConfig);
  app.use("/api/elevator", router);
}
