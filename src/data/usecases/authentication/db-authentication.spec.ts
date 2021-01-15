import { DbAuthentication } from './db-authentication'
import {
  AccountModel,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccount()
      return Promise.resolve(account)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }

  return new HashComparerStub()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new EncrypterStub()
}

const makeUpdateAccessTokenStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccountStub()
  const hashComparerStub = makeHashComparerStub()
  const encrypterStub = makeEncrypterStub()
  const updateAccessTokenStub = makeUpdateAccessTokenStub()
  const sut = new DbAuthentication(
    loadAccountStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenStub
  )
  return {
    sut,
    loadAccountStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenStub
  }
}

const makeFakeAuthModel = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

describe('Usecase: DbAuthentication', () => {
  test('Should call LoadAccountByEmailRepository  with correct email', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub, 'loadByEmail')
    await sut.auth(makeFakeAuthModel())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByEmail').mockRejectedValueOnce(new Error('fake_error'))
    const promise = sut.auth(makeFakeAuthModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByEmail').mockReturnValueOnce(null)
    const response = await sut.auth(makeFakeAuthModel())
    expect(response).toBeNull()
  })

  test('Should calls HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthModel())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error('fake_error'))
    const promise = sut.auth(makeFakeAuthModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.auth(makeFakeAuthModel())
    expect(response).toBeNull()
  })

  test('Should calls Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthModel())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error('fake_error'))
    const promise = sut.auth(makeFakeAuthModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should return token on success', async () => {
    const { sut } = makeSut()
    const response = await sut.auth(makeFakeAuthModel())
    await expect(response).toEqual('any_token')
  })

  test('Should calls UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthModel())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenStub } = makeSut()
    jest.spyOn(updateAccessTokenStub, 'updateAccessToken').mockRejectedValueOnce(new Error('fake_error'))
    const promise = sut.auth(makeFakeAuthModel())
    await expect(promise).rejects.toThrow()
  })
})
