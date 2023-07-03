import { createContext, useCallback, useLayoutEffect, useState } from "react"
import DraftEdit from "~/components/dashboard/DraftEdit"
import { type NextPageWithLayout } from "../_app"
import { createDashboardLayout } from "~/components/layouts/CreateLayout"
import { getCurrentDraft } from "~/utils/currentDrafts"
import { api } from "~/utils/api"



const DraftEditor: NextPageWithLayout = () => {
    let contents: JSX.Element = <></>
    const [currentDraftId, setCurrentDraftId ] = useState('')
    useLayoutEffect(() => {
        setCurrentDraftId(getCurrentDraft())
    }, [currentDraftId])
    const enabledQueryToggle = currentDraftId === '' ? false : true
    const currentDraft = api.draft.getOwnDraft.useQuery({
        id: currentDraftId
    }, {
        enabled: enabledQueryToggle,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
    
    if(currentDraft.isSuccess) {
        const data = currentDraft.data
        contents = <DraftEdit {...data}/>
    }
    return (
        <>
            {contents}
        </>
    )
}

createDashboardLayout(DraftEditor)

export default DraftEditor