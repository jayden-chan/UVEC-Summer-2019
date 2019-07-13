import React, { Component } from "react";
import Layout from "../components/Layout";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Dropzone from "react-dropzone";
import styled from "styled-components";

export const Staging = styled.div`
  border-width: 2;
  border-radius: 2;
  border-color: #eeeeee;
  border-style: dashed;
  margin: 0.5em;
  width: 50%;
  margin-right: auto;
  margin-left: auto;
`;

export const Uploaded = styled.ul`
  width: 80%;
  margin-right: auto;
  margin-left: auto;
  text-align: left;
  list-style-type: dash;
`;

export const Item = styled.li`
  margin-bottom: 0.5em;
  padding: 0.15em;
  border-width: 2;
  border-color: #eeeeee;
  border-style: solid;
  :hover {
    background-color: #eeeeee;
  }
`;

export default class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: []
    };

    this.handleAcceptedFiles = this.handleAcceptedFiles.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.unstageFile = this.unstageFile.bind(this);
  }

  handleAcceptedFiles(acceptedFiles) {
    const currentFiles = this.state.files;
    const newFiles = currentFiles.concat(acceptedFiles);

    this.setState({ files: newFiles });
  }

  handleSubmit() {
    const formData = new FormData();

    this.state.files.forEach(f => formData.append(f.name, f));

    fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: localStorage.getItem("guugle-login-token")
      }
    }).then(res => {
      console.log(res.status);
    });
  }

  render() {
    return (
      <Layout>
        <Dropzone onDrop={this.handleAcceptedFiles}>
          {({ getRootProps, getInputProps }) => (
            <section>
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
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
        <Staging>
          <h3>Staging Zone</h3>
          <Uploaded>
            {this.state.files.map(f => {
              return (
                <Item key={f.name}>
                  "{f.name}"
                  <IconButton
                    style={{ marginLeft: "0.5em" }}
                    variant="outlined"
                    color="secondary"
                    onClick={this.unstageFile(f.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Item>
              );
            })}
          </Uploaded>
        </Staging>
        <Button onClick={this.handleSubmit} variant="contained" color="primary">
          Upload
        </Button>
      </Layout>
    );
  }
}
