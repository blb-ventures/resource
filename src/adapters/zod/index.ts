import {
  z,
  ZodArray,
  ZodBoolean,
  ZodDate,
  ZodEffects,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodRawShape,
  ZodString,
  ZodTypeAny,
} from 'zod';
import {
  DecimalFieldValidation,
  FieldValidation,
  IntFieldValidation,
  ResourceField,
  ResourceFieldOrKey,
  StringFieldValidation,
} from '../../resource.interface';
import {
  isBrowserFile,
  isFieldObject,
  isNumberValidation,
  isStringValidation,
} from '../../resource.typeguards';

/* eslint-disable id-blacklist */
export const FIELD_KIND = {
  Boolean: 'BOOLEAN',
  Currency: 'CURRENCY',
  Date: 'DATE',
  Datetime: 'DATETIME',
  Decimal: 'DECIMAL',
  Distance: 'DISTANCE',
  Email: 'EMAIL',
  File: 'FILE',
  Float: 'FLOAT',
  Geopoint: 'GEOPOINT',
  Id: 'ID',
  Image: 'IMAGE',
  Int: 'INT',
  Ip: 'IP',
  Json: 'JSON',
  LegalPersonDoc: 'LEGAL_PERSON_DOC',
  Multiline: 'MULTILINE',
  NaturalPersonDoc: 'NATURAL_PERSON_DOC',
  Password: 'PASSWORD',
  Percent: 'PERCENT',
  Phone: 'PHONE',
  Point: 'POINT',
  Polygon: 'POLYGON',
  PostalCode: 'POSTAL_CODE',
  String: 'STRING',
  StringList: 'STRING_LIST',
  Time: 'TIME',
  Timedelta: 'TIMEDELTA',
  Url: 'URL',
  Uuid: 'UUID',
};

export type FieldKind = keyof typeof FIELD_KIND;

export const DEFAULT_ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
];

export type ValidationZodKinds =
  | ZodString
  | ZodNumber
  | ZodObject<ZodRawShape>
  | ZodBoolean
  | ZodNullable<any>
  | ZodEffects<any>
  | ZodDate
  | ZodOptional<any>
  | ZodArray<ValidationZodKinds>;

export interface ZodAdapterOptions<
  FieldKey extends string = FieldKind,
  FieldObjectKey extends string = string,
> {
  // Defines base validation for the kinds. Other validations will be added on top of it to handle
  // multiple (array) and type validation requirements
  rulesByField?: Record<
    string,
    (field: ResourceFieldOrKey<FieldKey, FieldObjectKey>) => ZodTypeAny
  >;
  // Defines final validation for the kinds. Needs to handle multiple (array) and type validation.
  rulesByFieldRaw?: Record<
    string,
    (field: ResourceFieldOrKey<FieldKey, FieldObjectKey>) => ZodTypeAny
  >;
  acceptedImageMimeType?: string[];
  localization: {
    required: string;
    invalidType: string;
    maxValue?: (val: number) => string;
    minValue?: (val: number) => string;
    maxLength?: (val: number) => string;
    minLength?: (val: number) => string;
    allowedImageFormat?: string;
    email?: string;
    phone?: string;
    postalCode?: string;
    url?: string;
  };
}

export const zodAdapter =
  <FieldKey extends string = string, FieldObjectKey extends string = string>(
    options?: ZodAdapterOptions<FieldKey, FieldObjectKey>,
  ) =>
  (
    fieldOrKey: ResourceFieldOrKey<FieldKey, FieldObjectKey>,
    validation?: FieldValidation,
  ): ZodTypeAny => {
    return getFieldRules(fieldOrKey, options, validation);
  };

export const getFieldRules = <
  FieldKey extends string = FieldKind,
  FieldObjectKey extends string = string,
>(
  fieldOrKey: ResourceFieldOrKey<FieldKey, FieldObjectKey>,
  options?: ZodAdapterOptions<FieldKey, FieldObjectKey>,
  validation?: FieldValidation,
) => {
  const utils = getValidationUtils(options);

  // Handles Field Object
  if (typeof fieldOrKey !== 'string' && isFieldObject(fieldOrKey)) {
    return utils.addMultipleValidation(
      getFieldRecordRules<FieldKey, FieldObjectKey>(fieldOrKey.fields, options),
    );
  }

  const key = typeof fieldOrKey === 'string' ? fieldOrKey : fieldOrKey.kind;
  const field = typeof fieldOrKey !== 'string' ? fieldOrKey : null;
  const fieldValidation = validation ?? field?.validation;
  if (fieldValidation == null) return z.any();

  if (isNumberValidation(fieldValidation)) {
    return utils.addMultipleValidation(utils.getNumberValidation(fieldValidation), field?.multiple);
  }
  if (options?.rulesByFieldRaw != null && key in options.rulesByFieldRaw) {
    return options.rulesByFieldRaw[key as keyof typeof options.rulesByFieldRaw](fieldOrKey);
  }

  const baseZod =
    options?.localization.invalidType != null || options?.localization.required != null
      ? {
          invalid_type_error: options?.localization.invalidType,
          required_error: options?.localization.required,
        }
      : undefined;
  let schema: ValidationZodKinds = z.string(baseZod);
  if (key in getFieldKindRules) {
    const fieldKindValidator = getFieldKindRules(fieldValidation, options)[
      key as keyof typeof getFieldKindRules
    ];
    schema = fieldKindValidator;
  }
  if (options?.rulesByField != null && key in options.rulesByField) {
    schema = options.rulesByField[key as keyof typeof options.rulesByField](fieldOrKey);
  }
  schema = utils.addRequired(fieldValidation.required, schema);
  if (schema instanceof ZodString && isStringValidation(fieldValidation)) {
    schema = utils.getStringValidation(schema, fieldValidation);
  }
  return utils.addMultipleValidation(schema, field?.multiple);
};

