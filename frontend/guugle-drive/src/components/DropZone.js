import React, { Component, useState } from "react";
import Layout from "./Layout";
import { useDropzone } from "react-dropzone";
import Button from "@material-ui/core/Button";
import Dropzone from "react-dropzone";

export default function DropZone() {
  const [file, setFiles] = useState();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  function manageFetch(acceptedFiles) {
    var formData = new FormData();

    for (var file in acceptedFiles) {
      formData.append(file.name, file);
    }

    console.log("formData:");
    console.log(formData);
    const link = "http://localhost:3001/upload";
    fetch(link, {
      method: "POST",
      body: acceptedFiles
    });
  }

  function onDrop(acceptedFiles) {
    return (
      <ul>
        {acceptedFiles.length > 0 &&
          acceptedFiles.map(acceptedFile => (
            <li key={acceptedFiles.length}>{acceptedFile.name}</li>
          ))}
      </ul>
    );
  }

  return (
    <Layout>
      <Dropzone onDrop={onDrop} multiple>
        {({ getRootProps, getInputProps }) => (
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
        )}
      </Dropzone>
      <Button onClick={manageFetch} variant="contained" color="primary">
        Upload
      </Button>
      {acceptedFiles}
      {onDrop}
    </Layout>
  );
}
