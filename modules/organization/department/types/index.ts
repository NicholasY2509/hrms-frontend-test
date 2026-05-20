export interface DepartmentHeadAssignment {
  id: number;
  work_location_id: number;
  employee_id: number;
  work_location: {
    id: number;
    name: string;
  };
  employee: {
    id: number;
    nik: string;
    name: string;
  };
}

export interface Department {
  id: number;
  name: string;
  heads: DepartmentHeadAssignment[];
  employees_count: number;
}
