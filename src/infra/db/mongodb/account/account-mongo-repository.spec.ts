import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../domain/usecases/add-account/add-account'
import { MongoHelper } from '../helpers/mongo'
import { AccountMongoRepository } from './account-mongo-repository'

let accountsCollection: Collection

const makeFakeAddAccountModel = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})
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
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  test('Should return an account on add success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAddAccountModel())
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const { sut } = makeSut()
    await accountsCollection.insertOne(makeFakeAddAccountModel())
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return null if loadByEmail fails', async () => {
    const { sut } = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBe(null)
  })

  test('Should update account accessToken on updateAccessToken success', async () => {
    const { sut } = makeSut()
    const { _id, ...res } = (await accountsCollection.insertOne(makeFakeAddAccountModel())).ops[0]
    expect(res.accessToken).toBeFalsy()
    await sut.updateAccessToken(_id, 'any_token')
    const account = await accountsCollection.findOne({ _id })
    expect(account).toBeTruthy()
    expect(account.accessToken).toEqual('any_token')
  })
})
