import axios from 'axios';
import { useRef } from 'react';

/**
 * A react hook that returns a safe to use axios instance
 * @returns a ref to an axios instance pointed at the api
 */
export function useAxios() {
  const { current: instance } = useRef(
    axios.create({
      baseURL:
        process.env['NODE_ENV'] === 'production'
          ? 'https://capstonemediaserver.ca/api'
          : 'http://localhost:4200/api',
    })
  );

  return instance;
}
