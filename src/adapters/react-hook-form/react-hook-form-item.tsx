import { FC, ReactElement, useMemo } from 'react';
import { Control, Controller, ControllerProps, FieldValues } from 'react-hook-form';
import { ResourceField } from '../../resource.interface';
import { isAPIField } from '../../resource.typeguards';
import { FormControlWrapperProps } from './interfaces';

export interface ReactHookFormItemProps<
  FieldKey extends string = string,
  FormType extends FieldValues = FieldValues,
> {
  name?: string;
  control?: Control<FormType>;
  field: ResourceField<FieldKey, string, string, any, ReactElement>;
  componentProps?: Record<string, unknown>;
  formItemProps?: Partial<ControllerProps>;
  FormControlWrapper?: FC<FormControlWrapperProps>;
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
}: ReactHookFormItemProps<FieldKey, FormType>) => {
  const defaultValue = useMemo(() => (isAPIField(field) ? field.defaultValue : undefined), [field]);
  return field.getFormField == null ? null : (
    <Controller
      control={control as any}
      defaultValue={defaultValue}
      name={name ?? field.name}
      render={renderProps => {
        if (field.getFormField == null) return <div />;
        const autoField = field.getFormField({
          onBlur: renderProps.field.onBlur,
          onChange: renderProps.field.onChange,
          value: renderProps.field.value,
          ...componentProps,
          id: `form-item-${renderProps.field.name}`,
          label: field.label,
          name: renderProps.field.name,
          renderProps,
        });
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
          autoField ?? <div />
        );
      }}
      {...formItemProps}
    />
  );
};
