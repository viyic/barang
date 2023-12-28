import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type Barang, barang } from "~/server/db/schema";

export const barangRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          offset: z.number().optional(),
          limit: z.number().optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.barang.findMany({
        with: {
          kategori: true,
          satuan: true,
        },
        offset: input?.offset,
        limit: input?.limit,
        where: (barang, { or, like }) => {
          if (input?.search) {
            const search = `%${input.search}%`;
            return or(
              like(barang.id, search),
              like(barang.nama, search),
              like(barang.hargaBeli, search),
              like(barang.hargaJual, search),
              like(barang.idSatuan, search),
              like(barang.idKategori, search),
              like(barang.qr, search),
              like(barang.keterangan, search),
            );
          } else {
            return undefined;
          }
        },
        // orderBy: (barang, { desc }) => [desc(barang.id)],
      });
    }),
  getAllCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.select({ count: sql<number>`count('*')` }).from(barang);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.query.barang.findFirst({
        with: {
          kategori: true,
          satuan: true,
        },
        where: (barang, { eq }) => eq(barang.id, input.id),
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        nama: z.string().min(1),
        hargaBeli: z.number(),
        hargaJual: z.number(),
        idSatuan: z.string().min(1),
        idKategori: z.string().nullable(),
        keterangan: z.string().nullable(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const barangNew: Barang = {
        ...input,
        qr: "testing",
      };
      return ctx.db.insert(barang).values(barangNew);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        nama: z.string().min(1),
        hargaBeli: z.number(),
        hargaJual: z.number(),
        idSatuan: z.string().min(1),
        idKategori: z.string().nullable(),
        keterangan: z.string().nullable(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const barangEdit: Barang = {
        ...input,
        qr: "testing",
      };
      return ctx.db
        .update(barang)
        .set(barangEdit)
        .where(eq(barang.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(barang).where(eq(barang.id, input.id));
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
