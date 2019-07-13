import React, { Component } from "react";
import Layout from "../components/Layout";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { files: "word.docx" };
  }

  componentDidMount = async () => {
    const link = "http://localhost:3001/upload";
    let response = await fetch(link);
    let data = response.json();

    this.setState({
      file: data
    });
  };

  render() {
    return (
      <Layout>
        <h2>Uploaded Files</h2>
        {this.state.files}
      </Layout>
    );
  }
}
