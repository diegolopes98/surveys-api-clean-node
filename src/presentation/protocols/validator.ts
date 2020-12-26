export interface Validator {
  validate: (input: { [key: string]: any }) => Error
}
