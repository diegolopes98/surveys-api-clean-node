import { Encrypter } from '../../data/protocols/cripto/encrypter'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (value: string, salt: string | number): Promise<string> {
    return Promise.resolve('hashed_value')
  }
}))

interface SutTypes {
  sut: Encrypter
}

const salt = 12
const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(salt)
  return {
    sut
  }
}

describe('Adapter: Bcrypt', () => {
  test('Should call bcrypt with correct values', async () => {
    const { sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toEqual('hashed_value')
  })

  test('Should throw if bcrypt throw', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })
})
