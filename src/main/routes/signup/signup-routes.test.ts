import request from 'supertest'
import app from '../../config/app'

describe('Routes: signup', () => {
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
