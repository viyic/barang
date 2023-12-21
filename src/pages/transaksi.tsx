import { useRef } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import Layout from "~/components/Layout";
import { type Transaksi } from "~/server/db/schema";

import { api } from "~/utils/api";

export default function BarangPage() {
  const transaksiList = api.transaksi.getAll.useQuery();
  const channelList = api.channel.getAll.useQuery();
  const kasirList = api.kasir.getAll.useQuery();

  const utils = api.useUtils().client;

  const tambahModal = useRef<HTMLDialogElement>(null);
  const editModal = useRef<HTMLDialogElement>(null);

  const tambah = api.transaksi.create.useMutation();
  const tambahForm = useForm<Transaksi>();
  const tambahOnSubmit: SubmitHandler<Transaksi> = (data) => {
    console.log(data);
    tambah.mutate(data, { onSettled: () => void transaksiList.refetch() });
    tambahModal.current?.close();
    tambahForm.reset();
  };

  const edit = api.transaksi.update.useMutation();
  const editForm = useForm<Transaksi>();
  const editOnSubmit: SubmitHandler<Transaksi> = (data) => {
    console.log(data);
    edit.mutate(data, { onSettled: () => void transaksiList.refetch() });
    editModal.current?.close();
  };

  const hapusBarang = api.transaksi.delete.useMutation();
  const hapus = (id: string) => {
    hapusBarang.mutate(
      { id },
      { onSettled: () => void transaksiList.refetch() },
    );
  };

  const tambahModalShow = () => {
    if (tambahModal.current) {
      tambahModal.current.showModal();
    }
  };

  const editModalShow = async (id: string) => {
    const editKasir = await utils.transaksi.getById.query({
      id,
    });
    if (editKasir) {
      console.log(editKasir);
      editForm.setValue("id", editKasir.id);
      editForm.setValue("nama", editKasir.nama);
      editForm.setValue("total", editKasir.total);
      editForm.setValue("ppn", editKasir.ppn);
      editForm.setValue("idChannel", editKasir.idChannel);
      editForm.setValue("ref", editKasir.ref);
      editForm.setValue("tanggalTransaksi", editKasir.tanggalTransaksi);
      editForm.setValue("idKasir", editKasir.idKasir);
      editForm.setValue("keterangan", editKasir.keterangan);
      editModal.current?.showModal();
    }
  };

  // const openToast = (text) => {
  //     const toast = document.querySelector('#toast');
  //     toast.textContent = text;
  //     toast.classList.remove('hidden');
  //     toast.classList.remove('opacity-0');
  //     setTimeout(() => {
  //         toast.classList.add('opacity-0');
  //         setTimeout(() => {
  //             toast.classList.add('hidden')
  //         }, 1000);
  //     }, 5000);
  // }

  return (
    <Layout title="Transaksi">
      <div className="container mx-auto">
        <div className="mt-4 text-4xl font-bold">Transaksi</div>
        <button type="button" className="btn mt-4" onClick={tambahModalShow}>
          Tambah
        </button>
        <div className="mt-4 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                {[
                  "ID",
                  "Nama Transaksi",
                  "Total",
                  "PPN",
                  "Channel",
                  "Ref",
                  "Tanggal Transaksi",
                  "Kasir",
                  "Keterangan",
                  "Aksi",
                ].map((v, i) => (
                  <th key={i}>{v}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transaksiList.status == "loading" ? (
                <tr>
                  <td colSpan={10} className="h-48 text-center text-xl">
                    <span className="loading loading-spinner loading-lg"></span>
                    <br />
                    Memuat...
                  </td>
                </tr>
              ) : (
                transaksiList.data?.map((t) => (
                  <tr className="hover" key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.nama}</td>
                    <td>{t.total}</td>
                    <td>{t.ppn}</td>
                    <td>{t.channel.nama}</td>
                    <td>{t.ref}</td>
                    <td>{t.tanggalTransaksi.toISOString()}</td>
                    <td>{t.kasir.nama}</td>
                    <td>{t.keterangan}</td>
                    <td className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          void editModalShow(t.id);
                        }}
                        className="btn btn-info"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          hapus(t.id);
                        }}
                        className="btn btn-error"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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

        <dialog id="tambahModal" ref={tambahModal} className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="pb-4 text-center text-lg font-bold">
              Tambah Transaksi
            </h3>
            <form
              id="formTambah"
              onSubmit={tambahForm.handleSubmit(tambahOnSubmit)}
            >
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="ID"
                  {...tambahForm.register("id", { required: true })}
                  className="input input-bordered"
                />
                <input
                  type="text"
                  placeholder="Nama Transaksi"
                  {...tambahForm.register("nama", { required: true })}
                  className="input input-bordered"
                />
                <input
                  type="text"
                  placeholder="Total"
                  {...tambahForm.register("total", { required: true })}
                  className="input input-bordered"
                />
                <input
                  type="text"
                  placeholder="PPN"
                  {...tambahForm.register("ppn", { required: true })}
                  className="input input-bordered"
                />
                <select
                  {...tambahForm.register("idChannel", { required: true })}
                  className="select select-bordered"
                >
                  <option value="">Pilih Channel</option>
                  {channelList.data?.map((v) => (
                    <option value={v.id} key={v.id}>
                      {v.nama}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Ref"
                  {...tambahForm.register("ref", { required: true })}
                  className="input input-bordered"
                />
                {/* <input
                  type="date"
                  // placeholder="Tanggal "
                  {...tambahForm.register("tanggalTransaksi", {
                    required: true,
                  })}
                  className="input input-bordered"
                /> */}
                <select
                  {...tambahForm.register("idKasir", { required: true })}
                  className="select select-bordered"
                >
                  <option value="">Pilih Kasir</option>
                  {kasirList.data?.map((v) => (
                    <option value={v.id} key={v.id}>
                      {v.nama}
                    </option>
                  ))}
                </select>
                <textarea
                  {...tambahForm.register("keterangan")}
                  placeholder="Keterangan"
                  rows={4}
                  className="textarea textarea-bordered"
                ></textarea>
                <div className="text-right">
                  <button type="submit" className="btn btn-success">
                    Buat
                  </button>
                </div>
              </div>
            </form>
          </div>
        </dialog>

        <dialog id="editModal" className="modal" ref={editModal}>
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="pb-4 text-center text-lg font-bold">
              Edit Transaksi
            </h3>
            <form id="formEdit" onSubmit={editForm.handleSubmit(editOnSubmit)}>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="ID"
                  {...editForm.register("id", { required: true })}
                  className="input input-bordered"
                />
                <input
                  type="text"
                  placeholder="Nama Transaksi"
                  {...editForm.register("nama", { required: true })}
                  className="input input-bordered"
                />
                <input
                  type="text"
                  placeholder="Total"
                  {...editForm.register("total", { required: true })}
                  className="input input-bordered"
                />
                <input
                  type="text"
                  placeholder="PPN"
                  {...editForm.register("ppn", { required: true })}
                  className="input input-bordered"
                />
                <select
                  {...editForm.register("idChannel", { required: true })}
                  className="select select-bordered"
                >
                  <option value="">Pilih Channel</option>
                  {channelList.data?.map((v) => (
                    <option value={v.id} key={v.id}>
                      {v.nama}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Ref"
                  {...editForm.register("ref", { required: true })}
                  className="input input-bordered"
                />
                <input
                  type="date"
                  // placeholder="Tanggal "
                  {...editForm.register("tanggalTransaksi", {
                    required: true,
                  })}
                  className="input input-bordered"
                />
                <select
                  {...editForm.register("idKasir", { required: true })}
                  className="select select-bordered"
                >
                  <option value="">Pilih Kasir</option>
                  {kasirList.data?.map((v) => (
                    <option value={v.id} key={v.id}>
                      {v.nama}
                    </option>
                  ))}
                </select>
                <textarea
                  {...editForm.register("keterangan")}
                  placeholder="Keterangan"
                  rows={4}
                  className="textarea textarea-bordered"
                ></textarea>
                <div className="text-right">
                  <button className="btn btn-success" type="submit">
                    Simpan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </Layout>
  );
}
