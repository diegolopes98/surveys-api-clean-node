import { CompareFieldValidator } from '../../../../presentation/helpers/validators/compare-field-validator/compare-field-validator'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validators-composite'
import { Validator } from '../../../../presentation/protocols'
import { makeSignUpValidator } from './signup-validators'

jest.mock('../../../../presentation/helpers/validators/validators-composite')

describe('Validators: SignUp Validator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeSignUpValidator()
    const validators: Validator[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validators.push(new RequiredFieldValidator(field))
    }
    validators.push(new CompareFieldValidator('password', 'passwordConfirmation'))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
