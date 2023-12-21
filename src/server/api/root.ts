import { createTRPCRouter } from "~/server/api/trpc";
import { barangRouter } from "./routers/barang";
import { satuanRouter } from "./routers/satuan";
import { kategoriRouter } from "./routers/kategori";
import { kasirRouter } from "./routers/kasir";
import { transaksiRouter } from "./routers/transaksi";
import { channelRouter } from "./routers/channel";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  barang: barangRouter,
  satuan: satuanRouter,
  kategori: kategoriRouter,
  kasir: kasirRouter,
  transaksi: transaksiRouter,
  channel: channelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
