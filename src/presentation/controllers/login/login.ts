import { badRequest, serverError, unauthorized, ok } from '../../helpers'
import { HttpRequest, HttpResponse, Controller, Authentication, Validator } from './login-protocols'

export class LoginController implements Controller {
  private readonly validator: Validator
  private readonly authentication: Authentication
  constructor (authentication: Authentication, validator: Validator) {
    this.validator = validator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { email, password } = httpRequest.body

      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
