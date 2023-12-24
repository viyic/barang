import Link from "next/link";
import Layout from "~/components/Layout";

import { api } from "~/utils/api";

export default function Dasbor() {
  const barang = api.barang.getAll.useQuery();
  const kasir = api.kasir.getAll.useQuery();
  const transaksi = api.transaksi.getThisMonthCount.useQuery();

  return (
    <Layout title="Dasbor">
      <div className="container mx-auto">
        <div className="mt-4 text-4xl font-bold">Dasbor</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link href="/barang">
            <div className="card mt-4 h-full bg-success text-4xl shadow-xl">
              <div className="card-body justify-end">
                {barang.data != undefined
                  ? `${barang.data.length} Barang`
                  : "Memuat..."}
              </div>
            </div>
          </Link>
          <Link href="/kasir">
            <div className="card mt-4 h-full bg-error text-4xl shadow-xl">
              <div className="card-body justify-end">
                {kasir.data != undefined
                  ? `${kasir.data.length} Kasir`
                  : "Memuat..."}
              </div>
            </div>
          </Link>
          <Link href="/transaksi">
            <div className="card mt-4 h-full bg-info text-4xl shadow-xl">
              <div className="card-body justify-end">
                {transaksi.data != undefined
                  ? `${transaksi.data} Transaksi Bulan Ini`
                  : "Memuat..."}
              </div>
            </div>
          </Link>
        </div>

        <div
          className="toast toast-center toast-top hidden opacity-0 transition"
          id="toast"
        >
          <div className="alert alert-error" id="alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error! Task failed successfully.</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
