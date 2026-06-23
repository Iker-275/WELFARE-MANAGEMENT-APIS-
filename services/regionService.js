import { RegionRepository } from "../repository/regionRepo.js";

import { RedisService }
from "./redis/redisService.js";

import {
  DEFAULT_REGION_NAME,
  REGION_CACHE_KEY,
  REGION_CACHE_TTL
} from "../config/regionConstants.js";

const repo = new RegionRepository();

export class RegionService {

  async createRegion(data) {

    const existing =
      await repo.findByName(data.name);

    if (existing) {
      throw new Error(
        "Region already exists"
      );
    }

    const region = await repo.create({
      ...data,
      name: data.name.toLowerCase()
    });

    await RedisService.safeDelete(
      REGION_CACHE_KEY
    );

    return region;
  }

 
  async getRegions(filters = {}) {

  const cacheKey =
    filters.search
      ? `${REGION_CACHE_KEY}:${filters.search}`
      : REGION_CACHE_KEY;

  const cached =
    await RedisService.safeGet(cacheKey);

  if (cached) {
    return cached;
  }

  const regions =
    await repo.findAll(filters);

  await RedisService.safeSet(
    cacheKey,
    regions,
    REGION_CACHE_TTL
  );

  return regions;
}

  async updateRegion(id, data) {

    const region =
      await repo.findById(id);

    if (!region) {
      throw new Error(
        "Region not found"
      );
    }

    if (
      data.name &&
      data.name !== region.name
    ) {

      const existing =
        await repo.findByName(
          data.name
        );

      if (existing) {
        throw new Error(
          "Region name already exists"
        );
      }
    }

    if (
      region.name ===
      DEFAULT_REGION_NAME
    ) {
      throw new Error(
        "Default region cannot be modified"
      );
    }

    const updatedRegion =
      await repo.update(id, {
        ...data,
        name: data.name?.toLowerCase()
      });

    await RedisService.safeDelete(
      REGION_CACHE_KEY
    );

    return updatedRegion;
  }

  async deleteRegion(id) {

    const region =
      await repo.findById(id);

    if (!region) {
      throw new Error(
        "Region not found"
      );
    }

    if (
      region.name ===
      DEFAULT_REGION_NAME
    ) {
      throw new Error(
        "Default region cannot be deleted"
      );
    }

    const hasUsers =
      await repo.regionHasUsers(id);

    if (hasUsers) {
      throw new Error(
        "Cannot delete region assigned to users"
      );
    }

    await repo.delete(id);

    await RedisService.safeDelete(
      REGION_CACHE_KEY
    );

    return true;
  }


async getRegionUsers(
  regionId,
  filters
) {

  const region =
    await repo.findById(regionId);

  if (!region) {
    throw new Error(
      "Region not found"
    );
  }

  const page =
    Number(filters.page) || 1;

  const limit =
    Number(filters.limit) || 20;

  return repo.getRegionUsers(
    regionId,
    {
      ...filters,
      page,
      limit
    }
  );
}
}