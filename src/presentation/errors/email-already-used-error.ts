export class EmailAlreadyUsed extends Error {
  constructor () {
    super('the received email is already used')
    this.name = 'EmailAlreadyUsed'
  }
}
