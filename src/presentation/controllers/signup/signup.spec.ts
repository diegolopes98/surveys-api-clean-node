import { SignUpController } from './signup'
import { AddAccount, AddAccountModel, AccountModel, Validator, HttpRequest } from './signup-protocols'
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
interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validatorStub = makeValidatorStub()
  const sut = new SignUpController(
    addAccountStub,
    validatorStub
  )
  return {
    sut,
    addAccountStub,
    validatorStub
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any@mail.com',
    password: 'any_pass',
    passwordConfirmation: 'any_pass'
  }
})

describe('Controller: SignUp', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any@mail.com',
      password: 'any_pass'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async (account: AccountModel) => {
      return Promise.reject(new Error())
    })

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const addSpy = jest.spyOn(validatorStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validator returns an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error('fake_error'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error('fake_error')))
  })
})