export const getFieldRecordRules = <
  FieldKey extends string = FieldKind,
  FieldObjectKey extends string = string,
>(
  fields: ResourceField<FieldKey, FieldObjectKey>[],
  options?: ZodAdapterOptions<FieldKey, FieldObjectKey>,
): ZodObject<ZodRawShape> =>
  z.object(
    fields.reduce(
      (acc, it) => ({ ...acc, [it.name]: getFieldRules(it, options) }),
      {} as ZodRawShape,
    ),
  );

export const isSupportedImage = (allowedImageFormat: string[]) => (input: unknown) =>
  input == null || (isBrowserFile(input) && allowedImageFormat.includes(input.type));

export const isRequired = (validation: FieldValidation) => (input: unknown) =>
  !validation.required || (validation.required && input != null);

const getFieldKindRules = <
  FieldKey extends string = FieldKind,
  FieldObjectKey extends string = string,
>(
  validation: FieldValidation,
  options?: ZodAdapterOptions<FieldKey, FieldObjectKey>,
) => {
  const baseZod =
    options?.localization.invalidType != null || options?.localization.required != null
      ? {
          invalid_type_error: options?.localization.invalidType,
          required_error: options?.localization.required,
        }
      : undefined;
  return {
    [FIELD_KIND.Email]: z.string(baseZod).email(options?.localization.email),
    [FIELD_KIND.Date]: z.date(baseZod),
    [FIELD_KIND.Datetime]: z.date(baseZod),
    [FIELD_KIND.Time]: z.date(baseZod),
    [FIELD_KIND.Url]: z.string(baseZod).url(options?.localization.url),
    [FIELD_KIND.Boolean]: z.boolean(baseZod),
    [FIELD_KIND.Id]: z
      .any()
      .transform(it => (typeof it === 'string' ? it : it?.id ?? null))
      .refine((it: unknown) => it != null, options?.localization.invalidType),
    [FIELD_KIND.Image]: z
      .any()
      .refine(isRequired(validation))
      .refine(input => input == null || isBrowserFile(input), options?.localization.invalidType)
      .refine(
        isSupportedImage(options?.acceptedImageMimeType ?? DEFAULT_ACCEPTED_IMAGE_MIME_TYPES),
        options?.localization.allowedImageFormat,
      ),
    [FIELD_KIND.File]: z
      .any()
      .refine(isRequired(validation))
      .refine(file => isBrowserFile(file), options?.localization.invalidType),
  };
};

export const getValidationUtils = <
  FieldKey extends string = FieldKind,
  FieldObjectKey extends string = string,
>(
  options?: ZodAdapterOptions<FieldKey, FieldObjectKey>,
) => {
  const addMinLength = (schema: ZodString, min: number, message?: string) =>
    schema.min(min, message ?? options?.localization.minLength?.(min));
  const addMaxLength = (schema: ZodString, max: number, message?: string) =>
    schema.max(max, message ?? options?.localization.maxLength?.(max));
  const addMinValue = (schema: ZodNumber, min: number, message?: string) =>
    schema.min(min, message ?? options?.localization.minValue?.(min));
  const addMaxValue = (schema: ZodNumber, max: number, message?: string) =>
    schema.max(max, message ?? options?.localization.maxValue?.(max));
  const addNullish = <T extends ZodTypeAny>(schema: T) => schema.nullish();
  const addStringRequired = (schema: ZodString, message?: string) =>
    schema.min(1, message ?? options?.localization.required);
  const addRequired = (required: boolean, schema: ValidationZodKinds) => {
    if (schema instanceof ZodString && required) return addStringRequired(schema);
    if (!required) return addNullish(schema);
    return schema;
  };
  const addMultipleValidation = <T extends ZodTypeAny>(schema: T, multiple?: boolean) =>
    multiple ? z.array(schema) : schema;
  const getNumberValidation = (validation: DecimalFieldValidation | IntFieldValidation) => {
    let schema: ZodNumber | ZodNullable<ZodNumber> = z.number();
    if (validation.minValue != null) schema = addMinValue(schema, validation.minValue);
    if (validation.maxValue != null) schema = addMaxValue(schema, validation.maxValue);
    if (validation.required === false) schema = addNullish(schema).unwrap();
    return schema;
  };

  const getStringValidation = (schema: ZodString, validation: StringFieldValidation) => {
    let newSchema = schema;
    if (validation.minLength) newSchema = addMinLength(newSchema, validation.minLength);
    if (validation.maxLength) newSchema = addMaxLength(newSchema, validation.maxLength);
    return newSchema;
  };
  return {
    addMinLength,
    addMaxLength,
    addMinValue,
    addMaxValue,
    addNullish,
    addStringRequired,
    addRequired,
    addMultipleValidation,
    getNumberValidation,
    getStringValidation,
  };
};
