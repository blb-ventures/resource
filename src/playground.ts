import { z } from 'zod';
import { ZodAdapterOptions, getFieldRules } from './adapters';
import resource from './mock/resources.json';
import { KindManager, ResourceManager } from './resource';
import { APIField, APIFieldObject, FieldValidation } from './resource.interface';

const zodAdapterOptions: ZodAdapterOptions = {
  rulesByKind: {
    BOOLEAN: (__, _) => z.boolean(),
  },
};

class BaseField implements KindManager<APIField, string, any> {
  display(field: APIField, value: any): string {
    return `${field.name} is ${value}`;
  }
  validation(field: APIField, validation?: FieldValidation | undefined) {
    return getFieldRules(field, zodAdapterOptions, validation);
  }
  formField(field: APIField, props?: any): string {
    return `FIELD: ${field.name} | PROPS: ${JSON.stringify(props)}`;
  }
}

class BoolField extends BaseField {
  display(_: APIField, value: any): string {
    return value ? 'Yes' : 'No';
  }
}

class BaseFieldObject implements KindManager<APIFieldObject, string, any> {
  display(field: APIFieldObject): string {
    return field.name;
  }
  validation(_: APIFieldObject, validation?: FieldValidation | undefined) {
    const val = { ...validation };
    return 'required' in val ? val.required : false;
  }
  formField(field: APIFieldObject, props?: any): string {
    return `FIELD: ${field.name} | PROPS: ${JSON.stringify(props)}`;
  }
}

const manager = new ResourceManager(resource, {
  defaultFieldManager: new BaseField(),
  defaultFieldObjectManager: new BaseFieldObject(),
  fieldManagerByKind: {
    BOOLEAN: new BoolField(),
  },
  fieldObjectManagerByKind: {},
  validationSchemaBuilder: validation => validation,
});

console.log(manager.getFieldFormField(resource.UserCreateInput.fields.email));
console.log(manager.getFieldValidation(resource.UserCreateInput.fields.email));
console.log(manager.getFieldDisplay(resource.UserCreateInput.fields.email));

console.log(manager.getFieldFormField(resource.AccountCategoryFilter.fields.includeDescendants));
console.log(manager.getFieldValidation(resource.AccountCategoryFilter.fields.includeDescendants));
console.log(manager.getFieldDisplay(resource.AccountCategoryFilter.fields.includeDescendants));
