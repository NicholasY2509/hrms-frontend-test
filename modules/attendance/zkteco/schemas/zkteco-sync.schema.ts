import * as z from "zod";

export const zktecoSyncSchema = z.object({
  zkteco_machine_id: z.number().min(1, "Mesin fingerprint wajib dipilih"),
});

export type ZktecoSyncFormValues = z.infer<typeof zktecoSyncSchema>;
