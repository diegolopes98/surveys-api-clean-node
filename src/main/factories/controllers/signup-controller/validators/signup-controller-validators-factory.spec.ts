import { ValidatorComposite, RequiredFieldValidator, CompareFieldValidator ,EmailValidator } from '../../../../../presentation/helpers/validators'
import { Validator } from '../../../../../presentation/protocols'
import { makeSignUpValidator } from './signup-controller-validators-factory'
import { EmailValidator as EmailValidatorAdapter } from '../../../../../presentation/protocols/email-validator'

jest.mock('../../../../../presentation/helpers/validators/validators-composite')

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
