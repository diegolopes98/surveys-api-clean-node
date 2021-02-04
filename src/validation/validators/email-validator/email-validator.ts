import { InvalidParamError } from '../../../presentation/errors'
import { Validator } from '../../../presentation/protocols'
import { EmailValidator as EmailValidatorAdapter } from '../../protocols/email-validator'

export class EmailValidator implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidatorAdapter
  ) {}

  validate (input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) return new InvalidParamError(this.fieldName)
  }
}
