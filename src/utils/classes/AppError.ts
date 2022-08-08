export class AppError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super();
    this.message = message;
    this.status = status;
  }
}
