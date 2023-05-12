import { useMemo } from 'react';
import { ResourceManager } from '../../resource';
import { APIFieldUnion, APIResources } from '../../resource.interface';

export interface ReactFieldProps<
  Resources extends APIResources,
  FieldKinds extends PropertyKey,
  FieldObjectKinds extends PropertyKey,
  FormResult = JSX.Element | null,
> {
  field: APIFieldUnion;
  manager: ResourceManager<Resources, FieldKinds, FieldObjectKinds, FormResult, any, any>;
  componentProps?: any;
}

export const ReactField = <
  Resources extends APIResources,
  FieldKinds extends PropertyKey,
  FieldObjectKinds extends PropertyKey,
  FormResult = JSX.Element | null,
>({
  field,
  componentProps,
  manager,
}: ReactFieldProps<Resources, FieldKinds, FieldObjectKinds, FormResult>) => {
  const formField = useMemo(
    () => manager.getFieldFormField(field, componentProps),
    [field, manager],
  );
  return formField;
};
