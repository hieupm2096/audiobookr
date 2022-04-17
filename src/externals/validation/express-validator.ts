import express from 'express'
import { CustomValidator, ValidationChain, validationResult } from 'express-validator'

export const validate = (validations: ValidationChain[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    res.status(400).json({ message: errors.array() })
  }
}

export const bodyNotEmpty: CustomValidator = (_, { req }) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return Promise.reject('Invalid request body')
  }
  return true
}

export const isAlphaWithUnicode: CustomValidator = (value) => {
  const regex = new RegExp(
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s|_]+$/,
  )
  if (!regex.test(value)) {
    return Promise.reject('Invalid value')
  }
  return true
}
