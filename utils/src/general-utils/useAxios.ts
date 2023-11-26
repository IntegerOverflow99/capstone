import axios from 'axios';
import { useRef } from 'react';

export function useAxios() {
  //create an instance of axios pointed at the api on the same address as this webserver app, on port 3000 rather than the port the webserver is running on
  const { current: instance } = useRef(
    axios.create({
      baseURL:
        process.env['NODE_ENV'] === 'production'
          ? 'http://localhost/api'
          : 'http://localhost:4200',
    })
  );

  return instance;
}
