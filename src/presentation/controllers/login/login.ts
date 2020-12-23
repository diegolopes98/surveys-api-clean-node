import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller } from '../../protocols'
import { HttpRequest, HttpResponse, EmailValidator } from './login-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    if (!email) return badRequest(new MissingParamError('email'))

    if (!password) return badRequest(new MissingParamError('password'))

    this.emailValidator.isValid(email)
  }
}
