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

export type APIResources = Record<string, APIResource>;

export interface APIResource {
  fields: Record<string, APIFieldUnion>;
  name: string;
}

export type APIFieldUnion = APIField | APIFieldObject;

export interface APIField {
  choices?: readonly FieldChoice[] | FieldChoice[] | null;
  defaultValue?: any;
  filterable?: boolean;
  helpText?: string | null;
  kind: string;
  label: string;
  multiple?: boolean;
  name: string;
  orderable?: boolean;
  resource?: string | null;
  validation?: FieldValidation;
}

export interface APIFieldObject {
  label: string;
  name: string;
  objKind: string;
  objType: string;
}
