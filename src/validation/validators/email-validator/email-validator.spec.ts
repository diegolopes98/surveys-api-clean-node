import { InvalidParamError } from '../../../presentation/errors'
import { EmailValidator } from './email-validator'
import { EmailValidator as EmailValidatorAdapter } from '../../../validation//protocols'

const makeEmailValidatorStub = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidatorAdapter {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidator
  emailValidatorStub: EmailValidatorAdapter
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new EmailValidator('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Validator: Email', () => {
  test('Should call EmailValidatorAdapter with correct value', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'any_mail@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })

  test('Should throw if EmailValidatorAdapter throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(sut.validate).toThrow()
  })

  test('Should return InvalidParamError when invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({})
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should not return InvalidParamError when a valid email is provided', () => {
    const { sut } = makeSut()
    const error = sut.validate({})
    expect(error).toBeUndefined()
  })
})
