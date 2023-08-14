# Examples

Currently there are only example files from what we actually use in production for BLB Ventures product's.

In our projects we usually use:

- ReactJS
- React Hook Form (with Zod)
- MUI (a implementation of Material UI in ReactJS)

## Directory Structure

```
├── react/
│   ├── hook-form-zod.tsx (The example component)
│   ├── resource-manager.ts (Example of an instance of Resource Manager (from this lib) being initialized)
│   └── components/
│       ├── form-control-wrapper.tsx (MUI wrapper for the form fields to add labels and helper/error texts)
│       ├── form-item.tsx (Wrapper around this lib ReactHookFormItem injecting the above FormControlWrapper and loading the initialized resource manager)
│       ├── form.tsx (A form component that injects react-hook-form methods into the child components)
│       └── resource-form.tsx (A utility to convert a list of fields from the resources.json info FormItem components and basically generate the form with validation)
└── resources.json (The definition of the fields of every entity)
```

About the `form.tsx` you can see more on the [official react-hook-form documentation example of this](https://react-hook-form.com/advanced-usage#SmartFormComponent)
