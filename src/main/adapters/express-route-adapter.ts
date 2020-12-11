import { Request, Response } from 'express'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpReponse: HttpResponse = await controller.handle(httpRequest)
    res.status(httpReponse.statusCode).send(httpReponse.body)
  }
}
