import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { LogMongoRepository } from './log-mongo-repository'

interface SutTypes {
  sut: LogMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new LogMongoRepository()
  return {
    sut
  }
}

describe('Mongo Repository: Log', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('Log: Error', () => {
    let errorsCollection: Collection

    beforeEach(async () => {
      errorsCollection = await MongoHelper.getCollection('errors')
      await errorsCollection.deleteMany({})
    })

    test('Should create an error document on success ', async () => {
      const { sut } = makeSut()
      await sut.logError('any_stack')
      const count = await errorsCollection.countDocuments()
      expect(count).toBe(1)
    })
  })
})
