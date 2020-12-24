import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { HttpRequest, HttpResponse, EmailValidator } from './login-protocols'
import { LoginController } from './login'

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: String): boolean { return true }
  }

  return new EmailValidatorStub()
}
interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new LoginController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

const makeFakeData = (): any => ({
  email: 'any_mail@mail.com',
  password: 'any_password'
})

const makeFakeRequest = (data): HttpRequest => ({
  body: {
    ...data
  }
})

const makeFakeError = (): Error => {
  const error = new Error()
  error.stack = 'fake_stack'
  return error
}

describe('Controller: Login', () => {
  test('Should return 400 if missing email', async () => {
    const { sut } = makeSut()
    const { email, ...data } = makeFakeData()
    const response: HttpResponse = await sut.handle(makeFakeRequest(data))
    expect(response).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if missing password', async () => {
    const { sut } = makeSut()
    const { password, ...data } = makeFakeData()
    const response: HttpResponse = await sut.handle(makeFakeRequest(data))
    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if email is not valid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const data = makeFakeData()
    const response: HttpResponse = await sut.handle(makeFakeRequest(data))
    expect(response).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const data = makeFakeData()
    await sut.handle(makeFakeRequest(data))
    expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email: String) => {
      throw makeFakeError()
    })
    const data = makeFakeData()
    const response = await sut.handle(makeFakeRequest(data))
    expect(response).toEqual(serverError(new Error()))
    expect(response.body.stack).toEqual('fake_stack')
  })
})
