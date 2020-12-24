import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers'
import { HttpRequest, HttpResponse, EmailValidator, Authentication } from './login-protocols'
import { LoginController } from './login'

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new AuthenticationStub()
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: String): boolean { return true }
  }

  return new EmailValidatorStub()
}
interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
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

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const data = makeFakeData()
    await sut.handle(makeFakeRequest(data))
    expect(authSpy).toHaveBeenCalledWith('any_mail@mail.com', 'any_password')
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(null)
    const data = makeFakeData()
    const response: HttpResponse = await sut.handle(makeFakeRequest(data))
    expect(response).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(makeFakeError())
    const data = makeFakeData()
    const response = await sut.handle(makeFakeRequest(data))
    expect(response).toEqual(serverError(new Error()))
    expect(response.body.stack).toEqual('fake_stack')
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const data = makeFakeData()
    const response: HttpResponse = await sut.handle(makeFakeRequest(data))
    expect(response).toEqual(ok({ accessToken: 'any_token' }))
  })
})
