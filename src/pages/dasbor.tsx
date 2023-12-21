import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { forwardRef, useRef } from "react";
import Layout from "~/components/Layout";

import { api } from "~/utils/api";

export default function Dasbor() {
  const barang = api.barang.getAll.useQuery();
  const satuan = api.satuan.getAll.useQuery();
  const kategori = api.kategori.getAll.useQuery();
  const kasir = api.kasir.getAll.useQuery();
  const transaksi = api.transaksi.getThisMonthCount.useQuery();

  const modalTambah = useRef<HTMLDialogElement>(null);
  const modalEdit = useRef<HTMLDialogElement>(null);

  const showModalTambah = () => {
    if (modalTambah.current) {
      modalTambah.current.showModal();
    }
  };

  const showModalEdit = () => {
    if (modalEdit.current) {
      modalEdit.current.showModal();
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
  // const formatRupiah = (jumlah) => {
  //     return `Rp. ${jumlah.toLocaleString('id')}`;
  // };

  // const tambah = () => {
  //     axios.post(`<?= base_url() ?>api`, document.querySelector('#formTambah'), {
  //             headers: {
  //                 'Content-Type': 'multipart/form-data',
  //             }
  //         })
  //         .then((response) => {
  //             if (response.status == 201) {
  //                 openToast('Berhasil menambah barang');
  //             }
  //         })
  //         .catch((error) => {
  //             console.log(error);
  //             openToast('Gagal menambah barang');
  //         });
  // }
  // const edit = () => {
  //     const id = document.querySelector('#editId').value;
  //     axios.post(`<?= base_url() ?>api/${id}`, document.querySelector('#formEdit'), {
  //             headers: {
  //                 'Content-Type': 'multipart/form-data',
  //             }
  //         })
  //         .then((response) => {
  //             if (response.status == 201) {
  //                 openToast('Berhasil menambah barang');
  //             }
  //         })
  //         .catch((error) => {
  //             console.log(error);
  //             openToast('Gagal menambah barang');
  //         });
  // }
  // const showEditModal = (id) => {
  //     axios.get(`<?= base_url() ?>api/${id}`)
  //         .then((response) => {
  //             const data = response.data;
  //             document.querySelector('#editId').value = data.id;
  //             document.querySelector('#editNama').value = data.nama;
  //             document.querySelector('#editHargaBeli').value = data.hargabeli;
  //             document.querySelector('#editHargaJual').value = data.hargajual;
  //             document.querySelector('#editSatuan').value = data.id_satuan;
  //             document.querySelector('#editKategori').value = data.id_kategori;
  //             modalEdit.showModal();
  //         })
  //         .catch((error) => {
  //             openToast(error);
  //         })
  // };
  // const hapus = (id) => {
  //     axios.delete(`<?= base_url() ?>api/${id}`)
  //         .then(() => {
  //             location.reload();
  //         })
  //         .catch((error) => {
  //             openToast('Gagal menghapus barang')
  //         })
  // };
  // new gridjs.Grid({
  //     columns: ['ID', 'Nama', {
  //         name: 'Harga Beli',
  //         formatter: (cell) => formatRupiah(cell),
  //     }, {
  //         name: 'Harga Jual',
  //         formatter: (cell) => formatRupiah(cell),
  //     }, 'Satuan', 'Kategori', 'Keterangan', {
  //         name: 'Aksi',
  //         formatter: (cell) => gridjs.html(`<div class="flex gap-4 justify-center"><button class="btn btn-primary" onclick="showEditModal('${cell}')">Edit</button><button class="btn btn-error" onclick="hapus(${cell})">Hapus</button></div>`),
  //     }],
  //     search: true,
  //     pagination: true,
  //     data: [
  //         <?php foreach ($barang as $b) :
  //             echo "['$b->id', '$b->nama', $b->hargabeli, $b->hargajual, '$b->nama_satuan', '$b->nama_kategori', '$b->keterangan', '$b->id'],";
  //         endforeach; ?>
  //     ]
  // }).render(document.getElementById('table'));

  return (
    <Layout title="Dasbor">
      {/* {barang.data
            ? barang.data.map((b) => (
                <li>
                  {b.nama} - {b.hargaBeli}
                </li>
              ))
            : "Loading"}
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase /> */}

      <div className="container mx-auto">
        <div className="mt-4 text-4xl font-bold">Dasbor</div>
        {/* Modal Tambah */}
        <ModalTambah ref={modalTambah} />

        {/* <!-- Modal Edit --> */}
        <ModalEdit ref={modalEdit} />
        {/* {kasir.data ? <li>{kasir.data}</li> : "Loading"} */}
        <div className="grid grid-cols-3 gap-4">
          <Link href="/barang">
            <div className="card mt-4 bg-success text-4xl shadow-xl">
              <div className="card-body">
                {barang.data != undefined
                  ? `${barang.data.length} Barang`
                  : "Memuat..."}
              </div>
            </div>
          </Link>
          <Link href="/kasir">
            <div className="card mt-4 bg-error text-4xl shadow-xl">
              <div className="card-body">
                {kasir.data != undefined
                  ? `${kasir.data.length} Kasir`
                  : "Memuat..."}
              </div>
            </div>
          </Link>
          <Link href="/transaksi">
            <div className="card mt-4 bg-info text-4xl shadow-xl">
              <div className="card-body">
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

const ModalTambah = forwardRef<HTMLDialogElement>((props, ref) => {
  const submit = () => {
    // empty
  };

  return (
    <dialog id="modalTambah" ref={ref} className="modal" {...props}>
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="pb-4 text-center text-lg font-bold">Tambah Barang</h3>
        <form id="formTambah">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="ID"
              name="id"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="Nama Barang"
              name="nama"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="Harga Beli"
              name="harga_beli"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="Harga Jual"
              name="harga_jual"
              className="input input-bordered w-full max-w-xs"
            />
            <select
              name="id_satuan"
              className="select select-bordered w-full max-w-xs"
            >
              <option value="">Pilih Satuan</option>
              {/* <?php foreach ($satuan as $s) : ?>
                                        <option value="<?= $s->id ?>"><?= $s->nama ?> (<?= $s->kode ?>)</option>
                                    <?php endforeach; ?> */}
            </select>
            <select
              name="id_kategori"
              className="select select-bordered w-full max-w-xs"
            >
              <option value="">Pilih Kategori</option>
              {/* <?php foreach ($kategori as $k) : ?>
                                        <option value="<?= $k->id ?>"><?= $k->nama ?></option>
                                    <?php endforeach; ?> */}
            </select>
            <textarea
              name="keterangan"
              placeholder="Keterangan"
              rows={4}
              className="textarea textarea-bordered"
            ></textarea>
            <div className="text-right">
              <button
                type="button"
                className="btn btn-primary"
                onClick={submit}
              >
                Buat
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
});

const ModalEdit = forwardRef<HTMLDialogElement>((props, ref) => {
  const submit = () => {
    // empty
  };

  return (
    <dialog id="modalEdit" className="modal" ref={ref} {...props}>
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="pb-4 text-center text-lg font-bold">Edit Barang</h3>
        <form id="formEdit">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="ID Barang"
              id="editId"
              name="id"
              className="input input-bordered w-full max-w-xs"
              disabled
            />
            <input
              type="text"
              placeholder="Nama Barang"
              id="editNama"
              name="nama"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="Harga Beli"
              id="editHargaBeli"
              name="harga_beli"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="Harga Jual"
              id="editHargaJual"
              name="harga_jual"
              className="input input-bordered w-full max-w-xs"
            />
            <select
              id="editSatuan"
              name="id_satuan"
              className="select select-bordered w-full max-w-xs"
            >
              <option value="">Pilih Satuan</option>
              {/* <?php foreach ($satuan as $s) : ?>
                                    <option value="<?= $s->id ?>"><?= $s->nama ?> (<?= $s->kode ?>)</option>
                                <?php endforeach; ?> */}
            </select>
            <select
              id="editKategori"
              name="id_kategori"
              className="select select-bordered w-full max-w-xs"
            >
              <option value="">Pilih Kategori</option>
              {/* <?php foreach ($kategori as $k) : ?>
                                    <option value="<?= $k->id ?>"><?= $k->nama ?></option>
                                <?php endforeach; ?> */}
            </select>
            <textarea
              id="editKeterangan"
              name="keterangan"
              placeholder="Keterangan"
              rows={4}
              className="textarea textarea-bordered"
            ></textarea>
            <div className="text-right">
              <button className="btn btn-primary" onClick={submit}>
                Buat
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
});
