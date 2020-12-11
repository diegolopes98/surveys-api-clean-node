import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          test: 'test'
        }
      }
      return Promise.resolve(httpResponse)
    }
  }

  return new ControllerStub()
}

describe('Decorator: log', () => {
  test('Should call controller handle method', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        test: 'test'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
