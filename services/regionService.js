// region.service.ts

import { RegionRepository } from "../repository/regionRepo.js";

const repo = new RegionRepository();

export class RegionService {

  async createRegion(data) {

    const existing = await repo.findByName(data.name);

    if (existing) {
      throw new Error("Region already exists");
    }

    return repo.create(data);
  }

  async getRegions() {
    return repo.findAll();
  }
  async updateRegion(id, data) {

    const region = await repo.findById(id);

    if (!region) {
      throw new Error("Region not found");
    }

    return repo.update(id, data);
  }

  async deleteRegion(id) {

    const region = await repo.findById(id);

    if (!region) {
      throw new Error("Region not found");
    }

    return repo.delete(id);
  }

}