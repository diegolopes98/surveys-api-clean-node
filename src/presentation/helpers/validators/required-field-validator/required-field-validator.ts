import { MissingParamError } from '../../../errors'
import { Validator } from '../../../protocols'

export class RequiredFieldValidator implements Validator {
  private readonly fieldName: string
  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: { [key: string]: any }): Error {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName)
  }
}