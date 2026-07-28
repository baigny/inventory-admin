export interface StatusTagProps<T extends string> {
  value: T;
  colorMap: Record<T, string>;
}
