/* eslint-disable prettier/prettier */
export function BusinessLogicException(message: string, type: number) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  this.message = message;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  this.type = type;
}

export enum BusinessError {
  NOT_FOUND,
  PRECONDITION_FAILED,
  BAD_REQUEST,
}
