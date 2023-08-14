import { z } from 'zod';
import { ZodAdapterOptions, getFieldRules, KindManager, ResourceManager, APIField, APIFieldObject, FieldValidation } from '@blb-ventures/resource';
import resource from '../resources.json';

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

export const resourceManager = new ResourceManager(resource, {
  defaultFieldManager: new BaseField(),
  defaultFieldObjectManager: new BaseFieldObject(),
  fieldManagerByKind: {
    BOOLEAN: new BoolField(),
  },
  fieldObjectManagerByKind: {},
  validationSchemaBuilder: validation => validation,
});
