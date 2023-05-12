import { FC, useMemo } from 'react';
import { Control, Controller, ControllerProps, FieldValues } from 'react-hook-form';
import { ResourceManager } from '../../resource';
import { APIFieldUnion, APIResources } from '../../resource.interface';
import { isAPIField } from '../../resource.typeguards';
import { ReactField } from '../react/react-field';
import { FormControlWrapperProps } from './interfaces';

export interface ReactHookFormItemProps<
  Resources extends APIResources,
  FieldKinds extends PropertyKey,
  FieldObjectKinds extends PropertyKey,
  FormType extends FieldValues = FieldValues,
> {
  name?: string;
  control?: Control<FormType>;
  field: APIFieldUnion;
  componentProps?: Record<string, unknown>;
  formItemProps?: Partial<ControllerProps>;
  FormControlWrapper?: FC<FormControlWrapperProps>;
  manager: ResourceManager<Resources, FieldKinds, FieldObjectKinds, JSX.Element, any, any>;
}

export const ReactHookFormItem = <
  Resources extends APIResources,
  FieldKinds extends PropertyKey,
  FieldObjectKinds extends PropertyKey,
  FormType extends FieldValues = FieldValues,
>({
  control,
  field,
  formItemProps,
  componentProps,
  FormControlWrapper,
  name,
  manager,
}: ReactHookFormItemProps<Resources, FieldKinds, FieldObjectKinds, FormType>) => {
  const defaultValue = useMemo(() => (isAPIField(field) ? field.defaultValue : undefined), [field]);
  return (
    <Controller
      control={control as any}
      defaultValue={defaultValue}
      name={name ?? field.name}
      render={renderProps => {
        const formField = (
          <ReactField
            field={field}
            manager={manager}
            componentProps={{
              onBlur: renderProps.field.onBlur,
              onChange: renderProps.field.onChange,
              value: renderProps.field.value,
              ...componentProps,
              id: `form-item-${renderProps.field.name}`,
              label: field.label,
              name: renderProps.field.name,
              renderProps,
            }}
          />
        );
        return FormControlWrapper != null ? (
          <FormControlWrapper
            helperText={componentProps?.helperText as string}
            label={field.label}
            name={renderProps.field.name}
            renderProps={renderProps}
          >
            {formField}
          </FormControlWrapper>
        ) : (
          formField
        );
      }}
      {...formItemProps}
    />
  );
};
