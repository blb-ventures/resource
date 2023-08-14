/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { APIFieldUnion } from '@blb-ventures/resource';
import { filterObjNullValues } from '@blb-ventures/web-utils';
import { BaseSyntheticEvent, ReactNode } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { Form, FormProps } from './form';
import { FormItem } from './form-item';
import { resourceManager } from '../resource-manager';

export interface ResourceFormProps<
  T extends APIFieldUnion,
  FormType extends FieldValues = FieldValues,
> {
  onSubmit: (data: FormType, event?: BaseSyntheticEvent) => void | Promise<void>;
  children?: ReactNode;
  fields?: T[];
  fieldProps?: Record<T['name'], any>;
  fieldValidation?: Record<T['name'], any>;
  form?: UseFormReturn<FormType>;
  formProps?: Partial<FormProps<FormType>>;
  disableFields?: boolean;
}

export const ResourceForm = <T extends APIFieldUnion, FormType extends FieldValues = FieldValues>({
  onSubmit,
  children,
  fields,
  fieldProps,
  fieldValidation,
  form,
  formProps,
  disableFields,
}: ResourceFormProps<T, FormType>) => {
  const formId = formProps?.id ?? 'dialog-form';
  const nonNullDefaultValues =
    formProps?.defaultValues != null ? filterObjNullValues(formProps.defaultValues) : undefined;
  return fields != null || children != null ? (
    <Form
      defaultValues={nonNullDefaultValues as any}
      validation={
        fields != null ? resourceManager.getValidationSchema(fields, fieldValidation) : undefined
      }
      {...formProps}
      className="mt-2 flex flex-col gap-4"
      form={form}
      id={formId}
      onSubmit={onSubmit}
    >
      {fields?.map(it => (
        <FormItem
          key={it.name}
          componentProps={{
            disabled: disableFields,
            ...(fieldProps != null && it.name in fieldProps
              ? fieldProps[it.name as keyof typeof fieldProps]
              : {}),
          }}
          field={it}
          name={it.name}
        />
      ))}
      {children}
    </Form>
  ) : null;
};
