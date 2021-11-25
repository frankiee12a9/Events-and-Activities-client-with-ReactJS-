// Error handling model
export interface ServerError {
  statusCode: number;
  message: string;
  details: string;
}
