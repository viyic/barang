import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type TransaksiDetail, transaksiDetail } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { startOfMonth } from "date-fns";

export const transaksiDetailRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.transaksiDetail.findMany({
      with: {
        barang: true,
        kasir: true,
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.query.transaksiDetail.findFirst({
        where: (transaksiDetail, { eq }) => eq(transaksiDetail.id, input.id),
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        idTransaksi: z.string().min(1),
        idBarang: z.string().min(1),
        namaBarang: z.string(),
        hargaBeli: z.number(),
        hargaJual: z.number(),
        satuan: z.string(),
        jumlahBeli: z.number(),
        kategori: z.string(),
        retur: z.string(),
        idKasir: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      const transaksiNew: TransaksiDetail = {
        ...input,
      };
      return ctx.db.insert(transaksiDetail).values(transaksiNew);
    }),

  // update: publicProcedure
  //   .input(
  //     z.object({
  //       id: z.string().min(1),
  //       nama: z.string().min(1),
  //       total: z.number(),
  //       ppn: z.number(),
  //       idChannel: z.string().min(1),
  //       ref: z.string().min(1),
  //       tanggalTransaksi: z.date(),
  //       idKasir: z.string().min(1),
  //       keterangan: z.string(),
  //     }),
  //   )
  //   .mutation(({ ctx, input }) => {
  //     const transaksiEdit: TransaksiDetail = {
  //       ...input,
  //     };
  //     return ctx.db
  //       .update(transaksiDetail)
  //       .set(transaksiEdit)
  //       .where(eq(transaksiDetail.id, input.id));
  //   }),

  delete: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(transaksiDetail)
        .where(eq(transaksiDetail.id, input.id));
    }),
});
