import { MongoHelper } from '../helpers/mongo/mongo-helper'
import { AccountMongoRepository } from './account'

interface SutTypes {
  sut: AccountMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new AccountMongoRepository()
  return {
    sut
  }
}

describe('Mongo Repository: Account', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.getCollection('accounts').deleteMany({})
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
})
