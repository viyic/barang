import Head from "next/head";
import { useRouter } from "next/router";
import { type SubmitHandler, useForm } from "react-hook-form";

import { api } from "~/utils/api";

export default function Login() {
  const router = useRouter();
  const utils = api.useUtils().client;

  type Login = { username: string; password: string };
  const loginForm = useForm<Login>();
  const loginOnSubmit: SubmitHandler<Login> = async (data) => {
    const check = await utils.kasir.checkLogin.query(data);
    if (check) {
      void router.push("/dasbor");
    } else {
      console.log("Error");
    }
  };

  return (
    <>
      <Head>
        <title>Dasbor</title>
        <meta name="description" content="Barang" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        data-theme="nord"
        className="flex h-full min-h-screen flex-col items-center justify-center"
      >
        <div className="card w-96 bg-base-100 shadow-xl">
          <form onSubmit={loginForm.handleSubmit(loginOnSubmit)}>
            <div className="card-body flex flex-col items-center gap-4">
              <h2 className="card-title">Masuk</h2>
              <input
                type="text"
                className="input input-bordered"
                {...loginForm.register("username")}
                placeholder="Nama Pengguna"
              />
              <input
                type="password"
                className="input input-bordered"
                {...loginForm.register("password")}
                placeholder="Kata Sandi"
              />
              <button type="submit" className="btn btn-primary">
                Masuk
              </button>
            </div>
          </form>
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
