import { ErrorBuilder } from 'domain/error/builder/error.builder'
import type { Error as EntityError } from 'domain/error/entity/error'

export class ErrorMapper {
  public static readonly mapRawErrorToEntity = (rawError: unknown): EntityError => {
    const errorKey =
      rawError instanceof Error
        ? rawError.name.replace(
            /[A-Z]/g,
            (match: string, offset: number) => (offset > 0 ? '-' : '') + match.toLowerCase()
          )
        : 'unspecified-error'
    return new ErrorBuilder()
      .withMessageKey(`domain.error.${errorKey}`)
      .withType(errorKey)
      .withContext({ ...(rawError instanceof Error && { errorStack: rawError.stack }) })
      .build()
  }
}
