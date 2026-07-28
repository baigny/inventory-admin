import { Tag } from 'antd';
import type { StatusTagProps } from '../types';

export default function StatusTag<T extends string>({ value, colorMap }: StatusTagProps<T>) {
  return <Tag color={colorMap[value]}>{value}</Tag>;
}
