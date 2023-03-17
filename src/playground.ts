import { FieldImpl, ResourcesManager } from './resource';
import { APIFieldObject, FieldConstructor } from './resource.interface';

const exampleObject: APIFieldObject = {
  name: 'User',
  label: 'User',
  objKind: 'OBJECT',
  fields: {
    id: {
      name: 'id',
      kind: 'ID',
      label: 'ID',
      orderable: true,
      filterable: true,
      validation: { required: true },
    },
    name: {
      name: 'name',
      kind: 'STRING',
      label: 'Name',
      validation: { required: true },
    },
    firstName: {
      name: 'firstName',
      kind: 'STRING',
      label: 'First name',
      orderable: true,
      validation: { required: true, minLength: 0, maxLength: 150 },
    },
    lastName: {
      name: 'lastName',
      kind: 'STRING',
      label: 'Last name',
      validation: { required: true, minLength: 0, maxLength: 150 },
    },
    isAdmin: {
      name: 'isAdmin',
      kind: 'BOOLEAN',
      label: 'admin status',
      orderable: true,
      filterable: true,
      defaultValue: false,
      validation: { required: true },
    },
    phone: {
      name: 'phone',
      kind: 'PHONE',
      label: 'Phone',
      filterable: true,
      validation: { required: false },
    },
    createdAt: {
      name: 'createdAt',
      kind: 'DATETIME',
      label: 'Created at',
      validation: { required: true },
    },
    birthday: {
      name: 'birthday',
      kind: 'DATE',
      label: 'Birthday',
      validation: { required: false },
    },
  },
};

class BaseField extends FieldImpl {
  getFormField() {
    return '<input />';
  }
}

const resourceManager = new ResourcesManager<string>({
  fieldByKind: {
    ID: BaseField as FieldConstructor,
    STRING: BaseField as FieldConstructor,
    BOOLEAN: BaseField as FieldConstructor,
    PHONE: BaseField as FieldConstructor,
    DATETIME: BaseField as FieldConstructor,
    DATE: BaseField as FieldConstructor,
  },
  defaultField: BaseField as FieldConstructor,
});

const idField = resourceManager.getFieldInstance(exampleObject);
console.log('OBJECT ID FIELD', idField);

if (!Array.isArray(exampleObject.fields)) {
  const exampleArray = {
    name: 'User',
    label: 'User',
    objKind: 'OBJECT',
    fields: [
      exampleObject.fields.id,
      //                   ^?
      exampleObject.fields.name,
      exampleObject.fields.firstName,
      exampleObject.fields.lastName,
      exampleObject.fields.isAdmin,
      exampleObject.fields.phone,
      exampleObject.fields.createdAt,
      exampleObject.fields.birthday,
    ],
  };
  const idField = resourceManager.getFieldInstance(exampleArray);
  console.log('ARRAY ID FIELD', idField);
}
