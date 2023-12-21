import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type Transaksi, transaksi } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { startOfMonth } from "date-fns";

export const transaksiRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.transaksi.findMany({
      with: {
        channel: true,
        kasir: true,
      },
    });
  }),

  getThisMonthCount: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.transaksi.findMany({
      columns: {
        id: true,
      },
      where: (transaksi, { gt }) =>
        gt(transaksi.tanggalTransaksi, startOfMonth(new Date())),
    });
    return result.length;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.query.transaksi.findFirst({
        where: (transaksi, { eq }) => eq(transaksi.id, input.id),
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        nama: z.string().min(1),
        total: z.number(),
        ppn: z.number(),
        idChannel: z.string().min(1),
        ref: z.string().min(1),
        tanggalTransaksi: z.date(),
        idKasir: z.string().min(1),
        keterangan: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      const transaksiNew: Transaksi = {
        ...input,
      };
      return ctx.db.insert(transaksi).values(transaksiNew);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        nama: z.string().min(1),
        total: z.number(),
        ppn: z.number(),
        idChannel: z.string().min(1),
        ref: z.string().min(1),
        tanggalTransaksi: z.date(),
        idKasir: z.string().min(1),
        keterangan: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const transaksiEdit: Transaksi = {
        ...input,
      };
      return ctx.db
        .update(transaksi)
        .set(transaksiEdit)
        .where(eq(transaksi.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(transaksi).where(eq(transaksi.id, input.id));
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
