export interface StudentDataModel {
  name: string;
  age: number;
  department: string;
}

export interface TableModel {
  theadModelArray: Array<TableHeaderModel>;
  tbodyModelArray: Array<TableHeaderModel>;
}

export interface TableHeaderModel {}

export interface TableColumnModel {}

export interface ResponseData {
  students: Array<StudentDataModel>;
  total: number;
}
