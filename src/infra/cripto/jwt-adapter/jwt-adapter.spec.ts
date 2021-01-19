import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return Promise.resolve('any_token')
  }
}))

interface SutTypes {
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter('secret')
  return {
    sut
  }
}

describe('Adapter: Jwt', () => {
  test('Should call sign with correct values', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_value')
    expect(signSpy).toHaveBeenCalledWith({ value: 'any_value' }, 'secret')
  })

  test('Should return a token on sign success', async () => {
    const { sut } = makeSut()
    const token = await sut.encrypt('any_value')
    expect(token).toEqual('any_token')
  })

  test('Should throw if sign throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error('fake_error')
    })
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })
})
