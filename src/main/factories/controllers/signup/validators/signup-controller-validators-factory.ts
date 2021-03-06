import { ValidatorComposite, RequiredFieldValidator, EmailValidator, CompareFieldValidator } from '../../../../../validation/validators'
import { Validator } from '../../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../../../infra/validators/email/email-validator-adapter'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(new CompareFieldValidator('password', 'passwordConfirmation'))

  validators.push(new EmailValidator('email', new EmailValidatorAdapter()))
  return new ValidatorComposite(validators)
}
