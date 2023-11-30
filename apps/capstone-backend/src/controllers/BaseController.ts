import { injectable } from 'inversify';
import { BaseHttpController } from 'inversify-express-utils';
import { JsonResult } from 'inversify-express-utils/lib/results';
import { sanitizeData } from '@capstone/utils/general';

/**
 * Base Controller
 * Provides a base for all controllers to extend from, adding a json methond for easy sanitization
 */
@injectable()
export default abstract class BaseController extends BaseHttpController {
  constructor() {
    super();
  }

  /**
   * Sanitize and return the given data as JSON
   * @param content The data to return
   * @param statusCode The HTTP status code to return
   * @returns The given data as JSON
   * @example
   * return this.json({ message: 'Hello, world!' });
   * // returns { "message": "Hello, world!" }
   * @example
   * return this.json({ message: 'Hello, world!' }, 201);
   * // returns { "message": "Hello, world!" } with a 201 status code
   */
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  protected json(content: any, statusCode: number = 200): JsonResult {
    content = sanitizeData(content);
    return new JsonResult(content, statusCode);
  }
}
