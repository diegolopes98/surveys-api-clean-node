import { CompareFieldValidator } from '../../../../presentation/helpers/validators/compare-field-validator/compare-field-validator'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validators-composite'
import { Validator } from '../../../../presentation/protocols'
import { makeSignUpValidator } from './signup-validators'
import { EmailValidator as EmailValidatorAdapter } from '../../../../presentation/protocols/email-validator'
import { EmailValidator } from '../../../../presentation/helpers/validators/email-validator/email-validator'

jest.mock('../../../../presentation/helpers/validators/validators-composite')

const makeEmailValidatorStub = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidatorAdapter {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Validators: SignUp Validator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeSignUpValidator()
    const validators: Validator[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validators.push(new RequiredFieldValidator(field))
    }
    validators.push(new CompareFieldValidator('password', 'passwordConfirmation'))
    validators.push(new EmailValidator('email', makeEmailValidatorStub()))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
