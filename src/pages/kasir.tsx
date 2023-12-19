import { useRef } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import Layout from "~/components/Layout";
import { type Kasir } from "~/server/db/schema";

import { api } from "~/utils/api";

export default function BarangPage() {
  const kasirList = api.kasir.getAll.useQuery();

  const utils = api.useUtils().client;

  const tambahModal = useRef<HTMLDialogElement>(null);
  const editModal = useRef<HTMLDialogElement>(null);

  const tambah = api.kasir.create.useMutation();
  const tambahForm = useForm<Kasir>();
  const tambahOnSubmit: SubmitHandler<Kasir> = (data) => {
    console.log(data);
    tambah.mutate(data, { onSettled: () => void kasirList.refetch() });
    tambahModal.current?.close();
    tambahForm.reset();
  };

  const edit = api.kasir.update.useMutation();
  const editForm = useForm<Kasir>();
  const editOnSubmit: SubmitHandler<Kasir> = (data) => {
    console.log(data);
    edit.mutate(data, { onSettled: () => void kasirList.refetch() });
    editModal.current?.close();
  };

  const hapusBarang = api.kasir.delete.useMutation();
  const hapus = (id: string) => {
    hapusBarang.mutate({ id }, { onSettled: () => void kasirList.refetch() });
  };

  const tambahModalShow = () => {
    if (tambahModal.current) {
      tambahModal.current.showModal();
    }
  };

  const editModalShow = async (id: string) => {
    const editKasir = await utils.kasir.getById.query({
      id,
    });
    if (editKasir) {
      console.log(editKasir);
      editForm.setValue("nama", editKasir.nama);
      editForm.setValue("id", editKasir.id);
      editForm.setValue("username", editKasir.username);
      editForm.setValue("password", "");
      editForm.setValue("status", editKasir.status);
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
    <Layout title="Kasir">
      <div className="container mx-auto">
        <div className="mt-4 text-4xl font-bold">Kasir</div>
        <button type="button" className="btn mt-4" onClick={tambahModalShow}>
          Tambah
        </button>
        <div className="mt-4 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                {[
                  "ID",
                  "Nama Kasir",
                  "Username",
                  "Status",
                  // "Password",
                  "Aksi",
                ].map((v, i) => (
                  <th key={i}>{v}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kasirList.status == "loading" ? (
                <tr>
                  <td colSpan={5} className="h-48 text-center text-xl">
                    <span className="loading loading-spinner loading-lg"></span>
                    <br />
                    Memuat...
                  </td>
                </tr>
              ) : (
                kasirList.data?.map((k) => (
                  <tr className="hover" key={k.id}>
                    <td>{k.id}</td>
                    <td>{k.nama}</td>
                    <td>{k.username}</td>
                    <td>{k.status}</td>
                    <td className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          void editModalShow(k.id);
                        }}
                        className="btn btn-info"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          hapus(k.id);
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
            <h3 className="pb-4 text-center text-lg font-bold">Tambah Kasir</h3>
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
                  placeholder="Nama Kasir"
                  {...tambahForm.register("nama", { required: true })}
                  className="input input-bordered"
                />
                <input
                  type="text"
                  placeholder="Nama Pengguna"
                  {...tambahForm.register("username", { required: true })}
                  className="input input-bordered"
                />
                <input
                  type="password"
                  placeholder="Password"
                  {...tambahForm.register("password", { required: true })}
                  className="input input-bordered"
                />
                <select
                  {...tambahForm.register("status", { required: true })}
                  className="select select-bordered"
                >
                  <option value="">Pilih Status</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
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
            <h3 className="pb-4 text-center text-lg font-bold">Edit Kasir</h3>
            <form id="formEdit" onSubmit={editForm.handleSubmit(editOnSubmit)}>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="ID Kasir"
                  id="editId"
                  className="input input-bordered"
                  {...editForm.register("id", { required: true })}
                  disabled
                />
                <input
                  type="text"
                  placeholder="Nama Kasir"
                  id="editNama"
                  className="input input-bordered"
                  {...editForm.register("nama", { required: true })}
                />
                <input
                  type="text"
                  placeholder="Nama Pengguna"
                  {...editForm.register("username", { required: true })}
                  className="input input-bordered"
                />
                <input
                  type="text"
                  placeholder="Password"
                  {...editForm.register("password")}
                  className="input input-bordered"
                />
                <select
                  {...editForm.register("status", { required: true })}
                  className="select select-bordered"
                >
                  <option value="">Pilih Status</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
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
