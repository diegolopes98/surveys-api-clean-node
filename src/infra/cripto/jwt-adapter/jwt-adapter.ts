import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/cripto/encrypter'

export class JwtAdapter implements Encrypter {
  constructor (
    private readonly secret: string
  ) {}

  async encrypt (value: string): Promise<string> {
    const token = await jwt.sign({ value }, this.secret)
    return token
  }
}
