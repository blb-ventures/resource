import { z } from 'zod';
import { zodAdapter } from './adapters';
import { FieldImpl, FieldObjectImpl, ResourcesManager } from './resource';
import { FieldConstructor, FieldObjectConstructor } from './resource.interface';
import { filterResources } from './util';

const exampleObject = {
  User: {
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
    sessions: {
      name: 'sessions',
      label: 'Sessions',
      objKind: 'OBJECT_LIST',
      objType: 'Session',
    },
    status: {
      name: 'status',
      kind: 'STRING',
      label: 'Status',
      orderable: true,
      filterable: true,
      choices: [
        {
          label: 'Initial',
          value: 'initial',
        },
        {
          label: 'Ongoing',
          value: 'ongoing',
        },
        {
          label: 'Finished',
          value: 'finished',
        },
        {
          label: 'Transferred',
          value: 'transferred',
        },
      ],
      defaultValue: 'initial',
      validation: {
        required: true,
        minLength: 0,
        maxLength: 11,
      },
    },
  },
  Session: {
    user: {
      name: 'user',
      label: 'User',
      objKind: 'OBJECT',
      objType: 'User',
    },
  },
  Other: {
    name: {
      name: 'name',
      kind: 'STRING',
      label: 'Name',
      validation: { required: true, minLength: 0, maxLength: 150 },
    },
  },
} as const;

class BaseField extends FieldImpl {
  getFormField() {
    return '<input />';
  }
}

class BaseObjectField extends FieldObjectImpl {}

const filteredObject = filterResources(exampleObject, ['User', 'Session']);

const resourceManager = new ResourcesManager(filteredObject, {
  fieldByKind: {
    ID: BaseField as FieldConstructor,
    STRING: BaseField as FieldConstructor,
    BOOLEAN: BaseField as FieldConstructor,
    PHONE: BaseField as FieldConstructor,
    DATETIME: BaseField as FieldConstructor,
    DATE: BaseField as FieldConstructor,
  },
  fieldObjectByKind: {
    OBJECT: BaseObjectField as FieldObjectConstructor,
    OBJECT_LIST: BaseObjectField as FieldObjectConstructor,
  },
  defaultField: BaseField as FieldConstructor,
  validationAdapter: zodAdapter<keyof typeof filteredObject>({
    rulesByKind: {
      ID: _ => z.string(),
    },
  }),
});

console.log('display', resourceManager.display(true, 'User.isAdmin'));
const firstName = resourceManager.getField('Session.user.name');
if (firstName != null) {
  console.log('fieldDisplay', resourceManager.fieldDisplay('John Doe', firstName));
}

const sessionUser = resourceManager.getField('Session.user');
const sessionUserField = resourceManager.getFieldInstance(sessionUser);
console.log('getField -> getFieldInstance -> name', sessionUserField.name);

console.log('getDisplayFn', resourceManager.getDisplayFn('User.birthday'));
console.log('getFieldDisplayFn', resourceManager.getFieldDisplayFn(firstName));
console.log('getFieldFormField', resourceManager.getFieldFormField({}, firstName));
console.log('getFieldInstance', resourceManager.getFieldInstance(firstName));
console.log('getFieldValidation', resourceManager.getFieldValidation(firstName));
console.log('getFormField', resourceManager.getFormField({}, 'User.phone'));
console.log('getKindDisplay', resourceManager.getKindDisplay('ID', 'User ID'));
const sessionFields = resourceManager.getResourceFields('Session');
console.log('getResourceFields', sessionFields);
console.log('getValidation', resourceManager.getValidation('User.status'));
console.log('kindDisplay', resourceManager.kindDisplay(true, 'BOOLEAN'));