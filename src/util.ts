import { APIResource } from "./resource.interface";

export const filterResources = <const APIResources extends Record<string, APIResource<FieldKinds, FieldObjectKinds>>, Keys extends keyof APIResources, FieldKinds extends string = string,
FieldObjectKinds extends string = string>(resources: APIResources, keys: Keys[]): Pick<APIResources, Keys> => {
  return Object.fromEntries(Object.entries(resources).filter(([key]) => keys.includes(key as Keys))) as Pick<APIResources, Keys>;
}
