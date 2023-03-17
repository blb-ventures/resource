/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

import {
  APIField,
  APIFieldObject,
  APIResourceField,
  Field,
  FieldChoice,
  FieldConstructor,
  FieldObject,
  FieldObjectConstructor,
  FieldValidation,
  FormAdapter,
  ValidationAdapter,
} from './resource.interface';
import { isAPIField } from './resource.typeguards';

export class FieldImpl<
  FieldKey extends string = string,
  Props = any,
  RenderResult = any,
  ValidationResult = any,
> implements Field<FieldKey, Props, RenderResult, ValidationResult>
{
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

  constructor(field: APIField<FieldKey>) {
    this.choices = field.choices;
    this.defaultValue = field.defaultValue;
    this.filterable = field.filterable;
    this.helpText = field.helpText;
    this.kind = field.kind;
    this.label = field.label;
    this.multiple = field.multiple;
    this.name = field.name;
    this.orderable = field.orderable;
    this.resource = field.resource;
    this.validation = field.validation;
  }

  display(value: unknown): string | null {
    if (this.choices) {
      const choice = this.choices.find(c => c.value === value);
      return choice?.label ?? (value as string);
    }
    return value != null ? String(value) : null;
  }
}

export class FieldObjectImpl<
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
  Props = any,
  RenderResult = any,
  ValidationResult = any,
> implements FieldObject<FieldKey, FieldObjectKey, Props, RenderResult, ValidationResult>
{
  fields: (Field<FieldKey> | FieldObject<FieldKey, FieldObjectKey>)[];
  fieldsByName: Record<string, Field<FieldKey> | FieldObject<FieldKey, FieldObjectKey>>;
  label: string;
  name: string;
  objKind: FieldObjectKey;

  constructor(field: APIFieldObject<FieldKey, FieldObjectKey>) {
    const fields = Array.isArray(field.fields) ? field.fields : Object.values(field.fields);
    this.fields = fields.map(f =>
      isAPIField<FieldKey, FieldObjectKey>(f)
        ? new FieldImpl(f)
        : new FieldObjectImpl<FieldKey, FieldObjectKey>(f),
    );
    this.fieldsByName = this.fields.reduce((acc, f) => {
      acc[f.name] = f;
      return acc;
    }, {} as Record<string, Field<FieldKey> | FieldObject<FieldKey, FieldObjectKey>>);
    this.label = field.label;
    this.name = field.name;
    this.objKind = field.objKind;
  }

  display(value: unknown): string {
    return this.fields.map(f => `${f.label} = ${f.display(value) ?? ''}`).join('\n');
  }
}

// TODO: add support for custom field matcher (and save all registered fields)
export class ResourcesManager<
  FieldKey extends string = string,
  FieldObjectKey extends string = string,
> {
  fieldByKind: Partial<Record<FieldKey, FieldConstructor>>;
  private DefaultField: FieldConstructor;
  private DefaultFieldObject: FieldObjectConstructor<FieldKey, FieldObjectKey>;
  private validationAdapter?: ValidationAdapter<FieldKey, FieldObjectKey>;
  private formAdapter?: FormAdapter<FieldKey, FieldObjectKey>;

  constructor(options: {
    fieldByKind: Partial<Record<FieldKey, FieldConstructor>>;
    defaultField?: FieldConstructor;
    defaultFieldObject?: FieldObjectConstructor<FieldKey, FieldObjectKey>;
    validationAdapter?: ValidationAdapter<FieldKey, FieldObjectKey>;
    formAdapter?: FormAdapter<FieldKey, FieldObjectKey>;
  }) {
    this.fieldByKind = options.fieldByKind;
    this.DefaultField = options.defaultField ?? (FieldImpl as FieldConstructor);
    this.DefaultFieldObject =
      options.defaultFieldObject ??
      (FieldObjectImpl as FieldObjectConstructor<FieldKey, FieldObjectKey>);
    this.validationAdapter = options.validationAdapter;
    this.formAdapter = options.formAdapter;
  }

  getFieldInstance<
    Props extends Record<string, unknown> = Record<string, unknown>,
    RenderResult = any,
  >(field: APIResourceField<FieldKey, FieldObjectKey>) {
    if (isAPIField(field)) {
      const FieldClass =
        field.kind in this.fieldByKind && this.fieldByKind[field.kind as FieldKey] != null
          ? this.fieldByKind[field.kind as FieldKey]
          : this.DefaultField;
      return new FieldClass!<FieldKey, Props, RenderResult>(field);
    }
    return new this.DefaultFieldObject(field);
  }

  display(value: unknown, field: APIResourceField<FieldKey, FieldObjectKey> | FieldKey) {
    const fieldInstance =
      typeof field === 'string'
        ? this.fieldByKind[field] != null
          ? new this.fieldByKind[field]!({ kind: field as FieldKey, label: '', name: '' })
          : new this.DefaultField({ kind: field as FieldKey, label: '', name: '' })
        : this.getFieldInstance(field);
    return fieldInstance.display(value);
  }

  getFormField<Props extends Record<string, unknown> = Record<string, unknown>, RenderResult = any>(
    props: Props,
    field: APIResourceField<FieldKey, FieldObjectKey>,
  ): RenderResult {
    const fieldInstance = this.getFieldInstance(field);
    return fieldInstance.getFormField?.(props) ?? this.formAdapter?.(fieldInstance, props);
  }

  getValidation(field: APIResourceField<FieldKey, FieldObjectKey>): FieldValidation | null {
    const fieldInstance = this.getFieldInstance(field);
    return fieldInstance.getValidation?.() ?? this.validationAdapter?.(fieldInstance);
  }
}
