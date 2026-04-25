import { AppError } from '@/utils/appError';
import { logger } from '@/utils/logger';
import { {{EntityName}}Repository } from '@/repositories/{{entityName}}.repository';

export class {{EntityName}}Service {
  private {{entityName}}Repository: {{EntityName}}Repository;

  constructor() {
    this.{{entityName}}Repository = new {{EntityName}}Repository();
  }

  /**
   * Truy vấn {{EntityName}} từ Database qua Repository layer
   * Ném lỗi AppError(message, status) nếu không tìm thấy dữ liệu hợp lệ
   */
  async findById(id: string) {
    logger.debug(`[{{EntityName}}Service.findById] Executing logic for ID: ${id}`);
    
    // Gọi qua Repository thay vì Model trực tiếp
    const doc = await this.{{entityName}}Repository.findById(id);
    
    // Handle error ở mức Service bằng AppError, ném thẳng ra để Controller/catchAsync bắt
    if (!doc) {
      logger.warn(`[{{EntityName}}Service.findById] {{EntityName}} not found for ID: ${id}`);
      throw new AppError('No {{entityName}} found with that ID', 404);
    }
    
    return doc;
  }
}
