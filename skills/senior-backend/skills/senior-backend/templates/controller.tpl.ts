import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@/utils/catchAsync';
import { logger } from '@/utils/logger';
import { {{EntityName}}Service } from '@/services/{{entityName}}.service';

/**
 * Lấy thông tin một {{EntityName}} theo ID
 */
export const get{{EntityName}} = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  logger.info(`[get{{EntityName}}] Request to fetch {{EntityName}} with id: ${id}`);
  
  // Khởi tạo service (do không dùng static method)
  const {{entityName}}Service = new {{EntityName}}Service();
  const result = await {{entityName}}Service.findById(id);
  
  logger.info(`[get{{EntityName}}] Successfully retrieved {{EntityName}} id: ${id}`);
  
  // Chuẩn form Response Envelope
  res.status(200).json({
    data: { 
      doc: result 
    },
    meta: { 
      timestamp: new Date().toISOString() 
    }
  });
});
