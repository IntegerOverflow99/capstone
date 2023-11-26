//tunnel to port 3000, removing api from the path and proxying the request to the backend

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // `path` is an array of path segments
  const { path } = req.query;
  delete req.query.path;
  const method = req.method!.toLowerCase();

  // Join the path segments into a single string
  const pathString = Array.isArray(path) ? path.join('/') : path;

  const url = `http://localhost:3000/${pathString}`;
  console.log(pathString);
  const response = await axios({
    url,
    method,
    data: req.body,
    headers: req.headers,
    params: req.query,
  });
  // console.log(response.headers);
  //forward response back as is - keep in mind this may be a file request, it may be json, it may be plaintext, etc. it shouldnt care about the response type
  res
    .status(response.status)
    .setHeader('Content-Type', response.headers['Content-Type'] as string)
    .send(response.data);
};

//this is a special config for nextjs to allow for larger responses - ONLY feasible here because we are running on and proxying to a local server
export const config = {
  api: {
    responseLimit: false,
    bodyParser: false,
  },
};

export default handler;

// Path: apps/capstone-frontend/pages/api/[...path].ts
