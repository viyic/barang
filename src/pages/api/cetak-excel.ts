import { api } from "~/utils/api";
import ExcelJs from "exceljs";
import { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const caller = appRouter.createCaller(await createTRPCContext({ req, res }));
  const barangList = await caller.barang.getAll();

  const wb = new ExcelJs.Workbook();
  const ws = wb.addWorksheet("My Sheet");
  ws.addRows([
    [
      "ID",
      "Nama",
      "Harga Beli",
      "Harga Jual",
      "Satuan",
      "Kategori",
      "QR",
      "Keterangan",
    ],
    ...barangList.map((v) => [
      v.id,
      v.nama,
      v.hargaBeli,
      v.hargaJual,
      v.satuan.nama,
      v.kategori?.nama,
      v.qr,
      v.keterangan,
    ]),
  ]);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader("Content-Disposition", "attachment; filename=" + "cetak.xlsx");

  await wb.xlsx.write(res);
}
