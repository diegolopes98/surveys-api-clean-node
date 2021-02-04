import { InvalidParamError } from '../../../presentation/errors'
import { CompareFieldValidator } from './compare-field-validator'

interface SutTypes {
  sut: CompareFieldValidator
}
const makeSut = (param1: string, param2: string): SutTypes => {
  const sut = new CompareFieldValidator(param1, param2)
  return {
    sut
  }
}

describe('Validator: Compare Field', () => {
  test('Should return InvalidParamError when fields does not match', () => {
    const { sut } = makeSut('test', 'test2')
    const error = sut.validate({ test: 'test', test2: 'invalid' })
    expect(error).toEqual(new InvalidParamError('test2'))
  })

  test('Should not return InvalidParamError when fields match', () => {
    const { sut } = makeSut('test', 'test2')
    const error = sut.validate({ test: 'test', test2: 'test' })
    expect(error).toBeUndefined()
  })
})
