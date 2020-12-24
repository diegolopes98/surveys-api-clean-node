import { Authentication } from '../../../domain/usecases/authentication/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { checkMissingParams } from '../../helpers/controller-helper'
import { badRequest, serverError } from '../../helpers/http-helper'
import { HttpRequest, HttpResponse, EmailValidator, Controller } from './login-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      const missingParam = checkMissingParams(requiredFields, httpRequest)
      if (missingParam) return badRequest(new MissingParamError(missingParam))

      const { email, password } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) return badRequest(new InvalidParamError('email'))

      await this.authentication.auth(email, password)
    } catch (error) {
      return serverError(error)
    }
  }
}
