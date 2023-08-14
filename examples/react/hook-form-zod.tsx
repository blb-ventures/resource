import resources from '../resources.json';

export const HookFormZodExample = () => {
  const handleSubmit = (values: any) => {
    console.log(values)
  }
  return <ResourceForm fields={[resources.User.fields.name, resources.User.fields.isAdmin]} onSubmit={handleSubmit} />
}
