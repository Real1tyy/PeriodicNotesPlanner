import { z } from "zod";
import { SETTINGS_DEFAULTS } from "../constants";

export const PeriodixSyncDataSchema = z
	.object({
		readOnly: z.boolean().catch(SETTINGS_DEFAULTS.READ_ONLY),
	})
	.strip();

export type PeriodixSyncData = z.infer<typeof PeriodixSyncDataSchema>;
