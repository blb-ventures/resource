export type FieldChoice = {
  group?: string | null;
  label: string;
  value: any;
};

export type BaseFieldValidation = {
  required: boolean;
};

export type DecimalFieldValidation = {
  decimalPlaces?: number | null;
  maxDigits?: number | null;
  maxValue?: number | null;
  minValue?: number | null;
  required: boolean;
};

export type IntFieldValidation = {
  maxValue?: number | null;
  minValue?: number | null;
  required: boolean;
};

export type StringFieldValidation = {
  maxLength?: number | null;
  minLength?: number | null;
  required: boolean;
};

export type FieldValidation =
  | BaseFieldValidation
  | DecimalFieldValidation
  | IntFieldValidation
  | StringFieldValidation;

export interface APIField<FieldKey extends string = string> {
  choices?: FieldChoice[] | null;
  defaultValue?: any;
  filterable?: boolean;
  helpText?: string | null;
  kind: FieldKey;
  label: string;
  multiple?: boolean;
  name: string;
  orderable?: boolean;
  resource?: string | null;
  validation?: FieldValidation;
}

export interface Field<
  FieldKey extends string = string,
  Props = any,
  RenderResult = any,
  ValidationResult = any,
> {
  choices?: FieldChoice[] | null;
  defaultValue?: any;
  filterable?: boolean;
  helpText?: string | null;
  kind: FieldKey;
  label: string;
  multiple?: boolean;
  name: string;
  orderable?: boolean;
  resource?: string | null;
  validation?: FieldValidation;
  display(value: unknown): string | null;
  getFormField?: (props: Props) => RenderResult | null;
  getValidation?: () => ValidationResult | null;
  validate?: () => null | false | string;
}

export type APIFieldObject<
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
> = {
  fields:
    | (APIField<FieldKey> | APIFieldObject<FieldKey, FieldObjectKey>)[]
    | Record<string, APIField<FieldKey> | APIFieldObject<FieldKey, FieldObjectKey>>;
  label: string;
  name: string;
  objKind: FieldObjectKey;
};

export interface FieldObject<
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
  Props = any,
  RenderResult = any,
  ValidationResult = any,
> {
  fields: ResourceField<FieldKey, FieldObjectKey>[];
  label: string;
  name: string;
  objKind: FieldObjectKey;
  display(value: unknown): string | null;
  getFormField?: (props: Props) => RenderResult | null;
  getValidation?: () => ValidationResult | null;
  validate?: () => null | false | string;
}

export type ResourceField<
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
  Props = any,
  RenderResult = any,
  ValidationResult = any,
> =
  | Field<FieldKey, Props, RenderResult, ValidationResult>
  | FieldObject<FieldKey, FieldObjectKey, Props, RenderResult, ValidationResult>;

export type APIResourceField<
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
> = APIField<FieldKey> | APIFieldObject<FieldKey, FieldObjectKey>;

export type ResourceFieldOrKey<
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
> = ResourceField<FieldKey, FieldObjectKey> | FieldKey;

export type FieldConstructor = new <
  FieldKey extends string = string,
  Props extends Record<string, unknown> = Record<string, unknown>,
  RenderResult = any,
>(
  field: APIField<FieldKey>,
) => Field<FieldKey, Props, RenderResult>;

export type FieldObjectConstructor<
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
  Props extends Record<string, unknown> = Record<string, unknown>,
  RenderResult = any,
> = new (field: APIFieldObject<FieldKey, FieldObjectKey>) => FieldObject<
  FieldKey,
  FieldObjectKey,
  Props,
  RenderResult
>;

export type DisplayAdapter<
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
  Props = any,
  RenderResult = any,
  ValidationResult = any,
> = (
  field: ResourceField<FieldKey, FieldObjectKey, Props, RenderResult, ValidationResult>,
  value: unknown,
) => string | null;
export type FormAdapter<
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
  Props = any,
  RenderResult = any,
  ValidationResult = any,
> = (
  field: ResourceField<FieldKey, FieldObjectKey, Props, RenderResult, ValidationResult>,
  props: Props,
) => RenderResult | null;
export type ValidationAdapter<
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
  Props = any,
  RenderResult = any,
  ValidationResult = any,
> = (
  field: ResourceField<FieldKey, FieldObjectKey, Props, RenderResult, ValidationResult>,
) => ValidationResult | null;
