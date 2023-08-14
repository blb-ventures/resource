import { ReactHookFormItem, ReactHookFormItemProps } from '@blb-ventures/resource';
import { FC } from 'react';
import { resourceManager } from '../resource-manager';
import { FormControlWrapper } from './form-control-wrapper';

export type FormItemProps = Omit<
  ReactHookFormItemProps<any, any, any>,
  'FormControlWrapper' | 'manager'
> & {
  hasFormControl?: boolean;
};

export const FormItem: FC<FormItemProps> = ({ hasFormControl, ...props }) => {
  return (
    <ReactHookFormItem
      {...props}
      FormControlWrapper={hasFormControl ? FormControlWrapper : undefined}
      manager={resourceManager}
    />
  );
};
