import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import app from '../../config/app'

describe('Routes: signup', () => {
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
    await request(app)
      .post('/api/surveys/signup')
      .send({
        name: 'Test Test',
        email: 'test@mail.com',
        password: 'test123',
        passwordConfirmation: 'test123'
      })
      .expect(200)
  })
})