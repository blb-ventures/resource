/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

import {
  APIField,
  APIFieldObject,
  APIResource,
  APIResourceField,
  Field,
  FieldChoice,
  FieldConstructor,
  FieldObject,
  FieldObjectConstructor,
  FieldValidation,
  FormAdapter,
  ResourceField,
  ResourceFieldPath,
  ValidationAdapter,
} from './resource.interface';
import { isAPIField } from './resource.typeguards';

export class FieldImpl<
  FieldKinds extends string = string,
  Props = any,
  RenderResult = any,
  ValidationResult = any,
> implements Field<FieldKinds, Props, RenderResult, ValidationResult>
{
  choices?: FieldChoice[] | null;
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

  constructor(field: APIField<FieldKinds>) {
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

type Resources<Keys extends PropertyKey, FieldKinds extends string = string, FieldObjectKey extends string = string> = Record<Keys, Record<string, ResourceField<FieldKinds, FieldObjectKey>>>;

export class FieldObjectImpl<
  FieldObjectKinds extends string = string,
  Props = any,
  RenderResult = any,
  ValidationResult = any,
> implements FieldObject<FieldObjectKinds, Props, RenderResult, ValidationResult>
{
  label: string;
  name: string;
  objKind: FieldObjectKinds;
  objType: string;

  constructor(field: APIFieldObject<FieldObjectKinds>) {
    this.label = field.label;
    this.name = field.name;
    this.objKind = field.objKind;
    this.objType = field.objType;
  }

  display(value: unknown): string {
    return '';
  }
}

// TODO: add support for custom field matcher
export class ResourcesManager<
  const APIResources extends Record<string, APIResource<FieldKinds, FieldObjectKinds>>,
  FieldKinds extends string = string,
  FieldObjectKinds extends string = string,
> {
  fieldByKind: Partial<Record<FieldKinds, FieldConstructor>>;
  private DefaultField: FieldConstructor;
  private DefaultFieldObject: FieldObjectConstructor<FieldObjectKinds, keyof APIResources>;
  private validationAdapter?: ValidationAdapter<FieldKinds, FieldObjectKinds>;
  private formAdapter?: FormAdapter<FieldKinds, FieldObjectKinds>;
  private resources: Resources<keyof APIResources, FieldKinds, FieldObjectKinds>;

  constructor(
    resources: APIResources,
    options: {
      fieldByKind: Partial<Record<FieldKinds, FieldConstructor>>;
      defaultField?: FieldConstructor;
      defaultFieldObject?: FieldObjectConstructor<FieldObjectKinds, keyof APIResources>;
      validationAdapter?: ValidationAdapter<FieldKinds, FieldObjectKinds>;
      formAdapter?: FormAdapter<FieldKinds, FieldObjectKinds>;
    },
  ) {
    this.resources = this.processResources(resources);
    this.fieldByKind = options.fieldByKind;
    this.DefaultField = options.defaultField ?? (FieldImpl as FieldConstructor);
    this.DefaultFieldObject =
      options.defaultFieldObject ??
      (FieldObjectImpl as FieldObjectConstructor<FieldObjectKinds, keyof APIResources>);
    this.validationAdapter = options.validationAdapter;
    this.formAdapter = options.formAdapter;
  }

  private processResources(apiResources: APIResources): Resources<keyof APIResources, FieldKinds, FieldObjectKinds> {
    const resources = Object.entries(apiResources).reduce((acc, [resourceKey, resource]) => {
      acc[resourceKey as keyof APIResources] = Object.entries(resource).reduce((acc2, [fieldKey, field]) => {
        acc2[fieldKey] = this.getFieldInstance(field);
        return acc2;
      }, {} as Record<string, ResourceField<FieldKinds, FieldObjectKinds>>);
      return acc;
    }, {} as Resources<keyof APIResources, FieldKinds, FieldObjectKinds>);
    return resources;
  }

  getFieldInstance<
    Props extends Record<string, unknown> = Record<string, unknown>,
    RenderResult = any,
  >(field: APIResourceField<FieldKinds, FieldObjectKinds, keyof APIResources>): Field<FieldKinds, Props, RenderResult> | FieldObject<FieldObjectKinds, Record<string, unknown>, any> {
    if (isAPIField(field)) {
      const FieldClass =
        field.kind in this.fieldByKind && this.fieldByKind[field.kind as FieldKinds] != null
          ? this.fieldByKind[field.kind as FieldKinds] as FieldConstructor
          : this.DefaultField;
      return new FieldClass<FieldKinds, Props, RenderResult>(field);
    }
    return new this.DefaultFieldObject(field);
  }

  getField(path: ResourceFieldPath<APIResources>) {
    const [resourceName, fieldName, subFieldName] = path.split('.') as [string, string | null, string | null];
    const resource = this.resources[resourceName];
    if(resource == null || fieldName == null) return null;
    const field = Array.isArray(resource) ? resource.find(f => f.name === fieldName) : resource[fieldName];
    if(subFieldName == null || field == null || isAPIField(field)) return field;
    const refType = this.resources[field.objType];
    return Array.isArray(refType) ? refType.find(f => f.name === subFieldName) : refType[subFieldName];
  }

  display(value: unknown, path: ResourceFieldPath<APIResources>) {
    const field = this.getField(path);
    return field != null ? this.fieldDisplay(value, field) : null;
  }

  getDisplayFn(path: ResourceFieldPath<APIResources>) {
    const field = this.getField(path);
    return field != null ? this.getFieldDisplayFn(field) : null;
  }

  getFormField<Props extends Record<string, unknown> = Record<string, unknown>, RenderResult = any>(
    props: Props,
    path: ResourceFieldPath<APIResources>,
  ): RenderResult | null {
    const field = this.getField(path);
    return field != null ? this.getFieldFormField(props, field) : null;
  }

  getValidation(path: ResourceFieldPath<APIResources>): FieldValidation | null {
    const field = this.getField(path);
    return field != null ? this.getFieldValidation(field) : null;
  }

  fieldDisplay(value: unknown, field: APIResourceField<FieldKinds, FieldObjectKinds> | FieldKinds) {
    return this.getFieldDisplayFn(field)(value);
  }

  getFieldDisplayFn(field: APIResourceField<FieldKinds, FieldObjectKinds> | FieldKinds) {
    const fieldInstance =
      typeof field === 'string'
        ? this.fieldByKind[field] != null
          ? new this.fieldByKind[field]!({ kind: field as FieldKinds, label: '', name: '' })
          : new this.DefaultField({ kind: field as FieldKinds, label: '', name: '' })
        : this.getFieldInstance(field);
    return fieldInstance.display;
  }

  getFieldFormField<Props extends Record<string, unknown> = Record<string, unknown>, RenderResult = any>(
    props: Props,
    field: APIResourceField<FieldKinds, FieldObjectKinds>,
  ): RenderResult {
    const fieldInstance = this.getFieldInstance(field);
    return fieldInstance.getFormField?.(props) ?? this.formAdapter?.(fieldInstance, props);
  }

  getFieldValidation(field: APIResourceField<FieldKinds, FieldObjectKinds>): FieldValidation | null {
    const fieldInstance = this.getFieldInstance(field);
    return fieldInstance.getValidation?.() ?? this.validationAdapter?.(fieldInstance);
  }
}
