import { FC, useMemo } from 'react';
import { Control, Controller, ControllerProps, FieldValues } from 'react-hook-form';
import { ResourcesManager } from '../../resource';
import { APIResourceField } from '../../resource.interface';
import { isAPIField } from '../../resource.typeguards';
import { FormControlWrapperProps } from './interfaces';

export interface ReactHookFormItemProps<
  FieldKey extends string = string,
  FormType extends FieldValues = FieldValues,
> {
  name: string;
  control?: Control<FormType>;
  field: APIResourceField<FieldKey>;
  componentProps?: Record<string, unknown>;
  formItemProps?: Partial<ControllerProps>;
  FormControlWrapper?: FC<FormControlWrapperProps>;
  manager: ResourcesManager<FieldKey, string>;
}

export const ReactHookFormItem = <
  FieldKey extends string = string,
  FormType extends FieldValues = FieldValues,
>({
  control,
  field,
  formItemProps,
  componentProps,
  FormControlWrapper,
  name,
  manager,
}: ReactHookFormItemProps<FieldKey, FormType>) => {
  const defaultValue = useMemo(() => (isAPIField(field) ? field.defaultValue : undefined), [field]);
  return (
    <Controller
      control={control as any}
      defaultValue={defaultValue}
      name={name ?? field.name}
      render={renderProps => {
        const autoField = manager.getFormField<any, JSX.Element>(
          {
            onBlur: renderProps.field?.onBlur,
            onChange: renderProps.field?.onChange,
            value: renderProps.field?.value,
            ...componentProps,
            id: `form-item-${renderProps.field.name}`,
            label: field.label,
            name: renderProps.field?.name,
            renderProps,
          },
          field,
        );
        return FormControlWrapper != null ? (
          <FormControlWrapper
            helperText={componentProps?.helperText as string}
            label={field.label}
            name={renderProps.field.name}
            renderProps={renderProps}
          >
            {autoField}
          </FormControlWrapper>
        ) : (
          autoField
        );
      }}
      {...formItemProps}
    />
  );
};
