import { type NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { getExtension } from "~/utils/extension";

type ImgUpload = {
  title: string;
  alt: string;
  file: File | null | undefined;
}

const NoDeleteImagePlaceholder: NextPage = () => {
  let contents: JSX.Element | undefined
  const [imgUpload, setImgUpload ] = useState<ImgUpload>({
    title: "",
    alt: "",
    file: undefined,
  })
  const authorId = api.author.getOwnAuthorId.useQuery()
  const presignedPost = api.image.getPresignedPost.useMutation()
  const createImage = api.image.createImage.useMutation({onSettled( data, error ) {
    console.log(JSON.stringify(data))
    console.log(JSON.stringify(error))
  },})
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, propertyName: keyof Omit<ImgUpload, "file">) => {
    const value = e.target.value
    setImgUpload((prevState) => {
      return {
        ...prevState,
        [propertyName]: value,
      }
    })

  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    
    if(!!fileList) {
      const newFile = fileList[0]
      if(!!newFile) {
        setImgUpload((prevState) => {
          return {
            ...prevState,
            file: newFile
          }
        })

      }
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>, imgUpload: ImgUpload ) => {
    e.preventDefault()
    const file = imgUpload.file
    if(!!file) {
      const fileType = getExtension(file.name)
      const {url, fields} = await presignedPost.mutateAsync({fileType})
      const form = new FormData()
    Object.entries(fields).forEach(([key, value]) => {
        form.append(key, value)
    })
    form.append("file", file)
    const res = await fetch(url, {
        method: "POST",
        body: form,
    })
      if(!!res.ok) {
        createImage.mutate({
          title: imgUpload.title,
          alt: imgUpload.alt,
          fileType: fileType,
        })
      }
    }
  }
  if(!authorId.isSuccess) {
    contents = (<>
      <p>
        no author id yet
      </p>
    </>)
  } else {
    contents = (
      <form>
                <label htmlFor="img-title">Title<input id="img-title" type="text" className="border-2"
                onChange={(e) => handleTextChange(e, "title")}></input></label>
                <label htmlFor="img-alt">Alt<input id="img-alt" type="text" className="border-2"
                onChange={(e) => handleTextChange(e, "alt")}></input></label>
                <label htmlFor="img-file">File<input id="img-file" type="file" accept="image/png, image/jpeg" className="border-2"
                onChange={handleFileChange}></input></label>
                <button type="submit" onClick={(e) => void handleSubmit(e, imgUpload)}>Submit</button>
            </form>
    )
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
            {contents}
        </div>
      </main>
    </>
  );
};

export default NoDeleteImagePlaceholder

