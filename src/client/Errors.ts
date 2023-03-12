export class ClientError extends Error {
  status: number
  body: any

  constructor(status: number, body: any) {
    super();
    this.status = status;
    this.body = body;
  }
}

export class InvalidArgumentError extends Error {
}
