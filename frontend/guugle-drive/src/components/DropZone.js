import React, { useCallback } from "react";
import Layout from "./Layout";
import { useDropzone } from "react-dropzone";
import Button from "@material-ui/core/Button";

export default function DropZone() {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

    const files = acceptedFiles.map(file => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    ));

  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles);
    return <p>hello</p>;
  });

  function manageFetch(acceptedFiles) {
    var formData = new FormData();

      for (var file in acceptedFiles) {
        console.log('name');
        console.log(file.name);
        formData.append(file.name, file);
      }

      console.log('formData:');
      console.log(formData);
      const link = 'http://localhost:3001/upload';
      fetch(link, {
        method: 'POST',
        body: acceptedFiles,
      });
    }

    const onDrop = useCallback(acceptedFiles => {
      const reader = new FileReader();

  return (
    <Layout>
      <div
        style={{
          flex: 1,
          width: "50%",
          marginRight: "auto",
          marginLeft: "auto",
          marginTop: "2em",
          marginBottom: "2em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "50px",
          borderWidth: 2,
          borderRadius: 2,
          borderColor: "#eeeeee",
          borderStyle: "dashed",
          backgroundColor: "#fafafa",
          color: "#bdbdbd",
          outline: "none"
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        Click me to upload a file!
      </div>
      <Button onClick={manageFetch} variant="contained" color="primary">
        Upload
      </Button>
      {files}
    </Layout>
  );
}
