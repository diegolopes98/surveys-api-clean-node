import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/cripto/encrypter'

export class JwtAdapter implements Encrypter {
  private readonly secret: string
  constructor (secret: string) {
    this.secret = secret
  }

  async encrypt (value: string): Promise<string> {
    return await jwt.sign(value, this.secret)
  }
}
