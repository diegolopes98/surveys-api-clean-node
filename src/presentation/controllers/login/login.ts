import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller } from '../../protocols'

import { HttpRequest, HttpResponse } from './login-protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    if (!email) return badRequest(new MissingParamError('email'))

    if (!password) return badRequest(new MissingParamError('password'))
  }
}
