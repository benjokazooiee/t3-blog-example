import { type NextPage } from "next";
import Head from "next/head";
import DraftCreateInsert from "~/components/dashboard/dialogs/draft/DraftCreateInsert";

const Test: NextPage = () => {
    return (
        <>
        <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="w-[80dvw] break-all mx-auto">
        <DraftCreateInsert />
        </main>
        </>
    )
}

export default Test