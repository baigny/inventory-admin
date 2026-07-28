import type { IDoesFilterPassParams } from 'ag-grid-community';
import { useGridFilter } from 'ag-grid-react';
import { Checkbox, Space } from 'antd';
import { useCallback, useMemo } from 'react';
import type { CheckboxSetFilterParams, CheckboxSetFilterProps } from '../../types';

export default function CheckboxSetFilter(props: CheckboxSetFilterProps) {
  const { model, onModelChange, getValue, colDef } = props;

  const values = useMemo(
    () => (colDef.filterParams as CheckboxSetFilterParams | undefined)?.values ?? [],
    [colDef.filterParams],
  );
  const selected = model ?? values;

  const doesFilterPass = useCallback(
    ({ node }: IDoesFilterPassParams) => {
      if (!model) return true;
      return model.includes(String(getValue(node)));
    },
    [model, getValue],
  );

  useGridFilter({ doesFilterPass });

  const toggle = (value: string, checked: boolean) => {
    const next = checked ? [...selected, value] : selected.filter((v) => v !== value);
    onModelChange(next.length === values.length ? null : next);
  };

  return (
    <div style={{ padding: 12, minWidth: 160 }}>
      <Space orientation="vertical" size={4}>
        {values.map((value) => (
          <Checkbox
            key={value}
            checked={selected.includes(value)}
            onChange={(e) => toggle(value, e.target.checked)}
          >
            {value}
          </Checkbox>
        ))}
      </Space>
    </div>
  );
}
