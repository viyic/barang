import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type Kasir, kasir } from "~/server/db/schema";
import CryptoJS from "crypto-js";
import { eq } from "drizzle-orm";

export const kasirRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.kasir.findMany({
      // orderBy: (barang, { desc }) => [desc(barang.id)],
    });
  }),

  checkLogin: publicProcedure
    .input(
      z.object({ username: z.string().min(1), password: z.string().min(1) }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.kasir.findFirst({
        where: (kasir, { eq, and }) =>
          and(
            eq(kasir.username, input.username),
            eq(
              kasir.password,
              CryptoJS.MD5(
                CryptoJS.MD5(
                  CryptoJS.MD5(input.password).toString(),
                ).toString(),
              ).toString(),
            ),
          ),
        // orderBy: (barang, { desc }) => [desc(barang.id)],
      });
      return !!result;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.query.kasir.findFirst({
        where: (kasir, { eq }) => eq(kasir.id, input.id),
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        nama: z.string().min(1),
        status: z.string().min(1),
        username: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input: { password, ...rest } }) => {
      const kasirNew: Kasir = {
        password: CryptoJS.MD5(
          CryptoJS.MD5(CryptoJS.MD5(password).toString()).toString(),
        ).toString(),
        ...rest,
      };
      return ctx.db.insert(kasir).values(kasirNew);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        nama: z.string().min(1),
        status: z.string().min(1),
        username: z.string().min(1),
        password: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input: { id, password, ...rest } }) => {
      const kasirEdit = {
        password: password
          ? CryptoJS.MD5(
              CryptoJS.MD5(CryptoJS.MD5(password).toString()).toString(),
            ).toString()
          : undefined,
        ...rest,
      };
      return ctx.db.update(kasir).set(kasirEdit).where(eq(kasir.id, id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(kasir).where(eq(kasir.id, input.id));
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
