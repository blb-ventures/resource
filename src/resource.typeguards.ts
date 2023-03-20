import {
  APIField,
  APIFieldObject,
  APIResourceField,
  DecimalFieldValidation,
  Field,
  FieldObject,
  FieldValidation,
  IntFieldValidation,
  ResourceField,
  StringFieldValidation,
} from './resource.interface';

export const isField = <FieldKey extends string = string, FieldObjectKey extends string = string>(
  field: ResourceField<FieldKey, FieldObjectKey>,
): field is Field<FieldKey> => 'kind' in field;
export const isFieldObject = <
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
>(
  field: ResourceField<FieldKey, FieldObjectKey>,
): field is FieldObject<FieldObjectKey> => 'fields' in field;

export const isAPIField = <
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
  ObjectKind extends PropertyKey = string,
>(
  field: APIResourceField<FieldKey, FieldObjectKey, ObjectKind>,
): field is APIField<FieldKey> => 'kind' in field;
export const isAPIFieldObject = <
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
>(
  field: APIResourceField<FieldKey, FieldObjectKey>,
): field is APIFieldObject<FieldObjectKey> => 'fields' in field;

export const isNumberValidation = (
  validation: FieldValidation,
): validation is IntFieldValidation | DecimalFieldValidation => 'minValue' in validation;
export const isStringValidation = (
  validation: FieldValidation,
): validation is StringFieldValidation => 'minLength' in validation;

export const isFn = (input: unknown): input is Function => typeof input === 'function';
export const isBrowserFile = (input: unknown): input is File => input instanceof File;
