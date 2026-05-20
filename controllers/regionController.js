// region.controller.ts

import { RegionService } from "../services/regionService.js";

const service = new RegionService();

export const createRegion = async (req, res) => {

  try {

    const region = await service.createRegion(req.body);

    res.status(201).json({
      success: true,
      region
    });

  } catch (e) {

    res.status(400).json({
      success: false,
      error: e.message
    });

  }

};

export const getRegions = async (_req, res) => {

  const regions = await service.getRegions();

  res.json({
    success: true,
    regions
  });

};

export const updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const region = await service.updateRegion(id, data);

    res.json({
      success: true,
      region
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      error: e.message
    });
  }
};

export const deleteRegion    = async (req, res) => {
  try {
    const { id } = req.params;  
    await service.deleteRegion(id);

    res.json({  
        success: true,
        message: "Region deleted successfully"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
        error: e.message
    });
  } 
}
