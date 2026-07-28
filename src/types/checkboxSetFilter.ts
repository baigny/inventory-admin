import type { CustomFilterProps } from 'ag-grid-react';

export interface CheckboxSetFilterParams {
  values: string[];
}

export type CheckboxSetFilterProps<TData = unknown> = CustomFilterProps<TData, unknown, string[]>;
