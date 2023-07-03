export const getCurrentDraft = () => {
    
        const currentDraftId = localStorage.getItem("currentDraft")
        if(!currentDraftId) {
            throw new Error
        }
        return currentDraftId
    
}

export const setCurrentDraft = (draftId: string) => {
    localStorage.setItem("currentDraft", draftId)
}