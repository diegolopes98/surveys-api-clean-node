import { ValidatorComposite, EmailValidator, RequiredFieldValidator } from '../../../../presentation/helpers/validators'
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
