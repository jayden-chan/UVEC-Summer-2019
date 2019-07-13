import React, {Component} from 'react';
import Layout from '../components/Layout';
import Button from '@material-ui/core/Button';
import Dropzone from 'react-dropzone';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
    };

    this.handleAcceptedFiles = this.handleAcceptedFiles.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = async () => {
    if (!localStorage.getItem('guugle-login-token')) {
      this.props.history.push('/login');
    }
  };

  handleAcceptedFiles(acceptedFiles) {
    const currentFiles = this.state.files;
    const newFiles = currentFiles.concat(acceptedFiles);

    this.setState({files: newFiles});
  }

  handleSubmit() {
    const formData = new FormData();

    this.state.files.forEach(f => formData.append(f.name, f));

    fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: localStorage.getItem('guugle-login-token'),
      },
    }).then(res => {
      if (res.status !== 201) {
        res.text().then(text => alert(text));
      } else {
        toast.success('File uploaded!');
      }
    });
  }

  render() {
    return (
      <Layout>
        <Dropzone onDrop={this.handleAcceptedFiles}>
          {({getRootProps, getInputProps}) => (
            <section>
              <div
                style={{
                  flex: 1,
                  width: '50%',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  marginTop: '2em',
                  marginBottom: '2em',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '50px',
                  borderWidth: 2,
                  borderRadius: 2,
                  borderColor: '#eeeeee',
                  borderStyle: 'dashed',
                  backgroundColor: '#fafafa',
                  color: '#bdbdbd',
                  outline: 'none',
                }}
                {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
        <ul>
          {this.state.files.map(f => {
            return <li key={f.name}>{f.name}</li>;
          })}
        </ul>
        <Button onClick={this.handleSubmit} variant="contained" color="primary">
          Upload
        </Button>
        <ToastContainer hideProgressBar />
      </Layout>
    );
  }
}
