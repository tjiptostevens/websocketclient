import React, { Component } from "react";
import "./App.css";
// import Nes from "@hapi/nes";
// const client = new Nes.Client("ws://192.168.18.37:8000");
import { w3cwebsocket as wsSocket } from "websocket";
const client = new wsSocket("ws://192.168.18.37:8000");

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
        msg: value,
        sender: this.state.usr,
      })
    );
  };
  handleChange = (e) => {
    console.log(e.target.value);
    this.setState({ usr: e.target.value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isLoggedIn: true, usr: this.state.usr });
  };
  componentDidMount() {
    client.onopen = () => {
      console.log("websocket client connected");
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
              <button
                className="btn btn-primary"
                onClick={() => this.sendMessage("Hello!")}
              >
                Send Message
              </button>
              {this.state.messages.map((d) => (
                <p>
                  message:{d.msg}, user:{d.usr}
                </p>
              ))}
            </>
          ) : (
            <>
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="usr" onChange={this.handleChange} />
                <button className="btn btn-primary">Login</button>
              </form>
            </>
          )}
        </div>
      </>
    );
  }
}
export default App;
