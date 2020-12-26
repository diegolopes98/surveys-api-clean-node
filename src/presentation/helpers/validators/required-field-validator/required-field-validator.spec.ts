import { MissingParamError } from '../../../errors'
import { RequiredFieldValidator } from './required-field-validator'

interface SutTypes {
  sut: RequiredFieldValidator
}
const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidator('test')
  return {
    sut
  }
}

describe('Validator: Required Field', () => {
  test('Should return MissingParamError when field is not provided', () => {
    const { sut } = makeSut()
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('test'))
  })

  test('Should not return MissingParamError when field is provided', () => {
    const { sut } = makeSut()
    const error = sut.validate({ test: 'any_value' })
    expect(error).toBeUndefined()
  })
})
