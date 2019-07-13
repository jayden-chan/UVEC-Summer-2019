import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import Layout from './Layout'

export default class DropZone extends Component {

  render() {
    return (
      <Layout>
      <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
        {({getRootProps, getInputProps}) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag & drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
  </Layout>
    );
  
  }
}
