import { useEffect, useRef, useState } from "react"
import DraftCreate from "./DraftCreate"

const DraftCreateInsert = () => {
    const [isOpened, setIsOpened] = useState(false)
    const dialogRef = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        if(!!isOpened) {
            dialogRef.current?.showModal()
        } else {
            dialogRef.current?.close()
        }
    }, [isOpened])
    
    return (
        <>
                <button onClick={() => setIsOpened(true)}>Create Draft</button>
                <dialog ref={dialogRef} onCancel={() => setIsOpened(false)}>
        <DraftCreate handleClose={() => setIsOpened(false)} />
        </dialog>
        </>
    )
}

export default DraftCreateInsert