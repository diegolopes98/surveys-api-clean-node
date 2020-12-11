import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller

  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpReponse = await this.controller.handle(httpRequest)
    // if (HttpResponse.statusCode === 500) {
    //   // TODO: implement log
    // }
    // return HttpResponse
    return httpReponse
  }
}
