import request from 'supertest'
import app from '../../config/app'

describe('Middlewares: body parser', () => {
  test('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({ value: 'test_value' })
      .expect({ value: 'test_value' })
  })
})
