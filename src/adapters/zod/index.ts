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
  ZodType,
  ZodTypeAny,
} from 'zod';
import {
  DecimalFieldValidation,
  Field,
  FieldValidation,
  IntFieldValidation,
  ResourceField,
  StringFieldValidation,
  ValidationAdapter,
} from '../../resource.interface';
import {
  isBrowserFile,
  isField,
  isFieldObject,
  isNumberValidation,
  isStringValidation,
} from '../../resource.typeguards';

/* eslint-disable id-blacklist */
export const FIELD_KIND = {
  BOOLEAN: 'BOOLEAN',
  CURRENCY: 'CURRENCY',
  DATE: 'DATE',
  DATETIME: 'DATETIME',
  DECIMAL: 'DECIMAL',
  DISTANCE: 'DISTANCE',
  EMAIL: 'EMAIL',
  FILE: 'FILE',
  FLOAT: 'FLOAT',
  GEOPOINT: 'GEOPOINT',
  ID: 'ID',
  IMAGE: 'IMAGE',
  INT: 'INT',
  IP: 'IP',
  JSON: 'JSON',
  LEGAL_PERSON_DOC: 'LEGAL_PERSON_DOC',
  MULTILINE: 'MULTILINE',
  NATURAL_PERSON_DOC: 'NATURAL_PERSON_DOC',
  PASSWORD: 'PASSWORD',
  PERCENT: 'PERCENT',
  PHONE: 'PHONE',
  POINT: 'POINT',
  POLYGON: 'POLYGON',
  POSTAL_CODE: 'POSTAL_CODE',
  STRING: 'STRING',
  STRING_LIST: 'STRING_LIST',
  TIME: 'TIME',
  TIMEDELTA: 'TIMEDELTA',
  URL: 'URL',
  UUID: 'UUID',
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

export interface ZodAdapterOptions<FieldKinds extends string, FieldObjectKinds extends string> {
  // Defines base validation for the kinds. Other validations will be added on top of it to handle
  // multiple (array) and type validation requirements
  rulesByKind?: Record<
    string,
    (field: Field<FieldKinds, FieldObjectKinds>, schema: ZodType) => ZodTypeAny
  >;
  // Defines final validation for the kinds. Needs to handle multiple (array) and type validation.
  rulesByKindRaw?: Record<string, (field: Field<FieldKinds, FieldObjectKinds>) => ZodTypeAny>;
  acceptedImageMimeType?: string[];
  localization?: {
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
  <
    ResourcesKeys extends string,
    FieldKinds extends string = string,
    FieldObjectKinds extends string = string,
  >(
    options?: ZodAdapterOptions<FieldKinds, FieldObjectKinds>,
  ): ValidationAdapter<FieldKinds, FieldObjectKinds, ResourcesKeys, never, ZodTypeAny> =>
  (field, context) => {
    if (isField(field)) return getFieldRules(field, options);
    if (isFieldObject(field)) {
      return getFieldRecordRules(
        context.getResourceFields(field.objType as ResourcesKeys),
        options,
      );
    }
    return null;
  };

export const getFieldRules = <
  FieldKinds extends string = FieldKind,
  FieldObjectKinds extends string = string,
>(
  field: ResourceField<FieldKinds, FieldObjectKinds>,
  options?: ZodAdapterOptions<FieldKinds, FieldObjectKinds>,
  validation?: FieldValidation,
) => {
  const utils = getValidationUtils(options);

  // Handle other levels of field objects
  if (isFieldObject(field)) {
    // NOTE: should we handle every level?
    return z.any();
  }

  if (options?.rulesByKindRaw != null && field.kind in options.rulesByKindRaw) {
    return options.rulesByKindRaw[field.kind](field);
  }

  const fieldValidation = validation ?? field.validation;
  if (fieldValidation == null) return z.any();

  if (isNumberValidation(fieldValidation)) {
    return utils.addMultipleValidation(utils.getNumberValidation(fieldValidation), field.multiple);
  }

  const baseZod =
    options?.localization?.invalidType != null || options?.localization?.required != null
      ? {
          invalid_type_error: options.localization.invalidType,
          required_error: options.localization.required,
        }
      : undefined;
  let schema: ValidationZodKinds = z.string(baseZod);
  if (field.kind in getFieldKindRules) {
    const fieldKindValidator = getFieldKindRules(fieldValidation, options)[field.kind];
    schema = fieldKindValidator;
  }
  if (options?.rulesByKind != null && field.kind in options.rulesByKind) {
    schema = options.rulesByKind[field.kind](field, schema);
  }
  schema = utils.addRequired(fieldValidation.required, schema);
  if (schema instanceof ZodString && isStringValidation(fieldValidation)) {
    schema = utils.getStringValidation(schema, fieldValidation);
  }
  return utils.addMultipleValidation(schema, field.multiple);
};

export const getFieldRecordRules = <
  FieldKinds extends string = FieldKind,
  FieldObjectKinds extends string = string,
>(
  fields: ResourceField<FieldKinds, FieldObjectKinds>[],
  options?: ZodAdapterOptions<FieldKinds, FieldObjectKinds>,
): ZodObject<ZodRawShape> =>
  z.object(
    fields.reduce<ZodRawShape>(
      (acc, it) => ({ ...acc, [it.name]: getFieldRules(it, options) }),
      {},
    ),
  );

export const getFieldsRules = <
  FieldKinds extends string = FieldKind,
  FieldObjectKinds extends string = string,
  ResourceKeys extends string = string,
  RenderResult = never,
  ValidationResult = ZodTypeAny,
>(
  fields: ResourceField<
    FieldKinds,
    FieldObjectKinds,
    ResourceKeys,
    RenderResult,
    ValidationResult
  >[],
) => fields.reduce<ZodRawShape>((acc, it) => ({ ...acc, [it.name]: getFieldRules(it) }), {});

export const isSupportedImage = (allowedImageFormat: string[]) => (input: unknown) =>
  input == null || (isBrowserFile(input) && allowedImageFormat.includes(input.type));

export const isRequired = (validation: FieldValidation) => (input: unknown) =>
  validation.required && input != null;

const getFieldKindRules = <
  FieldKey extends string = FieldKind,
  FieldObjectKey extends string = string,
>(
  validation: FieldValidation,
  options?: ZodAdapterOptions<FieldKey, FieldObjectKey>,
) => {
  const baseZod =
    options?.localization?.invalidType != null || options?.localization?.required != null
      ? {
          invalid_type_error: options.localization.invalidType,
          required_error: options.localization.required,
        }
      : undefined;
  return {
    [FIELD_KIND.EMAIL]: z.string(baseZod).email(options?.localization?.email),
    [FIELD_KIND.DATE]: z.date(baseZod),
    [FIELD_KIND.DATETIME]: z.date(baseZod),
    [FIELD_KIND.TIME]: z.date(baseZod),
    [FIELD_KIND.URL]: z.string(baseZod).url(options?.localization?.url),
    [FIELD_KIND.BOOLEAN]: z.boolean(baseZod),
    [FIELD_KIND.ID]: z
      .any()
      .transform(it => (typeof it === 'string' ? it : it?.id ?? null))
      .refine((it: unknown) => it != null, options?.localization?.invalidType),
    [FIELD_KIND.IMAGE]: z
      .any()
      .refine(isRequired(validation))
      .refine(input => input == null || isBrowserFile(input), options?.localization?.invalidType)
      .refine(
        isSupportedImage(options?.acceptedImageMimeType ?? DEFAULT_ACCEPTED_IMAGE_MIME_TYPES),
        options?.localization?.allowedImageFormat,
      ),
    [FIELD_KIND.FILE]: z
      .any()
      .refine(isRequired(validation))
      .refine(file => isBrowserFile(file), options?.localization?.invalidType),
  };
};

export const getValidationUtils = <
  FieldKey extends string = FieldKind,
  FieldObjectKey extends string = string,
>(
  options?: ZodAdapterOptions<FieldKey, FieldObjectKey>,
) => {
  const addMinLength = (schema: ZodString, min: number, message?: string) =>
    schema.min(min, message ?? options?.localization?.minLength?.(min));
  const addMaxLength = (schema: ZodString, max: number, message?: string) =>
    schema.max(max, message ?? options?.localization?.maxLength?.(max));
  const addMinValue = (schema: ZodNumber, min: number, message?: string) =>
    schema.min(min, message ?? options?.localization?.minValue?.(min));
  const addMaxValue = (schema: ZodNumber, max: number, message?: string) =>
    schema.max(max, message ?? options?.localization?.maxValue?.(max));
  const addNullish = <T extends ZodTypeAny>(schema: T) => schema.nullish();
  const addStringRequired = (schema: ZodString, message?: string) =>
    schema.min(1, message ?? options?.localization?.required);
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
    if (!validation.required) schema = addNullish(schema).unwrap();
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
