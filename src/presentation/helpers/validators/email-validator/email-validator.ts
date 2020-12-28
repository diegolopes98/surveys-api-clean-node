import { InvalidParamError } from '../../../errors'
import { Validator } from '../../../protocols'
import { EmailValidator as EmailValidatorAdapter } from '../../../protocols/email-validator'

export class EmailValidator implements Validator {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidatorAdapter

  constructor (fieldName: string, emailValidator: EmailValidatorAdapter) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate (input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) return new InvalidParamError(this.fieldName)
  }
}
