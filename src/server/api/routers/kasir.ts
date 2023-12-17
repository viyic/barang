import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { kasir } from "~/server/db/schema";
import CryptoJS from "crypto-js";

export const kasirRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
