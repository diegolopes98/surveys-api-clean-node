import { badRequest, ok, serverError, unauthorized } from '../../helpers'
import { HttpRequest, HttpResponse, Authentication, AuthenticationModel, Validator } from './login-protocols'
import { LoginController } from './login'

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (data: AuthenticationModel): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new AuthenticationStub()
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}
interface SutTypes {
  sut: LoginController
  validatorStub: Validator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const validatorStub = makeValidatorStub()
  const sut = new LoginController(authenticationStub, validatorStub)
  return {
    sut,
    validatorStub,
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
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const data = makeFakeData()
    await sut.handle(makeFakeRequest(data))
    expect(authSpy).toHaveBeenCalledWith(makeFakeData())
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

  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const addSpy = jest.spyOn(validatorStub, 'validate')
    const httpRequest = makeFakeRequest(makeFakeData())
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validator returns an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error('fake_error'))
    const httpRequest = makeFakeRequest(makeFakeData())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error('fake_error')))
  })
})
