import React, { Component } from "react";
import "./App.css";
// import Nes from "@hapi/nes";
// const client = new Nes.Client("ws://192.168.18.37:8000");
import { w3cwebsocket as wsSocket } from "websocket";
const client = new wsSocket("ws://192.168.0.115:8000");

class App extends Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {};
  //   }
  state = {
    usr: "",
    isLoggedIn: false,
    messages: [],
  };
  sendMessage = (value) => {
    client.send(
      JSON.stringify({
        type: "message",
        msg: this.state.msg,
        sender: this.state.usr,
      })
    );
  };
  handleChange = (e) => {
    console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isLoggedIn: true, usr: this.state.usr });
  };
  componentDidMount() {
    client.onopen = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log("websocket client connected");
      this.setState((s) => ({
        messages: dataFromServer,
      }));
    };
    client.onmessage = (message) => {
      console.log(message);
      const dataFromServer = JSON.parse(message.data);
      console.log("got reply! ", dataFromServer);
      if (dataFromServer.type === "message") {
        this.setState((s) => ({
          messages: [
            ...s.messages,
            { msg: dataFromServer.msg, usr: dataFromServer.usr },
          ],
        }));
      } else {
        this.setState((s) => ({
          messages: dataFromServer,
        }));
      }
    };
  }

  render() {
    return (
      <>
        {console.log(client)}
        <div>
          {this.state.isLoggedIn ? (
            <>
              <div
                className="row col-md-12"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <div
                  className="col-md-6"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <input
                    className="form-control"
                    type="text"
                    name="msg"
                    onChange={this.handleChange}
                    style={{
                      display: "flex",
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => this.sendMessage()}
                    style={{
                      display: "flex",
                    }}
                  >
                    Send Message
                  </button>
                </div>
                <div className="col-md-6">
                  {this.state.messages
                    .sort((a, b) => a.timestamp < b.timestamp)
                    .map((d) => (
                      <p key={d.id}>
                        message:{d.msg}, user:{d.sender}
                      </p>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className="col-md-12"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <form
                  className="col-md-6"
                  onSubmit={this.handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <input
                    className="form-control"
                    type="text"
                    name="usr"
                    onChange={this.handleChange}
                    style={{
                      display: "flex",
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    style={{
                      display: "flex",
                    }}
                  >
                    Login
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}
export default App;
