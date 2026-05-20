export interface WorkPosition {
  id: number;
  name: string;
  alias: string | null;
  prefix: string | null;
  uang_makan: number | null;
  potongan_uang_makan: number | null;
  uang_transport: number | null;
  potongan_uang_transport: number | null;
  tunjangan_jabatan: number | null;
  tunjangan_kerajinan: number | null;
  description: string | null;
  pengalaman: string | null;
  lokasi: string | null;
  employees_count: number;
}
