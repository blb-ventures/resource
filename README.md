# Resource

[![build status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fblb-ventures%2Fresource%2Fbadge%3Fref%3Dmain&style=flat)](https://actions-badge.atrox.dev/blb-ventures/resource/goto?ref=main)

Library to transform entity definition into form fields, form validation and formatted display values.

There is a backend implementation for Python with Strawberry GraphQL that generates this kinds of files here: https://github.com/blb-ventures/strawberry-resources

## Why

As a Venture Builder we have to build a lot of CRUDs. Since our APIs are built with Python we usually have to duplicate business logic and make sure the client is validating forms and displaying values the correct way. We already use GraphQL to generate Typescript types and avoid some mistakes when changing API endpoints. However having to always be guessing or double checking form validation and value displaying can be tedious and lead to mistakes.

This library will try do the following:

- Have a definition of the API entities and endpoints/resolvers;
- Standardize form fields based on the definition of the field;
- Standardize form validation based on the definition of the field; and
- Standardize value display formatting based on the definition of the field;

## Roadmap

- [ ] Create a resources file generator directly from a GraphQL Schema
- [ ] Add FieldObject usage example (form nesting)
- [ ] Improve documentation and example with other frameworks

## Install

```bash
npm i @blb-ventures/resource
# or
yarn add @blb-ventures/resource
# or
pnpm i @blb-ventures/resource
```

## Getting started

### Real usage example

I've put in the [examples directory](https://github.com/blb-ventures/resource/tree/main/examples) some React components we use in our projects to simplify rendering and validating a form from a list of fields.
The examples use react-hook-form, zod and mui and I'm open for suggestions on how to use with other libraries.

### Setup

We start by defining a resource manager that knows how to deal with all kinds of entities.

```typescript
// File: resource-manager.ts
// Import your generated resources definition file
import resources from 'resource.json';

// Initialize the resource manager
const resourceManager = new ResourceManager({
  defaultFieldManager: new BaseField(),
  defaultFieldObjectManager: new BaseFieldObject(),
  fieldManagerByKind: {
    DATE: {
      display: (field: Kind, value: any) => { /* */ },
      validation: (field: Kind, validation?: FieldValidation) => { /* */ },
      formField: (field: Kind, props?: any) => { /* */ },
    }
    // OR
    BOOLEAN: new BooleanField(),
  },
  fieldObjectManagerByKind: {},
  // This is a helper to standardize the way to generate a validation object or function for a collection of fields
  validationSchemaBuilder: validation => {
    // Example of using it with zod
    const definition = {};
    for (const [field, validationResult] in validation) {
      definition[field.name] = validationResult;
    }
    return z.object(definition);
  },
});

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
  formField(field: APIField, props?: any): string {
    return <select name={props.name}>
      <option value="1">Yes</option>
      <option value="0">No</option>
    </select>;
    // OR
    // return <input type="checkbox" name={field.name} checked={props.value}>
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
```

### Displaying a value

```typescript
// Import your generated resources definition file
import resources from 'resource.json';
import { resourceManager } from 'resource-manager';

const user: User {
  isAdmin: true
};

const displayAdmin = resourceManager.getFieldDisplay(resources.User.fields.isAdmin, user.isAdmin);
// displayAdmin = Yes
```

### Form validation

```typescript
// Import your generated resources definition file
import resources from 'resource.json';
import { resourceManager } from 'resource-manager';

// The second argument here is a dict used to override the field validation by the field name.
// This is important for cases like when a field is defined as optional but in a certain form you want it as required
resourceManager.getValidationSchema([resources.User.fields.name, resources.User.fields.isAdmin], {
  isAdmin: { required: true }
})
// Output using zod setup example should be something like this:
// z.object({ name: z.string(), isAdmin: z.string().min(1) })
```

### Form building/rendering

```typescript
// Import your generated resources definition file
import resources from 'resource.json';
import { resourceManager } from 'resource-manager';

const field = resourceManager.getFieldFormField(resources.User.fields.name, { type: 'number' });

return (
  <div>{field}</div>
)
```

### Defintions file example

```json
{
  "User": {
    "name": "User",
    "fields": {
      "name": {
        "name": "name",
        "kind": "STRING",
        "label": "Name",
        "validation": {
          "required": false
        }
      },
      "isAdmin": {
        "name": "isAdmin",
        "kind": "BOOLEAN",
        "label": "Is Admin",
        "validation": {
          "required": false
        }
      }
    }
  }
}
```

## Simple Example Screenshot

### React Component

![code](https://github.com/blb-ventures/resource/assets/810728/95c03b62-150c-451f-9306-c993cf34a210)

### Fields Definition

![code3](https://github.com/blb-ventures/resource/assets/810728/87040660-05ac-4bb3-9773-015dcb47f928)

### Result

![Screenshot 2023-08-14 at 1 15 17 PM](https://github.com/blb-ventures/resource/assets/810728/fabc4486-f644-4412-8cbc-b8543a32c25d)

