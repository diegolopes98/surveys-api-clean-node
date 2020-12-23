import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller } from '../../protocols'

import { HttpRequest, HttpResponse } from './login-protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body

    if (!email) return badRequest(new MissingParamError('email'))
  }
}
