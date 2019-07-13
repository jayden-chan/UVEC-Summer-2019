import React, { Component } from 'react'
import Layout from './Layout'
import {useDropzone} from 'react-dropzone';
import Button from "@material-ui/core/Button";
import Dropzone from "react-dropzone"

export default function DropZone() {

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));


  function manageFetch() {
    console.log("Fetch")
  }

  function onDrop(acceptedFiles) {
    console.log(acceptedFiles)
  }

  return (
    <Layout>
      <Dropzone onDrop={onDrop} multiple >
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            Click me to upload a file!
          </div>
        )}
      </Dropzone>
      <Button onClick={manageFetch} variant="contained" color="primary">
        Upload
      </Button>
      <ul>
        {acceptedFiles.length > 0 && acceptedFiles.map(acceptedFile => (
          <li>
            {acceptedFile.name}
          </li>
        ))}
      </ul>
    </Layout>
  );

}
