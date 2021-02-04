import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log/log-controller-decorator-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-usecase-factory'
import { makeLoginValidator } from './validators/login-controller-validators-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidator())
  return makeLogControllerDecorator(loginController)
}
