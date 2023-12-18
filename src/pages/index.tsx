import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, forwardRef, useRef, useState } from "react";

import { api } from "~/utils/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const usernameHandleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const passwordHandleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const kasir = api.kasir.checkLogin.useQuery(
    { username, password },
    { enabled: false },
  );

  const login = () => {
    kasir
      .refetch()
      .then((result) => {
        if (result.data) {
          location.href = "/dasbor";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Head>
        <title>Dasbor</title>
        <meta name="description" content="Barang" />
        <link rel="icon" href="/favicon.ico" />
        {/* <link
          rel="stylesheet"
          href="https://unpkg.com/gridjs/dist/theme/mermaid.min.css"
        />
        <script
          src="https://unpkg.com/gridjs/dist/gridjs.umd.js"
          async
        ></script>
        <script src="https://unpkg.com/axios/dist/axios.min.js" async></script>
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@4.4.19/dist/full.min.css"
          rel="stylesheet"
          type="text/css"
        /> */}
      </Head>

      <main
        data-theme="nord"
        className="flex h-full min-h-screen flex-col items-center justify-center"
      >
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body flex flex-col items-center gap-4">
            <h2 className="card-title">Masuk</h2>
            <input
              type="text"
              className="input input-bordered"
              value={username}
              onChange={usernameHandleChange}
              placeholder="Nama Pengguna"
            />
            <input
              type="password"
              className="input input-bordered"
              value={password}
              onChange={passwordHandleChange}
              placeholder="Kata Sandi"
            />
            <button type="button" className="btn btn-primary" onClick={login}>
              Masuk
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.post.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined },
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
