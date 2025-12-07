import { Request, Response } from "express";
import { vehiclesService } from "./vehicle.service";


const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.createVehicle(req.body);
    res.status(201).json({
      succcess: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.getVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
const getVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.getVehicle(req.params.vehicleId as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      })
    }
    else {
      res.status(200).json({
        success: true,
        message: "Vehicles retrieved successfully",
        data: result.rows[0],
      });
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const updateVehicles = async (req: Request, res: Response) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
  try {
    const result = await vehiclesService.updateVehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.vehicleId as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      })
    }
    else {
      res.status(200).json({
        success: true,
        message: "User data Updated Successfully",
        data: result.rows[0],
      });
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.deleteVehicle(req.params.vehicleId as string);

    if (!result) {
      res.status(403).json({
        success: false,
        message: "Vehicle have Active bookings, so we cant delete the user",
      })
    }
    else {
      if (result.rowCount === 0) {
        res.status(404).json({
          success: false,
          message: "Data not found",
        })
      }
      else {
        res.status(200).json({
          "success": true,
          "message": "Vehicle deleted successfully"
        });
      }
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


export const vehicleController = {
  createVehicle, getVehicles, updateVehicles, deleteVehicle, getVehicle
}