import { RenderProps } from '@blb-ventures/resource';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';
import { FC, ReactNode } from 'react';
import { FieldValues } from 'react-hook-form';

export interface FieldWithRender<FormType extends FieldValues = FieldValues> {
  renderProps: Partial<RenderProps<FormType>>;
}

export interface FormControlWrapperProps extends FieldWithRender {
  children?: ReactNode;
  helperText?: string;
  label?: string;
  name: string;
}

export const FormControlWrapper: FC<FormControlWrapperProps> = ({
  renderProps,
  children,
  label,
  helperText,
  name,
}) => {
  const hasError = renderProps.fieldState?.error != null;
  const currentHelper = hasError ? renderProps.fieldState?.error?.message : helperText;
  return (
    <FormControl error={hasError} fullWidth>
      {label && <InputLabel htmlFor={`form-item-${name}`}>{label}</InputLabel>}
      {children}
      <FormHelperText>{currentHelper}</FormHelperText>
    </FormControl>
  );
};
