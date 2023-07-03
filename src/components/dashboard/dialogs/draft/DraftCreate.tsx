import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { createId } from "@paralleldrive/cuid2";
import { useRouter } from "next/router";
import { setCurrentDraft } from "~/utils/currentDrafts";
import Link from "next/link";
import { useSession } from "next-auth/react";

type DraftCreateProps = {
    handleClose: () => void;
}

const DraftCreate = ({handleClose}: DraftCreateProps) => {
    let contents = <></>
    const session = useSession({
        required: true,
        onUnauthenticated() {
            throw new Error("UNAUTHENTICATED")
        }
    })

    const linkRef = useRef<HTMLAnchorElement>(null)
    const [draftTitle, setDraftTitle] = useState("")

    const draftMutater = api.draft.createDraft.useMutation({onSuccess(data) {
        setCurrentDraft(data.id)
        setDraftTitle('')
        linkRef.current?.click()
        handleClose()
    },})
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDraftTitle(e.currentTarget.value)
    }
    const handleSubmit = () => {
        const draftId = createId()
        draftMutater.mutate({title: draftTitle, id: draftId})
    }
    if(session.status === "authenticated") {
        contents = (
            <>
            <h3>Create Draft</h3>
            <form method="dialog">
                <input type="text" onChange={(e) => handleChange(e)}></input>
                <button type="reset" onClick={handleClose}>Cancel Draft</button>
                <button type="submit" onClick={handleSubmit}>Create Draft</button>
            </form>
            <Link ref={linkRef} rel="noopener" href={`/dashboard/draft-editor`}></Link>
            </>
        )
    }
    return (
        <>{contents} </>
               
    )
}

export default DraftCreate