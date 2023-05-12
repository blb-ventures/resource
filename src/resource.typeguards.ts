import {
  APIField,
  APIFieldObject,
  APIFieldUnion,
  DecimalFieldValidation,
  FieldValidation,
  IntFieldValidation,
  StringFieldValidation,
} from './resource.interface';

export const isAPIField = (field: APIFieldUnion): field is APIField => 'kind' in field;
export const isAPIFieldObject = (field: APIFieldUnion): field is APIFieldObject =>
  'fields' in field;

export const isNumberValidation = (
  validation: FieldValidation,
): validation is IntFieldValidation | DecimalFieldValidation => 'minValue' in validation;
export const isStringValidation = (
  validation: FieldValidation,
): validation is StringFieldValidation => 'minLength' in validation;

export const isBrowserFile = (input: unknown): input is File => input instanceof File;
