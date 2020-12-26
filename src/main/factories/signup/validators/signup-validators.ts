import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validators-composite'
import { Validator } from '../../../../presentation/protocols'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFieldValidator(field))
  }
  return new ValidatorComposite(validators)
}
