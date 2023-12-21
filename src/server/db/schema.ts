import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
  bigint,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  char,
  double,
  datetime,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `${name}`); // `barang_${name}`);

export const barang = mysqlTable("barang", {
  id: char("id", { length: 15 }).primaryKey(),
  nama: varchar("nama", { length: 200 }).notNull(),
  hargaBeli: double("hargabeli").notNull(),
  hargaJual: double("hargajual").notNull(),
  idSatuan: char("id_satuan", { length: 5 })
    .references(() => satuan.id)
    .notNull(),
  idKategori: char("id_kategori", { length: 5 }).references(() => kategori.id),
  qr: text("qr"),
  keterangan: text("keterangan"),
});

export const kategori = mysqlTable("kategori", {
  id: char("id", { length: 5 }).primaryKey(),
  nama: varchar("nama", { length: 200 }),
});

export const satuan = mysqlTable("satuan", {
  id: char("id", { length: 5 }).primaryKey(),
  nama: varchar("nama", { length: 200 }),
  kode: varchar("kode", { length: 50 }),
});

export const barangRelations = relations(barang, ({ one }) => ({
  kategori: one(kategori, {
    fields: [barang.idKategori],
    references: [kategori.id],
  }),
  satuan: one(satuan, {
    fields: [barang.idSatuan],
    references: [satuan.id],
  }),
}));

export const kasir = mysqlTable("kasir", {
  id: char("id", { length: 25 }).primaryKey(),
  nama: varchar("nama", { length: 200 }).notNull(),
  status: char("status", { length: 2 }).notNull(),
  username: varchar("username", { length: 200 }).notNull(),
  password: text("password").notNull(),
});

export const channel = mysqlTable("channel", {
  id: char("id", { length: 5 }).primaryKey(),
  nama: varchar("nama", { length: 200 }),
});

export const transaksi = mysqlTable("transaksi", {
  id: char("id", { length: 25 }).primaryKey(),
  nama: varchar("nama", { length: 200 }).notNull(),
  total: double("total").notNull(),
  ppn: double("ppn").notNull(),
  idChannel: char("id_channel", { length: 5 }).notNull(),
  ref: text("ref").notNull(),
  tanggalTransaksi: datetime("tgl_transaksi")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  idKasir: char("id_kasir", { length: 5 }).notNull(),
  keterangan: text("keterangan").notNull(),
});

export const transaksiRelations = relations(transaksi, ({ one }) => ({
  kasir: one(kasir, {
    fields: [transaksi.idKasir],
    references: [kasir.id],
  }),
  channel: one(channel, {
    fields: [transaksi.idChannel],
    references: [channel.id],
  }),
}));

export const transaksiDetail = mysqlTable("transaksiDetail", {
  id: char("id", { length: 25 }).primaryKey(),
  idTransaksi: char("id_transaksi", { length: 25 }),
  idBarang: char("id_barang", { length: 15 }),
  namaBarang: varchar("nama_barang", { length: 200 }),
  hargaBeli: double("hargabeli"),
  hargaJual: double("hargajual"),
  satuan: char("satuan", { length: 50 }),
  jumlaBeli: int("jumlah_beli").notNull(),
  kategori: varchar("kategori", { length: 200 }),
  retur: char("retur", { length: 2 }),
  idKasir: char("id_kasir", { length: 5 }),
});

export const transaksiDetailRelations = relations(
  transaksiDetail,
  ({ one }) => ({
    transaksi: one(transaksi, {
      fields: [transaksiDetail.idTransaksi],
      references: [transaksi.id],
    }),
    barang: one(barang, {
      fields: [transaksiDetail.idBarang],
      references: [barang.id],
    }),
  }),
);

export type Barang = InferSelectModel<typeof barang>;
export type Kasir = InferSelectModel<typeof kasir>;
export type Kategori = InferSelectModel<typeof kategori>;
export type Satuan = InferSelectModel<typeof satuan>;
export type Transaksi = InferSelectModel<typeof transaksi>;
