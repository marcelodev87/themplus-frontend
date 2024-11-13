/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DataDepartment {
  name: string;
  parent: string | null;
  parentName: string | null;
}

export interface Department {
  id: string;
  name: string;
  enterprise_id: string;
  parent_id: string;
}

export interface DepartmentNode {
  id: string;
  label: string;
  children: DepartmentNode[];
}

export interface TransformedDepartment {
  id: string;
  label: string;
  icon: string;
  children?: TransformedDepartment[];
}

export interface DepartmentRoot {
  id: string;
  name: string;
}
