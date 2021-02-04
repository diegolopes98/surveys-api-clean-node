
import { Validator } from '../../../../../presentation/protocols'
import { makeLoginValidator } from './login-controller-validators-factory'
import { EmailValidator as EmailValidatorAdapter } from '../../../../../validation/protocols'
import { EmailValidator, RequiredFieldValidator, ValidatorComposite } from '../../../../../validation/validators'

jest.mock('../../../../../validation/validators/validators-composite.ts')

const makeEmailValidatorStub = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidatorAdapter {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Validators: Login Validator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeLoginValidator()
    const validators: Validator[] = []
    for (const field of ['email', 'password']) {
      validators.push(new RequiredFieldValidator(field))
    }
    validators.push(new EmailValidator('email', makeEmailValidatorStub()))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
