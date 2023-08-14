/* eslint-disable react/no-children-prop */
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseSyntheticEvent, Children, ReactNode, createElement, useEffect, useMemo, ReactElement, isValidElement } from 'react';
import {
  Control,
  DeepPartial,
  FieldValues,
  UseFormProps,
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import { ZodRawShape, z } from 'zod';

export const isSmartFormField = (node: ChildNode): node is ReactElement =>
  isValidElement(node) &&
  (typeof (node.props as { name: unknown } | null)?.name === 'string' ||
    (node.props as { field: any } | null)?.field != null);

export const isElementWithChildren = (node: ChildNode): node is ReactElement =>
  isValidElement(node) && (node.props as { children?: ReactNode } | null)?.children != null;

export interface SmartFormInput {
  name: string;
  control?: Control<any>;
  helperText?: string | null;
}

const injectFieldRegister = <FormType extends FieldValues = FieldValues>(
  node: ReactNode,
  control: Control<FormType>,
  depth = 4,
): ReactNode =>
  depth >= 0
    ? Children.map(node, child => {
        if (isSmartFormField(child)) {
          return createElement(child.type, {
            ...child.props,
            key: (child.props as { name: string }).name,
            control,
          });
        }
        if (isElementWithChildren(child)) {
          return createElement(child.type, {
            ...child.props,
            children: injectFieldRegister(
              (child.props as { children: ReactNode }).children,
              control,
              depth - 1,
            ),
          });
        }
        return child;
      })
    : node;

export interface FormProps<FormType extends FieldValues = FieldValues> extends UseFormProps {
  id?: string;
  className?: string;
  children: ReactNode;
  form?: UseFormReturn<FormType>;
  onSubmit: (data: FormType, event?: BaseSyntheticEvent) => void | Promise<void>;
  validation?: ZodRawShape;
  defaultValues?: DeepPartial<FormType>;
  values?: FormType | undefined;
  resetOnSuccess?: boolean;
}

export const Form = <FormType extends FieldValues = FieldValues>({
  defaultValues,
  children,
  onSubmit,
  mode = 'onBlur',
  validation,
  id,
  className,
  form,
  resetOnSuccess = true,
  ...useFormProps
}: FormProps<FormType>) => {
  const methods = useForm<FormType>({
    ...useFormProps,
    defaultValues,
    shouldFocusError: true,
    mode,
    resolver: validation != null ? zodResolver(z.object(validation)) : undefined,
  });
  useEffect(() => {
    if (resetOnSuccess && methods.formState.isSubmitSuccessful) methods.reset(defaultValues);
  }, [methods.formState.isSubmitSuccessful, defaultValues, methods, resetOnSuccess]);
  const currentForm = form ?? methods;
  const formChildren = useMemo(
    () => injectFieldRegister(children, currentForm.control),
    [children, currentForm.control],
  );
  // const watch = currentForm.watch();
  // console.log('WATCH', watch);
  // console.log('FORM ERRORS', currentForm.formState.errors);
  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form className={className} id={id} onSubmit={currentForm.handleSubmit(onSubmit)}>
      {formChildren}
    </form>
  );
};
