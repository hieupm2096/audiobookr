import { Pagination } from './pagination'

declare global {
  namespace Express {
    export interface Request {
      pagination?: Pagination
    }
  }
}
