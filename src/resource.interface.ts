export interface FieldChoice {
  group?: string | null;
  label: string;
  value: string;
}

export interface BaseFieldValidation {
  required: boolean;
}

export interface DecimalFieldValidation {
  decimalPlaces?: number | null;
  maxDigits?: number | null;
  maxValue?: number | null;
  minValue?: number | null;
  required: boolean;
}

export interface IntFieldValidation {
  maxValue?: number | null;
  minValue?: number | null;
  required: boolean;
}

export interface StringFieldValidation {
  maxLength?: number | null;
  minLength?: number | null;
  required: boolean;
}

export type FieldValidation =
  | BaseFieldValidation
  | DecimalFieldValidation
  | IntFieldValidation
  | StringFieldValidation;

// API Types
export type APIResource<
  FieldKinds extends string = string,
  FieldObjectKinds extends string = string,
  ResourceKey extends string = string,
> = Record<string, APIResourceField<FieldKinds, FieldObjectKinds, ResourceKey>>;

export interface APIField<FieldKinds extends string = string> {
  choices?: readonly FieldChoice[] | FieldChoice[] | null;
  defaultValue?: any;
  filterable?: boolean;
  helpText?: string | null;
  kind: FieldKinds;
  label: string;
  multiple?: boolean;
  name: string;
  orderable?: boolean;
  resource?: string | null;
  validation?: FieldValidation;
}

export interface APIFieldObject<
  FieldObjectKinds extends string = string,
  ResourceKey extends string = string,
> {
  label: string;
  name: string;
  objKind: FieldObjectKinds;
  objType: ResourceKey;
}

export type APIResourceField<
  FieldKinds extends string = string,
  FieldObjectKinds extends string = string,
  ResourceKey extends string = string,
> = APIField<FieldKinds> | APIFieldObject<FieldObjectKinds, ResourceKey>;

// Class Interfaces

// NOTE: Do we need to be able to attach/customize behavior based on the Resource?
// export interface Resource <FieldKinds extends string = string> {
//   name: string;
//   fields: Record<string, ResourceField<FieldKinds>>;
//   fieldsByKind: Partial<Record<FieldKinds, FieldConstructor>>;
// }

export interface BaseField<RenderResult = any, ValidationResult = any, Props = any> {
  label: string;
  name: string;
  display(value: unknown): string | null;
  getFormField?: (props: Props) => RenderResult | null;
  getValidation?: () => ValidationResult | null;
  validate?: () => null | false | string;
}

export interface Field<
  FieldKinds extends string = string,
  RenderResult = any,
  ValidationResult = any,
  Props = any,
> extends BaseField<RenderResult, ValidationResult, Props> {
  choices?: FieldChoice[] | null;
  defaultValue?: any;
  filterable?: boolean;
  helpText?: string | null;
  kind: FieldKinds;
  multiple?: boolean;
  orderable?: boolean;
  resource?: string | null;
  validation?: FieldValidation;
}

export interface FieldObject<
  FieldObjectKinds extends string = string,
  ResourcesKeys extends string = string,
  RenderResult = any,
  ValidationResult = any,
  Props = any,
> extends BaseField<RenderResult, ValidationResult, Props> {
  objKind: FieldObjectKinds;
  objType: ResourcesKeys;
}

export type ResourceField<
  FieldKinds extends string = string,
  FieldObjectKinds extends string = string,
  ResourcesKeys extends string = string,
  RenderResult = any,
  ValidationResult = any,
  Props = any,
> =
  | Field<FieldKinds, RenderResult, ValidationResult, Props>
  | FieldObject<FieldObjectKinds, ResourcesKeys, RenderResult, ValidationResult, Props>;

// Constructors

export type FieldConstructor = new <
  FieldKinds extends string = string,
  RenderResult = any,
  ValidationResult = any,
  Props extends Record<string, unknown> = Record<string, unknown>,
>(
  field: APIField<FieldKinds>,
) => Field<FieldKinds, RenderResult, ValidationResult, Props>;

