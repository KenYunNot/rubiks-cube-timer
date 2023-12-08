import { createContext } from 'react';
import { IDLE } from '../lib/definitions';

export const StatusContext = createContext({} as {status: string, setStatus: any});