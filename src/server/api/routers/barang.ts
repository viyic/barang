import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Barang, barang } from "~/server/db/schema";

export const barangRouter = createTRPCRouter({
  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     await ctx.db.insert(posts).values({
  //       name: input.name,
  //       createdById: ctx.session.user.id,
  //     });
  //   }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.barang.findMany({
      with: {
        kategori: true,
        satuan: true,
      },
      limit: 10,
      // orderBy: (barang, { desc }) => [desc(barang.id)],
    });
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
