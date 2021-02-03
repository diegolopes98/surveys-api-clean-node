import { Router } from 'express'
import { adaptRoute } from '../../adapters/express/express-route-adapter'
import { makeSignUpController } from '../../factories/controllers/signup-controller/signup-controller-factory'
import { makeLoginController } from '../../factories/controllers/login-controller/login-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
