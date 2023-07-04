import type { Category, Image, Tag } from '@prisma/client';


type Props = {
    id: string;
    title: string;
    content: string;
    metaDescription: string;
    createdAt: Date;
    updatedAt: Date | null;
    authorId: string;
    seriesPostOrder: number | null;
    seriesCount: number;
} & {
    series: {id: string; title: string;} | null;
    images: Image[];
    categories: Category[];
    tags: Tag[];
}

/*
* NOTES *
Outside of the Composer:
title, metaDescription, createdAt, updatedAt, authorId
Then also:
series & seriesPostOrder
images
categories
tags
*/
const DraftEdit = (draftEditorProps: Props) => {
/*     const { id,
        title,
        content,
        metaDescription,
        createdAt,
        updatedAt,
        authorId,
        seriesPostOrder,
        seriesCount,
        series,
        images,
        categories,
        tags
    } = draftEditorProps */

    return (
        <>
        {JSON.stringify(draftEditorProps)}
        </>
    )
}

export default DraftEdit