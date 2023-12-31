import { format, parseISO } from 'date-fns';
import { FC, useMemo } from 'react';

export const FormatDate: FC<{
  value: Date | string;
  format?: string;
}> = props => {
  const value = useMemo(() => {
    try {
      return format(
        typeof props.value === 'string' ? parseISO(props.value) : props.value,
        props.format
      );
    } catch (e) {
      //
    }
  }, [props.value, props.format]);

  return <>{value}</>;
};
