import { Payment, PaymentType } from "@prisma/client";
import * as z from "zod";

import { CompleteBooking, BookingModel } from "./index";

// Helper schema for JSON data
type Literal = boolean | null | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const _PaymentModel = z.object({
  id: z.number().int(),
  uid: z.string(),
  type: z.nativeEnum(PaymentType),
  bookingId: z.number().int(),
  amount: z.number().int(),
  fee: z.number().int(),
  currency: z.string(),
  success: z.boolean(),
  refunded: z.boolean(),
  data: jsonSchema,
  externalId: z.string(),
});

export interface CompletePayment extends Payment {
  booking: CompleteBooking | null;
}

/**
 * PaymentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const PaymentModel: z.ZodSchema<CompletePayment> = z.lazy(() =>
  _PaymentModel.extend({
    booking: BookingModel.nullable(),
  })
);