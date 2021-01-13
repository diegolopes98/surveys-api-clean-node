import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication/authentication'
import { HashComparer } from '../../protocols/cripto/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (data: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(data.email)
    if (account) {
      await this.hashComparer.compare(data.password, account.password)
    }
    return null
  }
}
