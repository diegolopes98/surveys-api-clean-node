import { Validator } from '../../presentation/protocols'
import { ValidatorComposite } from './validators-composite'

interface SutTypes {
  sut: ValidatorComposite
  validatorsStub: Validator[]
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error {
      return undefined
    }
  }
  return new ValidatorStub()
}

const makeValidatorsStub = (): Validator[] => {
  const validatorsStub: Validator[] = [
    makeValidatorStub()
  ]
  return validatorsStub
}

const makeSut = (): SutTypes => {
  const validatorsStub = makeValidatorsStub()
  const sut = new ValidatorComposite(validatorsStub)
  return {
    sut,
    validatorsStub
  }
}

describe('Validators: Composite', () => {
  test('Should return error if one validator returns an error', () => {
    const { sut, validatorsStub } = makeSut()
    jest.spyOn(validatorsStub[0], 'validate').mockReturnValueOnce(new Error('test_error'))
    const error = sut.validate({ test: 'test' })
    expect(error).toEqual(new Error('test_error'))
  })

  test('Should return undefined if no one validator returns an error', () => {
    const { sut } = makeSut()
    const error = sut.validate({ test: 'test' })
    expect(error).toBeUndefined()
  })
})
