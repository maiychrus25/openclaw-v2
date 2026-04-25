import { {{EntityName}}Model } from '@/models/{{entityName}}.model';
import { logger } from '@/utils/logger';

export class {{EntityName}}Repository {
  /**
   * Truy vấn một {{EntityName}} theo ID
   */
  async findById(id: string) {
    logger.debug(`[{{EntityName}}Repository.findById] Searching for ID: ${id}`);
    return await {{EntityName}}Model.findById(id);
  }

  /**
   * Truy vấn danh sách {{EntityName}} với query filter
   */
  async find(filter: object = {}) {
    logger.debug(`[{{EntityName}}Repository.find] Searching with filter:`, filter);
    return await {{EntityName}}Model.find(filter);
  }

  /**
   * Tạo mới một {{EntityName}}
   */
  async create(data: any) {
    logger.debug(`[{{EntityName}}Repository.create] Creating new {{EntityName}}`);
    return await {{EntityName}}Model.create(data);
  }

  /**
   * Cập nhật {{EntityName}} theo ID
   */
  async updateById(id: string, data: any) {
    logger.debug(`[{{EntityName}}Repository.updateById] Updating ID: ${id}`);
    return await {{EntityName}}Model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  /**
   * Xóa {{EntityName}} theo ID
   */
  async deleteById(id: string) {
    logger.debug(`[{{EntityName}}Repository.deleteById] Deleting ID: ${id}`);
    return await {{EntityName}}Model.findByIdAndDelete(id);
  }
}
