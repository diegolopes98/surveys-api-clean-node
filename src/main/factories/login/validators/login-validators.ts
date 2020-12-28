import { EmailValidator } from '../../../../presentation/helpers/validators/email-validator/email-validator'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validators-composite'
import { Validator } from '../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../../utils/email-validator-adapter'

export const makeLoginValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['email', 'password']) {
    validators.push(new RequiredFieldValidator(field))
  }
  validators.push(new EmailValidator('email', new EmailValidatorAdapter()))
  return new ValidatorComposite(validators)
}
