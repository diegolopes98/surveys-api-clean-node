import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })
})
