import { RegionService }
from "../services/regionService.js";

const service = new RegionService();

export const createRegion =
async (req, res, next) => {

  try {

    const region =
      await service.createRegion(
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Region created successfully",
      data: region
    });

  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create region. " + error.message
    });
  }

};

export const getRegions =
async (req, res, next) => {

  try {

    const regions =
      await service.getRegions();

    return res.status(200).json({
      success: true,
      data: regions
    });

  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch regions. " + error.message
    });
  }

};

export const updateRegion =
async (req, res, next) => {

  try {

    const region =
      await service.updateRegion(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Region updated successfully",
      data: region
    });

  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update region. " + error.message
    }); 
  }

};

export const deleteRegion =
async (req, res, next) => {

  try {

    await service.deleteRegion(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Region deleted successfully"
    });

  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete region. " + error.message
     });
  }

};