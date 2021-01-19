import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo'
import app from '../../config/app'

describe('Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('Signup', () => {
    test('Should return 200 on signup', async () => {
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
})
