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
    this.choices = field.choices?.slice();
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
  FieldByKind extends Record<FieldKinds, FieldConstructor | null | undefined>,
  FieldObjectByKind extends Record<FieldObjectKinds, FieldObjectConstructor | null | undefined>,
  FieldObjectKinds extends keyof FieldObjectByKind & string,
  FieldKinds extends keyof FieldByKind & string,
  const APIResources extends Record<
    string,
    APIResource<FieldKinds, FieldObjectKinds, keyof APIResources & string>
  >,
> {
  fieldByKind: FieldByKind;
  fieldObjectByKind: FieldObjectByKind;
  private DefaultField: FieldConstructor;
  private DefaultFieldObject: FieldObjectConstructor;
  private validationAdapter?: ValidationAdapter<
    FieldKinds,
    FieldObjectKinds,
    keyof APIResources & string
  >;
  private formAdapter?: FormAdapter<FieldKinds, FieldObjectKinds, keyof APIResources & string>;
  resources: Resources<keyof APIResources & string, FieldKinds, FieldObjectKinds>;

  constructor(
    resources: APIResources,
    options: {
      fieldByKind: FieldByKind;
      fieldObjectByKind: FieldObjectByKind;
      defaultField?: FieldConstructor;
      defaultFieldObject?: FieldObjectConstructor;
      validationAdapter?: ValidationAdapter<
        FieldKinds,
        FieldObjectKinds,
        keyof APIResources & string
      >;
      formAdapter?: FormAdapter<FieldKinds, FieldObjectKinds, keyof APIResources & string>;
    },
  ) {
    this.fieldByKind = options.fieldByKind;
    this.fieldObjectByKind = options.fieldObjectByKind;
    this.DefaultField = options.defaultField ?? (FieldImpl as FieldConstructor);
    this.DefaultFieldObject =
    options.defaultFieldObject ?? (FieldObjectImpl as FieldObjectConstructor);
    this.validationAdapter = options.validationAdapter;
    this.formAdapter = options.formAdapter;
    this.resources = this.processResources(resources);
  }

  private processResources(
    apiResources: APIResources,
  ): Resources<keyof APIResources & string, FieldKinds, FieldObjectKinds> {
    const resources = Object.entries(apiResources).reduce<
      Resources<keyof APIResources & string, FieldKinds, FieldObjectKinds>
    >((resourcesAcc, [resourceKey, resource]) => {
      return {
        ...resourcesAcc,
        [resourceKey as keyof APIResources & string]: Object.entries(
          resource as APIResource,
        ).reduce<
          Record<string, ResourceField<FieldKinds, FieldObjectKinds, keyof APIResources & string>>
        >(
          (fields, [fieldKey, field]) => ({
            ...fields,
            [fieldKey]: this.getFieldInstance(
              field as APIResourceField<FieldKinds, FieldObjectKinds, keyof APIResources & string>,
            ),
          }),
          {},
        ),
      };
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    }, {} as Resources<keyof APIResources & string, FieldKinds, FieldObjectKinds>);
    return resources;
  }

  getFieldInstance<
    Props extends Record<string, unknown> = Record<string, unknown>,
    RenderResult = any,
  >(field: APIResourceField<FieldKinds, FieldObjectKinds, keyof APIResources & string>) {
    if (isAPIField(field)) {
      const FieldClass =
        field.kind in this.fieldByKind && this.fieldByKind[field.kind as FieldKinds] != null
          ? this.fieldByKind[field.kind as FieldKinds] ?? this.DefaultField
          : this.DefaultField;
      return new FieldClass<FieldKinds, Props, RenderResult>(field);
    }
    const FieldObjectClass =
      field.objKind in this.fieldObjectByKind &&
      this.fieldObjectByKind[field.objKind as FieldObjectKinds] != null
        ? this.fieldObjectByKind[field.objKind as FieldObjectKinds] ?? this.DefaultFieldObject
        : this.DefaultFieldObject;
    return new FieldObjectClass<FieldObjectKinds, keyof APIResources & string, Props, RenderResult>(
      field,
    );
  }

  getField(path: ResourceFieldPath<APIResources>) {
    const [resourceName, fieldName, subFieldName] = path.split('.') as [
      string,
      string,
      string | null,
    ];
    const resource = this.resources[resourceName as keyof APIResources & string];
    const field = resource[fieldName];
    if (subFieldName == null || isAPIField(field)) return field;
    const refType = this.resources[field.objType];
    return refType[subFieldName];
  }

  display(value: unknown, path: ResourceFieldPath<APIResources>): string | null {
    const field = this.getField(path);
    return this.fieldDisplay(value, field);
  }

  getDisplayFn(path: ResourceFieldPath<APIResources>) {
    const field = this.getField(path);
    return this.getFieldDisplayFn(field);
  }

  getFormField<Props extends Record<string, unknown> = Record<string, unknown>, RenderResult = any>(
    props: Props,
    path: ResourceFieldPath<APIResources>,
  ): RenderResult | null {
    const field = this.getField(path);
    return this.getFieldFormField(props, field);
  }

  getValidation(path: ResourceFieldPath<APIResources>): FieldValidation | null {
    const field = this.getField(path);
    return this.getFieldValidation(field);
  }

  kindDisplay(value: unknown, kind: FieldKinds): string | null {
    return this.getKindDisplay(kind)(value);
  }

  getKindDisplay(kind: FieldKinds, label?: string) {
    const fieldInstance = this.getFieldInstance({ kind, label: label ?? '', name: '' });
    return fieldInstance.display.bind(this);
  }

  fieldDisplay(
    value: unknown,
    field: APIResourceField<FieldKinds, FieldObjectKinds, keyof APIResources & string>,
  ): string | null {
    return this.getFieldDisplayFn(field)(value);
  }

  getFieldDisplayFn(
    field: APIResourceField<FieldKinds, FieldObjectKinds, keyof APIResources & string>,
  ) {
    const fieldInstance = this.getFieldInstance(field);
    return fieldInstance.display.bind(this);
  }

  getFieldFormField<
    Props extends Record<string, unknown> = Record<string, unknown>,
    RenderResult = any,
  >(
    props: Props,
    field: APIResourceField<FieldKinds, FieldObjectKinds, keyof APIResources & string>,
  ): RenderResult {
    const fieldInstance = this.getFieldInstance(field);
    return fieldInstance.getFormField?.(props) ?? this.formAdapter?.(fieldInstance, props);
  }

  getFieldValidation(
    field: APIResourceField<FieldKinds, FieldObjectKinds, keyof APIResources & string>,
  ): FieldValidation | null {
    const fieldInstance = this.getFieldInstance(field);
    return (
      fieldInstance.getValidation?.() ??
      this.validationAdapter?.(fieldInstance, {
        getResourceFields: this.getResourceFields.bind(this),
      })
    );
  }

  getResourceFields(
    resource: keyof APIResources & string,
  ): ResourceField<FieldKinds, FieldObjectKinds, keyof APIResources & string>[] {
    return Object.values(this.resources[resource]);
  }
}
