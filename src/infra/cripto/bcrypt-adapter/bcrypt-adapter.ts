import bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/protocols/cripto/hash-comparer'
import { Hasher } from '../../../data/protocols/cripto/hasher'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (
    private readonly salt: number
  ) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
