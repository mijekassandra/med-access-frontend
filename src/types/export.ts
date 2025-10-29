export interface ExportData {
  [key: string]: any;
}

export interface ExportColumn {
  key: string;
  header: string;
  render?: (value: any) => React.ReactNode;
}

export interface ExportDateConfig {
  columnKey: string;
  label: string;
  dateFormat?: 'iso' | 'timestamp' | 'custom';
  customParser?: (value: any) => Date;
}
