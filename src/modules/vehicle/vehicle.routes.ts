import express from "express";
import { vehicleController } from "./vehicle.controller";

const router = express.Router();

router.post('/vehicles', vehicleController.createVehicle);
router.get('/vehicles', vehicleController.getVehicles);
router.get('/vehicles/:vehicleId', vehicleController.getVehicle);
router.put('/vehicles/:vehicleId', vehicleController.updateVehicles);
router.delete('/vehicles/:vehicleId', vehicleController.deleteVehicle);


export const vehicleRoutes = router;