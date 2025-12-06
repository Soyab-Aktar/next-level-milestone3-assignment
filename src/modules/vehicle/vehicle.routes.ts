import express from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post('/vehicles', auth("admin"), vehicleController.createVehicle);
router.get('/vehicles', vehicleController.getVehicles);
router.get('/vehicles/:vehicleId', vehicleController.getVehicle);
router.put('/vehicles/:vehicleId', auth("admin"), vehicleController.updateVehicles);
router.delete('/vehicles/:vehicleId', auth("admin"), vehicleController.deleteVehicle);


export const vehicleRoutes = router;