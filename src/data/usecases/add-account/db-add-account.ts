import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly Hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.Hasher.hash(accountData.password)
    const account: AccountModel = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })
    return Promise.resolve(account)
  }
}
