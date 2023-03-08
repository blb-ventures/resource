import { ReactNode } from 'react';
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from 'react-hook-form';

export interface RenderProps<FormType extends FieldValues = FieldValues> {
  field: ControllerRenderProps<FormType>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FormType>;
}

export interface FormControlWrapperProps<FormType extends FieldValues = FieldValues> {
  children?: ReactNode;
  helperText?: string;
  label?: string;
  name: string;
  renderProps: Partial<RenderProps<FormType>>;
}
