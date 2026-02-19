import axios from 'axios';

import { CONFIG } from '@/config';



export const api = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
