import type { GridApi } from 'ag-grid-community';
import type { StoredGridState } from '../types';

const STORAGE_PREFIX = 'inventory-admin:grid-state:';

export function saveGridState(key: string, api: GridApi): void {
  const state: StoredGridState = {
    columnState: api.getColumnState(),
    filterModel: api.getFilterModel(),
  };
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(state));
}

export function restoreGridState(key: string, api: GridApi): void {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  if (!raw) return;
  try {
    const { columnState, filterModel } = JSON.parse(raw) as StoredGridState;
    if (columnState) api.applyColumnState({ state: columnState, applyOrder: true });
    if (filterModel) api.setFilterModel(filterModel);
  } catch {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  }
}
