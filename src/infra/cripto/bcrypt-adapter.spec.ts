import { Encrypter } from '../../data/protocols/encrypter'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

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
})
