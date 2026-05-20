export interface WorkforceOverview {
  headcount: {
    total: number;
    active: number;
    inactive: number;
  };
  distribution: {
    department: { name: string; count: number }[];
    location: { name: string; count: number }[];
    gender: { label: string; count: number }[];
  };
  growth_trend: { month: string; count: number }[];
}

export interface AttendanceProductivity {
  today: {
    present: number;
    late: number;
    absent: number;
    on_leave: number;
    attendance_rate: number;
  };
  monthly_overtime_hours: number;
}

export interface AttritionRetention {
  total_resigned_6_months: number;
  turnover_rate_period: number;
  reasons_distribution: { reason: string; count: number }[];
}

export interface PayrollInsights {
  total_monthly_payroll: number;
  department_cost_breakdown: { name: string; total: string | number }[];
}

export interface PendingRequestsCount {
  leave: number;
  overtime: number;
  total: number;
}

export interface DashboardData {
  workforce_overview: WorkforceOverview;
  attendance_productivity: AttendanceProductivity;
  attrition_retention: AttritionRetention;
  payroll_insights: PayrollInsights;
  pending_requests_count: PendingRequestsCount;
}

export interface EmployeeDashboardData {
  employee: {
    id: number;
    nik: string;
    employee_id_number: string;
    id_card_number: string;
    name: string;
    first_name: string;
    last_name: string;
    initial_name: string | null;
    department: {
      id: number;
      name: string;
    };
    position: {
      id: number;
      name: string;
    };
    work_location: {
      id: number;
      name: string;
    };
    work_employee_status: {
      id: number;
      name: string;
    };
    work_employee_type: string | null;
    email: string;
    company_email: string | null;
    photo_url: string | null;
    profileUrl: string | null;
    join_date: string;
    resign_date: string | null;
    phone_number: string;
    handphone: string | null;
    current_address: string;
    place_birth: string;
    date_birth: string;
    annual_leave_2: number;
    annual_leave_3: number;
    supervisor: {
      id: number;
      name: string;
      nik: string;
    } | null;
  };
  attendance: {
    id: number | null;
    attendance_at: string;
    check_in: string | null;
    check_out: string | null;
    shift_start: string | null;
    shift_end: string | null;
    status: string | null;
    is_clocked_in: boolean;
    is_locked: boolean;
    lock_title: string | null;
    lock_message: string | null;
    mobile_scans: any[] | null;
    all_scans: {
      id?: number;
      scan_at: string;
      is_mobile: boolean;
      type: string;
    }[] | null;
    incoming_photo: string | null;
    outgoing_photo: string | null;
  };
  pending_requests: {
    id: number;
    type: "overtime" | "leave" | "resignation" | "warning-letter" | string;
    title: string;
    date_info: string;
    status: string;
    note: string | null;
    created_at: string;
  }[];
  holidays: Record<
    string,
    {
      name: string;
      date: string;
      description: string | null;
    }
  >;
  tenure: string;
  attendance_summary: {
    name: string;
    count: number;
    percentage: number;
  }[];
  attendance_rate: number;
  recent_attendance: any[];
}

