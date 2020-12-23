import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { HttpRequest, HttpResponse } from './login-protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()
  return {
    sut
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
})
