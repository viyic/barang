import Head from "next/head";
import Link from "next/link";
import { type PropsWithChildren } from "react";

export default function Layout({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  const links = [
    { url: "/dasbor", text: "Dasbor" },
    { url: "/barang", text: "Barang" },
    { url: "/kasir", text: "Kasir" },
    { url: "/transaksi", text: "Transaksi" },
  ];

  const linksHtml = links.map((v, i) => (
    <li key={i}>
      <Link className="font-bold" href={v.url}>
        {v.text}
      </Link>
    </li>
  ));

  return (
    <>
      <Head>
        <title>{title}</title>
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

      <main data-theme="nord" className="min-h-screen">
        <div className="navbar bg-accent">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
              >
                {linksHtml}
                {/* <li>
                  <a>Parent</a>
                  <ul className="p-2">
                    <li>
                      <a>Submenu 1</a>
                    </li>
                    <li>
                      <a>Submenu 2</a>
                    </li>
                  </ul>
                </li> */}
              </ul>
            </div>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">{linksHtml}</ul>
          </div>
          <div className="navbar-end">
            <a className="btn">Log out</a>
          </div>
        </div>
        <div className="container mx-auto">{children}</div>
      </main>
    </>
  );
}
