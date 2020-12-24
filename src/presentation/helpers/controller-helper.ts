import { HttpRequest } from '../protocols'

export const checkMissingParams = (requiredFields: string[] , request: HttpRequest): string => {
  for (const field of requiredFields) {
    if (!request.body[field]) {
      return field
    }
  }
}
