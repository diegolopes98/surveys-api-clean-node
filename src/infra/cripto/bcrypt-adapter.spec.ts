import { Encrypter } from '../../data/protocols/encrypter'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (value: string, salt: string | number): Promise<string> {
    return Promise.resolve('hashed_value')
  }
}))

describe('Bcrypt Adapter', () => {
  interface SutTypes {
    sut: Encrypter
    salt: number
  }
  const makeSut = (): SutTypes => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    return {
      sut,
      salt
    }
  }

  test('Should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toEqual('hashed_value')
  })
})
