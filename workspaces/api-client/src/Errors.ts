import ExtensibleCustomError from "extensible-custom-error";

export class ApiClientError extends ExtensibleCustomError {}

export class ApiError extends ApiClientError {}
export class Response4xxError extends ApiError {}
export class Response5xxError extends ApiError {}
export class InvalidJsonError extends ApiError {}
export class RequestAbortedError extends ApiError {}

export class MalformedResponseError extends ApiClientError {}
