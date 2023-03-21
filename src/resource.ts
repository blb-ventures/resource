/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/brace-style */

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

type Resources<
  Keys extends string,
  FieldKinds extends string = string,
  FieldObjectKey extends string = string,
> = Record<Keys, Record<string, ResourceField<FieldKinds, FieldObjectKey, Keys>>>;

export class FieldObjectImpl<
  FieldObjectKinds extends string = string,
  ResourcesKeys extends string = string,
  Props = any,
  RenderResult = any,
  ValidationResult = any,
> implements FieldObject<FieldObjectKinds, ResourcesKeys, Props, RenderResult, ValidationResult>
{
  label: string;
  name: string;
  objKind: FieldObjectKinds;
  objType: ResourcesKeys;

  constructor(field: APIFieldObject<FieldObjectKinds>) {
    this.label = field.label;
    this.name = field.name;
    this.objKind = field.objKind;
    this.objType = field.objType as ResourcesKeys;
  }

  display(_: unknown): string {
    return '';
  }
}

// TODO: add support for custom field matcher
export class ResourcesManager<
  const APIResources extends Record<string, APIResource<FieldKinds, FieldObjectKinds>>,
  FieldKinds extends string = string,
  FieldObjectKinds extends string = string,
  ResourceKeys extends keyof APIResource = keyof APIResource,
> {
  fieldByKind: Partial<Record<FieldKinds, FieldConstructor>>;
  private DefaultField: FieldConstructor;
  private DefaultFieldObject: FieldObjectConstructor<FieldObjectKinds, ResourceKeys>;
  private validationAdapter?: ValidationAdapter<FieldKinds, FieldObjectKinds, ResourceKeys>;
  private formAdapter?: FormAdapter<FieldKinds, FieldObjectKinds, ResourceKeys>;
  private resources: Resources<ResourceKeys, FieldKinds, FieldObjectKinds>;

  constructor(
    resources: APIResources,
    options: {
      fieldByKind: Partial<Record<FieldKinds, FieldConstructor>>;
      defaultField?: FieldConstructor;
      defaultFieldObject?: FieldObjectConstructor<FieldObjectKinds, ResourceKeys>;
      validationAdapter?: ValidationAdapter<FieldKinds, FieldObjectKinds, ResourceKeys>;
      formAdapter?: FormAdapter<FieldKinds, FieldObjectKinds, ResourceKeys>;
    },
  ) {
    this.resources = this.processResources(resources);
    this.fieldByKind = options.fieldByKind;
    this.DefaultField = options.defaultField ?? (FieldImpl as FieldConstructor);
    this.DefaultFieldObject =
      options.defaultFieldObject ??
      (FieldObjectImpl as FieldObjectConstructor<FieldObjectKinds, ResourceKeys>);
    this.validationAdapter = options.validationAdapter;
    this.formAdapter = options.formAdapter;
  }

  private processResources(
    apiResources: APIResources,
  ): Resources<ResourceKeys, FieldKinds, FieldObjectKinds> {
    const resources = Object.entries(apiResources).reduce<
      Resources<ResourceKeys, FieldKinds, FieldObjectKinds>
    >((acc, [resourceKey, resource]) => {
      acc[resourceKey as ResourceKeys] = Object.entries(resource).reduce<
        Record<string, ResourceField<FieldKinds, FieldObjectKinds, ResourceKeys>>
      >(
        (acc2, [fieldKey, field]) => ({
          ...acc2,
          [fieldKey]: this.getFieldInstance(
            field as APIResourceField<FieldKinds, FieldObjectKinds, ResourceKeys>,
          ),
        }),
        {},
      );
      return acc;
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    }, {} as Resources<ResourceKeys, FieldKinds, FieldObjectKinds>);
    return resources;
  }

  getFieldInstance<
    Props extends Record<string, unknown> = Record<string, unknown>,
    RenderResult = any,
  >(field: APIResourceField<FieldKinds, FieldObjectKinds, ResourceKeys>) {
    if (isAPIField(field)) {
      const FieldClass =
        field.kind in this.fieldByKind && this.fieldByKind[field.kind as FieldKinds] != null
          ? this.fieldByKind[field.kind as FieldKinds] ?? this.DefaultField
          : this.DefaultField;
      return new FieldClass<FieldKinds, Props, RenderResult>(field);
    }
    return new this.DefaultFieldObject(field);
  }

  getField(path: ResourceFieldPath<APIResources>) {
    const [resourceName, fieldName, subFieldName] = path.split('.') as [
      string,
      string | null,
      string | null,
    ];
    const resource = this.resources[resourceName as ResourceKeys];
    if (fieldName == null) return null;
    const field = resource[fieldName];
    if (subFieldName == null || field == null || isAPIField(field)) return field;
    const refType = this.resources[field.objType as ResourceKeys];
    return Array.isArray(refType)
      ? refType.find(f => f.name === subFieldName)
      : refType[subFieldName];
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

  kindDisplay(value: unknown, field: FieldKinds) {
    return this.getKindDisplay(field)(value);
  }

  getKindDisplay(kind: FieldKinds, label?: string) {
    const fieldInstance = this.getFieldInstance({ kind, label: label ?? '', name: '' });
    return fieldInstance.display;
  }

  fieldDisplay(
    value: unknown,
    field: APIResourceField<FieldKinds, FieldObjectKinds, ResourceKeys>,
  ) {
    return this.getFieldDisplayFn(field)(value);
  }

  getFieldDisplayFn(field: APIResourceField<FieldKinds, FieldObjectKinds, ResourceKeys>) {
    const fieldInstance = this.getFieldInstance(field);
    return fieldInstance.display;
  }

  getFieldFormField<
    Props extends Record<string, unknown> = Record<string, unknown>,
    RenderResult = any,
  >(
    props: Props,
    field: APIResourceField<FieldKinds, FieldObjectKinds, ResourceKeys>,
  ): RenderResult {
    const fieldInstance = this.getFieldInstance(field);
    return fieldInstance.getFormField?.(props) ?? this.formAdapter?.(fieldInstance, props);
  }

  getFieldValidation(
    field: APIResourceField<FieldKinds, FieldObjectKinds, ResourceKeys>,
  ): FieldValidation | null {
    const fieldInstance = this.getFieldInstance(field);
    return (
      fieldInstance.getValidation?.() ??
      this.validationAdapter?.(fieldInstance, {
        getResourceFields: this.getResourceFields.bind(this),
      })
    );
  }

  getResourceFields(resource: ResourceKeys) {
    return Object.values(this.resources[resource]);
  }
}