export type FieldObjectConstructor = new <
  FieldObjectKinds extends string = string,
  ResourcesKeys extends string = string,
  RenderResult = any,
  ValidationResult = any,
  Props extends Record<string, unknown> = Record<string, unknown>,
>(
  field: APIFieldObject<FieldObjectKinds, ResourcesKeys>,

  // Adapters,
) => FieldObject<FieldObjectKinds, ResourcesKeys, RenderResult, ValidationResult, Props>;

export type DisplayAdapter<
  FieldKinds extends string = string,
  FieldObjectKinds extends string = string,
  ResourcesKeys extends string = string,
  RenderResult = any,
  ValidationResult = any,
  Props = any,
> = (
  field: ResourceField<
    FieldKinds,
    FieldObjectKinds,
    ResourcesKeys,
    RenderResult,
    ValidationResult,
    Props
  >,
  value: unknown,
) => string | null;

export type FormAdapter<
  FieldKinds extends string = string,
  FieldObjectKinds extends string = string,
  ResourcesKeys extends string = string,
  RenderResult = any,
  ValidationResult = any,
  Props = any,
> = (
  field: ResourceField<
    FieldKinds,
    FieldObjectKinds,
    ResourcesKeys,
    RenderResult,
    ValidationResult,
    Props
  >,
  props: Props,
) => RenderResult | null;

export interface ValidationContext<
  FieldKinds extends string = string,
  FieldObjectKinds extends string = string,
  ResourcesKeys extends string = string,
  RenderResult = any,
  ValidationResult = any,
  Props = any,
> {
  getResourceFields: (
    resource: ResourcesKeys,
  ) => ResourceField<
    FieldKinds,
    FieldObjectKinds,
    ResourcesKeys,
    RenderResult,
    ValidationResult,
    Props
  >[];
}

export type ValidationAdapter<
  FieldKinds extends string = string,
  FieldObjectKinds extends string = string,
  ResourcesKeys extends string = string,
  RenderResult = any,
  ValidationResult = any,
  Props = any,
> = (
  field: ResourceField<
    FieldKinds,
    FieldObjectKinds,
    ResourcesKeys,
    RenderResult,
    ValidationResult,
    Props
  >,
  context: ValidationContext<
    FieldKinds,
    FieldObjectKinds,
    ResourcesKeys,
    RenderResult,
    ValidationResult,
    Props
  >,
) => ValidationResult | null;

// Helpers

export type ResourceFieldObjectPath<
  T extends Record<string, APIResource>,
  Key extends keyof T & string = keyof T & string,
  SubKey extends keyof T[Key] = keyof T[Key],
> = SubKey extends string
  ? T[Key][SubKey] extends { objType: keyof T; [key: string]: any }
    ? keyof T[T[Key][SubKey]['objType']] extends string
      ? `${Key}.${SubKey}.${keyof T[T[Key][SubKey]['objType']]}`
      : never
    : never
  : never;

export type ResourceFieldPath<
  T extends Record<string, APIResource>,
  Key extends keyof T = keyof T,
> = Key extends string
  ? keyof T[Key] extends string
    ? `${Key}.${keyof T[Key]}` | ResourceFieldObjectPath<T, Key, keyof T[Key]>
    : never
  : never;

export type PathToFlatRecord<
  Path extends string,
  Data,
> = Path extends `${string}.${infer Key}.${infer SubKey}`
  ? Record<Key, Record<SubKey, Data>>
  : Path extends `${string}.${infer Key}`
  ? Record<Key, Data>
  : Record<string, unknown>;

export type PathToNestedRecord<Data, Path extends string[]> = IntersectionToUnion<
  Path[number] extends `${string}.${infer Key}`
    ? Key extends `${infer MainKey}.${infer SubKey}`
      ? { [k in MainKey]: { [j in SubKey]: Data } }
      : {
          [k in Key]: Data;
        }
    : Record<string, any>
>;

export type IntersectionToUnion<T> = (T extends any ? (x: T) => any : never) extends (
  x: infer R,
) => any
  ? R
  : never;
