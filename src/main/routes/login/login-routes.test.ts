import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo'
import app from '../../config/app'

let accountsCollection: Collection

describe('Routes', () => {
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

  describe('Signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Test Test',
          email: 'test@mail.com',
          password: 'test123',
          passwordConfirmation: 'test123'
        })
        .expect(200)
    })
  })

  describe('Login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('test123', 12)
      await accountsCollection.insertOne({
        name: 'Test Test',
        email: 'test@mail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'test@mail.com',
          password: 'test123'
        })
        .expect(200)
    })

    test('Should return 401 on login fail', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'test@mail.com',
          password: 'test123'
        })
        .expect(401)
    })
  })
})
