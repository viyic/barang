/* eslint-disable @next/next/no-img-element */
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  Printer,
} from "@phosphor-icons/react";
import Head from "next/head";
import Image from "next/image";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Layout from "~/components/Layout";
import { Barang } from "~/server/db/schema";

import { api } from "~/utils/api";

export default function BarangPage() {
  const limit = 10;
  const [barangPage, setBarangPage] = useState(0);
  const [barangSearch, setBarangSearch] = useState("");
  const barangList = api.barang.getAll.useQuery({
    search: barangSearch,
    offset: barangPage * limit,
    limit,
  });

  const handleBarangSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setBarangPage(0);
    setBarangSearch(e.target.value);
  };
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

  const [editImage, setEditImage] = useState("");
  const [editImageId, setEditImageId] = useState("");

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
      setEditImage("");
      setEditImageId(editBarang.id);
      editModal.current?.showModal();
    }
  };

  // const imageOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   try {
  //     const formData = new FormData(event?.currentTarget);
  //     const response = await fetch("/api/upload-gambar", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     // const data = await response.json();
  //     // console.log(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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

  return (
    <Layout title="Barang">
      <div className="container mx-auto">
        <div className="mt-4 text-4xl font-bold">Barang</div>
        <button type="button" className="btn mt-4" onClick={tambahModalShow}>
          Tambah
        </button>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setBarangPage(barangPage - 1)}
              disabled={barangPage <= 0}
            >
              <CaretLeft size={24} />
            </button>
            <p>Halaman {barangPage + 1}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setBarangPage(barangPage + 1)}
            >
              <CaretRight size={24} />
            </button>
          </div>
          <a
            href="/api/cetak-excel"
            className="btn btn-success"
            target="_blank"
          >
            <Printer size={24} />
            Cetak Excel
          </a>
          <div className="flex items-center gap-4">
            <MagnifyingGlass size={24} />
            <input
              type="text"
              className="input input-bordered"
              placeholder="Cari"
              value={barangSearch}
              onChange={handleBarangSearch}
            />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                {[
                  "ID",
                  "Nama Barang",
                  "Gambar",
                  "Harga Beli",
                  "Harga Jual",
                  "Satuan",
                  "Kategori",
                  // "QR Code",
                  "Keterangan",
                  "Aksi",
                ].map((v, i) => (
                  <th key={i} className={v == "Aksi" ? "w-0" : undefined}>
                    {v}
                  </th>
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
                    <td>
                      <img
                        src={`/img/barang/${b.id}.png`}
                        className="rounded-btn"
                        width={100}
                        onError={(e) => {
                          const element = e.target as HTMLImageElement;
                          element.remove();
                        }}
                      />
                    </td>
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

                <ImageUpload imageId={editImageId} />

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

const ImageUpload = ({ imageId }: { imageId: string }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const imagePreviewRef = useRef<HTMLImageElement>(null);
  const imageOnSubmit = async () => {
    if (imageRef.current?.files?.[0]) {
      try {
        const formData = new FormData();
        formData.append("id", imageId);
        formData.append("image", imageRef.current.files[0]);
        await fetch("/api/upload-gambar", {
          method: "POST",
          body: formData,
        });
        if (imagePreviewRef.current?.src) {
          imagePreviewRef.current.src = imagePreviewRef.current.src;
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <input
        type="file"
        accept="image/png"
        ref={imageRef}
        onChange={imageOnSubmit}
        hidden
      />
      <img
        src={`/img/barang/${imageId}.png`}
        className="w-1/2 rounded-btn"
        ref={imagePreviewRef}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "";
        }}
      />
      <button
        type="button"
        className="btn btn-square btn-info"
        onClick={() => imageRef.current?.click()}
      >
        <Camera />
      </button>
    </div>
  );
};
