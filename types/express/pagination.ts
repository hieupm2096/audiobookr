import express from 'express'

export enum SortOrder {
  asc = 'ASC',
  desc = 'DESC',
}

export interface Sort {
  key: string
  order: SortOrder
}

export interface Pagination {
  limit: number
  skip: number
  sort?: Sort
}

export const pagination = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const limit = isNaN(Number(req.query.limit)) ? 20 : Number(req.query.limit)
  const skip = isNaN(Number(req.query.skip)) ? 0 : Number(req.query.skip)
  let sort: Sort = null
  if (req.query.sort) {
    let key = req.query.sort as string
    const isAscending = key.substring(0, 1) !== '-'
    if (!isAscending) {
      key = key.substring(1)
    }
    sort = { key: key, order: isAscending ? SortOrder.asc : SortOrder.desc }
  }

  const pagination: Pagination = { limit, skip, sort }

  req.pagination = pagination

  next()
}
