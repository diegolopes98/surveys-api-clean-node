import { SignUpController } from './signup-controller'
import { AddAccount, AddAccountModel, AccountModel, Validator, HttpRequest, Authentication, AuthenticationModel } from './signup-controller-protocols'
import { badRequest, ok, serverError } from '../../helpers'

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()
      return Promise.resolve(fakeAccount)
    }
  }

  return new AddAccountStub()
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (data: AuthenticationModel): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}
interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validatorStub: Validator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validatorStub = makeValidatorStub()
  const authenticationStub = makeAuthenticationStub()
  const sut = new SignUpController(
    addAccountStub,
    validatorStub,
    authenticationStub
  )
  return {
    sut,
    addAccountStub,
    validatorStub,
    authenticationStub
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
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

describe('Controller: SignUp', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeRequest(makeFakeAccount())
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })

    const httpRequest = makeFakeRequest(makeFakeAccount())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest(makeFakeAccount())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const addSpy = jest.spyOn(validatorStub, 'validate')
    const httpRequest = makeFakeRequest(makeFakeAccount())
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validator returns an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error('fake_error'))
    const httpRequest = makeFakeRequest(makeFakeAccount())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error('fake_error')))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const { email, password } = makeFakeAccount()
    const data = { email, password }
    await sut.handle(makeFakeRequest(data))
    expect(authSpy).toHaveBeenCalledWith(data)
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(makeFakeError())
    const { email, password } = makeFakeAccount()
    const data = { email, password }
    const response = await sut.handle(makeFakeRequest(data))
    expect(response).toEqual(serverError(new Error()))
    expect(response.body.stack).toEqual('fake_stack')
  })
})
