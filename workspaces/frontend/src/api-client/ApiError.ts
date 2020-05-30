import ExtensibleCustomError from "extensible-custom-error";

export class ApiError extends ExtensibleCustomError {}

export class ApiResponse4xxError extends ApiError {}
export class ApiResponse5xxError extends ApiError {}
export class ApiInvalidJsonError extends ApiError {}
export class ApiRequestAbortedError extends ApiError {}
