import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount, Validator } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok, checkMissingParams } from '../../helpers'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validator: Validator

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validator: Validator) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validator = validator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validator.validate(httpRequest.body)
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      const missingParam = checkMissingParams(requiredFields, httpRequest)
      if (missingParam) return badRequest(new MissingParamError(missingParam))

      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
