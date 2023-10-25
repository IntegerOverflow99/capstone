import { injectable } from 'inversify';
import { BaseHttpController } from 'inversify-express-utils';
import { JsonResult } from 'inversify-express-utils/lib/results';
import { sanitizeData } from '@capstone/utils/general';

@injectable()
export default abstract class BaseController extends BaseHttpController {
  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  protected json(content: any, statusCode: number = 200): JsonResult {
    content = sanitizeData(content);
    return new JsonResult(content, statusCode);
  }
}
