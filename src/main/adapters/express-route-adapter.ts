import { Request, Response } from 'express'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpReponse: HttpResponse = await controller.handle(httpRequest)
    if (httpReponse.statusCode.toString().match(/2[0-9][0-9]/)) {
      res.status(httpReponse.statusCode).send(httpReponse.body)
    } else {
      const error: string = httpReponse.body.message
      res.status(httpReponse.statusCode).send({
        error
      })
    }
  }
}
