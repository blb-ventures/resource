import { z } from 'zod';
import { zodAdapter } from './adapters';
import { FieldImpl, ResourcesManager } from './resource';
import { FieldConstructor } from './resource.interface';
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
  defaultField: BaseField as FieldConstructor,
  validationAdapter: zodAdapter({
    rulesByKind: {
      ID: _ => z.string(),
    },
  }),
});

console.log(resourceManager.display(true, 'User.isAdmin'));
const firstName = resourceManager.getField('Session.user.name');
if (firstName != null) {
  console.log(resourceManager.fieldDisplay('John Doe', firstName));
}
