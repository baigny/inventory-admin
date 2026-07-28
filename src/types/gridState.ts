import type { ColumnState, FilterModel } from 'ag-grid-community';

export interface StoredGridState {
  columnState: ColumnState[];
  filterModel: FilterModel;
}
