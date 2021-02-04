import { ValidatorComposite, EmailValidator, RequiredFieldValidator } from '../../../../../validation/validators'
import { Validator } from '../../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../../../infra/validators/email/email-validator-adapter'

export const makeLoginValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['email', 'password']) {
    validators.push(new RequiredFieldValidator(field))
  }
  validators.push(new EmailValidator('email', new EmailValidatorAdapter()))
  return new ValidatorComposite(validators)
}
