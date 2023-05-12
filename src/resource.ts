import {
  APIField,
  APIFieldObject,
  APIFieldUnion,
  APIResources,
  FieldValidation,
} from './resource.interface';

export interface KindManager<
  Kind extends APIFieldUnion,
  FormResult,
  ValidationResult,
  DisplayResult = string | null,
> {
  display(field: Kind, value: any): DisplayResult;
  validation(field: Kind, validation?: FieldValidation): ValidationResult;
  formField(field: Kind, props?: any): FormResult;
}

export interface ManagerOptions<
  FieldKinds extends PropertyKey,
  FieldObjectKinds extends PropertyKey,
  FormResult,
  ValidationResult,
  ValidationSchema,
  DisplayResult = string | null,
> {
  fieldManagerByKind: Record<
    FieldKinds,
    KindManager<APIField, FormResult, ValidationResult, DisplayResult>
  >;
  fieldObjectManagerByKind: Record<
    FieldObjectKinds,
    KindManager<APIFieldObject, FormResult, ValidationResult, DisplayResult>
  >;
  defaultFieldManager: KindManager<APIField, FormResult, ValidationResult, DisplayResult>;
  defaultFieldObjectManager: KindManager<
    APIFieldObject,
    FormResult,
    ValidationResult,
    DisplayResult
  >;
  validationSchemaBuilder: (
    fieldValidationTuple: [APIField, ValidationResult][],
  ) => ValidationSchema;
}

export class ResourceManager<
  Resources extends APIResources,
  FieldKinds extends PropertyKey,
  FieldObjectKinds extends PropertyKey,
  FormResult,
  ValidationResult,
  ValidationSchema,
  DisplayResult = string | null,
> {
  resources: Resources;
  fieldManagerByKind: Record<
    FieldKinds,
    KindManager<APIField, FormResult, ValidationResult, DisplayResult>
  >;
  fieldObjectManagerByKind: Record<
    FieldObjectKinds,
    KindManager<APIFieldObject, FormResult, ValidationResult, DisplayResult>
  >;
  defaultFieldManager: KindManager<APIField, FormResult, ValidationResult, DisplayResult>;
  defaultFieldObjectManager: KindManager<
    APIFieldObject,
    FormResult,
    ValidationResult,
    DisplayResult
  >;
  validationSchemaBuilder: (
    fieldValidationTuple: [APIField, ValidationResult][],
  ) => ValidationSchema;

  constructor(
    resources: Resources,
    options: ManagerOptions<
      FieldKinds,
      FieldObjectKinds,
      FormResult,
      ValidationResult,
      ValidationSchema,
      DisplayResult
    >,
  ) {
    this.resources = resources;
    this.fieldManagerByKind = options.fieldManagerByKind;
    this.defaultFieldManager = options.defaultFieldManager;
    this.defaultFieldObjectManager = options.defaultFieldObjectManager;
    this.fieldObjectManagerByKind = options.fieldObjectManagerByKind;
  }

  getManager(
    field: APIFieldUnion,
  ): KindManager<APIFieldUnion, FormResult, ValidationResult, DisplayResult> {
    if ('kind' in field) {
      if (field.kind in this.fieldManagerByKind) {
        return this.fieldManagerByKind[field.kind as FieldKinds];
      }
      return this.defaultFieldManager;
    }
    if (field.objKind in this.fieldObjectManagerByKind) {
      return this.fieldObjectManagerByKind[field.objKind as FieldObjectKinds];
    }
    return this.defaultFieldObjectManager;
  }

  getFieldDisplay(field: APIFieldUnion, value?: any): DisplayResult {
    return this.getManager(field).display(field, value);
  }

  getFieldFormField(field: APIFieldUnion, props?: any) {
    return this.getManager(field).formField(field, props);
  }

  getFieldValidation(field: APIFieldUnion, validation?: FieldValidation): ValidationResult {
    return this.getManager(field).validation(field, validation);
  }

  getFieldListFormField = <T extends APIFieldUnion>(fields: T[], props: Record<T['name'], any>) => {
    return fields.map(field =>
      this.getFieldFormField(
        field,
        field.name in props ? props[field.name as keyof typeof props] : undefined,
      ),
    );
  };

  getValidationSchema = <T extends APIFieldUnion>(
    fields: T[],
    validation: Record<T['name'], any>,
  ) => {
    return this.validationSchemaBuilder(
      fields.map(
        field =>
          [
            field,
            this.getFieldValidation(
              field,
              field.name in validation
                ? validation[field.name as keyof typeof validation]
                : undefined,
            ),
          ] as [APIField, ValidationResult],
      ),
    );
  };
}
