import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Layout from "~/components/Layout";
import { Barang } from "~/server/db/schema";

import { api } from "~/utils/api";

export default function BarangPage() {
  const barangList = api.barang.getAll.useQuery();
  const satuanList = api.satuan.getAll.useQuery();
  const kategoriList = api.kategori.getAll.useQuery();

  const utils = api.useUtils().client;

  const tambahModal = useRef<HTMLDialogElement>(null);
  const editModal = useRef<HTMLDialogElement>(null);

  const tambahBarang = api.barang.create.useMutation();
  const tambahForm = useForm<Barang>();
  const tambahOnSubmit: SubmitHandler<Barang> = (data) => {
    console.log(data);
    tambahBarang.mutate(data, { onSettled: () => void barangList.refetch() });
    tambahModal.current?.close();
    tambahForm.reset();
  };

  const editBarang = api.barang.update.useMutation();
  const editForm = useForm<Barang>();
  const editOnSubmit: SubmitHandler<Barang> = (data) => {
    console.log(data);
    editBarang.mutate(data, { onSettled: () => void barangList.refetch() });
    editModal.current?.close();
  };

  const hapusBarang = api.barang.delete.useMutation();
  const hapus = (id: string) => {
    hapusBarang.mutate({ id }, { onSettled: () => void barangList.refetch() });
  };

  const tambahModalShow = () => {
    if (tambahModal.current) {
      tambahModal.current.showModal();
    }
  };

  const editModalShow = async (id: string) => {
    const editBarang = await utils.barang.getById.query({
      id,
    });
    if (editBarang) {
      console.log(editBarang);
      editForm.setValue("nama", editBarang.nama);
      editForm.setValue("id", editBarang.id);
      editForm.setValue("hargaBeli", editBarang.hargaBeli);
      editForm.setValue("hargaJual", editBarang.hargaJual);
      editForm.setValue("keterangan", editBarang.keterangan);
      editForm.setValue("idKategori", editBarang.idKategori);
      editForm.setValue("idSatuan", editBarang.idSatuan);
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
  const formatRupiah = (jumlah: number) => {
    return `Rp. ${jumlah.toLocaleString("id")}`;
  };

  // new Grid({
  //   columns: [
  //     "ID",
  //     "Nama",
  //     {
  //       name: "Harga Beli",
  //       formatter: (cell) => formatRupiah(cell),
  //     },
  //     {
  //       name: "Harga Jual",
  //       formatter: (cell) => formatRupiah(cell),
  //     },
  //     "Satuan",
  //     "Kategori",
  //     "Keterangan",
  //     {
  //       name: "Aksi",
  //       formatter: (cell) =>
  //         gridjs.html(
  //           `<div class="flex gap-4 justify-center"><button class="btn btn-primary" onclick="showEditModal('${cell}')">Edit</button><button class="btn btn-error" onclick="hapus(${cell})">Hapus</button></div>`,
  //         ),
  //     },
  //   ],
  //   search: true,
  //   pagination: true,
  //   data: [
  //     // <?php foreach ($barang as $b) :
  //     //     echo "['$b->id', '$b->nama', $b->hargabeli, $b->hargajual, '$b->nama_satuan', '$b->nama_kategori', '$b->keterangan', '$b->id'],";
  //     // endforeach; ?>
  //   ],
  // }).render(document.getElementById("table"));
  /* <AuthShowcase /> */

  return (
    <Layout title="Barang">
      <div className="container mx-auto">
        <div className="mt-4 text-4xl font-bold">Barang</div>
        <button type="button" className="btn mt-4" onClick={tambahModalShow}>
          Tambah
        </button>
        {/* <div id="table"></div> */}

        {/* {kasir.data ? <li>{kasir.data}</li> : "Loading"} */}
        <div className="mt-4 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                {[
                  "ID",
                  "Nama Barang",
                  "Harga Beli",
                  "Harga Jual",
                  "Satuan",
                  "Kategori",
                  // "QR Code",
                  "Keterangan",
                  "Aksi",
                ].map((v, i) => (
                  <th key={i}>{v}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {barangList.status == "loading" ? (
                <tr>
                  <td colSpan={8} className="h-48 text-center text-xl">
                    <span className="loading loading-spinner loading-lg"></span>
                    <br />
                    Memuat...
                  </td>
                </tr>
              ) : (
                barangList.data?.map((b) => (
                  <tr className="hover" key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.nama}</td>
                    <td>{formatRupiah(b.hargaBeli)}</td>
                    <td>{formatRupiah(b.hargaJual)}</td>
                    <td>{b.satuan?.nama}</td>
                    <td>{b.kategori?.nama}</td>
                    <td>{b.keterangan}</td>
                    <td className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          void editModalShow(b.id);
                        }}
                        className="btn btn-info"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          hapus(b.id);
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
              Tambah Barang
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
                  placeholder="Nama Barang"
                  {...tambahForm.register("nama", { required: true })}
                  className="input input-bordered"
                />
                <input
                  type="text"
                  placeholder="Harga Beli"
                  {...tambahForm.register("hargaBeli", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="input input-bordered"
                />
                <input
                  type="text"
                  placeholder="Harga Jual"
                  {...tambahForm.register("hargaJual", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="input input-bordered"
                />
                <select
                  {...tambahForm.register("idSatuan", { required: true })}
                  className="select select-bordered"
                >
                  <option value="">Pilih Satuan</option>
                  {satuanList.data?.map((v) => (
                    <option value={v.id} key={v.id}>
                      {v.nama} ({v.kode})
                    </option>
                  ))}
                </select>
                <select
                  {...tambahForm.register("idKategori", { required: true })}
                  className="select select-bordered"
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriList.data?.map((v) => (
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
            <h3 className="pb-4 text-center text-lg font-bold">Edit Barang</h3>
            <form id="formEdit" onSubmit={editForm.handleSubmit(editOnSubmit)}>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="ID Barang"
                  id="editId"
                  className="input input-bordered"
                  {...editForm.register("id", { required: true })}
                  disabled
                />
                <input
                  type="text"
                  placeholder="Nama Barang"
                  id="editNama"
                  className="input input-bordered"
                  {...editForm.register("nama", { required: true })}
                />
                <input
                  type="text"
                  placeholder="Harga Beli"
                  id="editHargaBeli"
                  className="input input-bordered"
                  {...editForm.register("hargaBeli", { valueAsNumber: true })}
                />
                <input
                  type="text"
                  placeholder="Harga Jual"
                  id="editHargaJual"
                  className="input input-bordered"
                  {...editForm.register("hargaJual", { valueAsNumber: true })}
                />
                <select
                  id="editSatuan"
                  className="select select-bordered"
                  {...editForm.register("idSatuan", { required: true })}
                >
                  <option value="">Pilih Satuan</option>
                  {satuanList.data?.map((v) => (
                    <option value={v.id} key={v.id}>
                      {v.nama} ({v.kode})
                    </option>
                  ))}
                </select>
                <select
                  id="editKategori"
                  className="select select-bordered"
                  {...editForm.register("idKategori", { required: true })}
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriList.data?.map((v) => (
                    <option value={v.id} key={v.id}>
                      {v.nama}
                    </option>
                  ))}
                </select>
                <textarea
                  id="editKeterangan"
                  placeholder="Keterangan"
                  rows={4}
                  className="textarea textarea-bordered"
                  {...editForm.register("keterangan")}
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
