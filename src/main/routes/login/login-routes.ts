import { Router } from 'express'
import { adaptRoute } from '../../adapters/express/express-route-adapter'
import { makeSignUpController } from '../../factories/signup-controller/signup-controller-factory'
import { makeLoginController } from '../../factories/login-controller/login-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
