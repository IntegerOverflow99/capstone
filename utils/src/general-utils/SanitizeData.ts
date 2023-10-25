/**
 * Sanitizes data for transport via HTTP, WebSockets, etc.
 * Transforms `undefined` values to `null` so headers are kept.
 */
export function sanitizeData<T extends object>(data: T): T | null {
  if (Array.isArray(data)) {
    return data.map((item) => {
      return sanitizeData(item);
    }) as unknown as T;
  }
  if (typeof data === 'object') {
    return Object.keys(data).reduce((acc: any, key) => {
      if (acc[key] === undefined) acc[key] = null;
      return acc;
    }, data);
  }
  if (data === undefined) {
    return null;
  }
  return data;
}
