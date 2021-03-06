import React, { Component } from "react";
import Layout from "../components/Layout";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    console.log(this.state);
    fetch("http://localhost:3001/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(res => {
        if (res.status === 201) {
          this.props.history.push("/upload");
        } else {
          res.text().then(text => {
            alert(text);
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    event.preventDefault();
  }

  render() {
    return (
      <Layout>
        <Container component="main" maxWidth="xs">
          <div>
            <Typography component="h1" variant="h5">
              Create an account
            </Typography>
            <form noValidate onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={this.state.username}
                onChange={this.handleChange}
                id="username"
                label="Username"
                name="username"
                autoComplete="text"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </form>
          </div>
        </Container>
      </Layout>
    );
  }
}
