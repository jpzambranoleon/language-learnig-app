import { Send } from "@mui/icons-material";
import {
  Box,
  createTheme,
  CssBaseline,
  Divider,
  IconButton,
  InputBase,
  Link,
  List,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Message from "./components/Message";
import MuiDrawer from "./components/MuiDrawer";
import Navbar from "./Navbar";
// import Chatbot from "./pages/Chatbot";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
      sx={{ mt: 2, mb: 2, display: { xl: "none", xs: "block" } }}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://leonedigitale.com/">
        Leone Digitale
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const mdTheme = createTheme();

function App() {
  const [input, setInput] = useState("");
  const scrollRef = useRef();
  const [chatLog, setChatLog] = useState([]);

  // clear chats
  function clearChat() {
    setChatLog([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    setInput("");
    setChatLog(chatLogNew);

    const messages = chatLogNew.map((message) => message.message).join("\n");

    const response = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
      }),
    });

    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  return (
    <div className="App">
      <ThemeProvider theme={mdTheme}>
        <Box
          sx={{
            display: "flex",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
          }}
        >
          <CssBaseline />
          <MuiDrawer />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: { xl: "100vh", xs: "none" },
              overflow: "auto",
              position: { xl: "relative", xs: "none" },
            }}
          >
            <Toolbar />
            <Box
              sx={{
                height: "84vh",
                overflow: "auto",
              }}
            >
              <List>
                {chatLog.map((message, index) => (
                  <div ref={scrollRef}>
                    <Message message={message} key={index} />
                  </div>
                ))}
              </List>
            </Box>
            <Box
              sx={{
                position: "fixed",
                right: 0,
                left: 0,
                bottom: 0,
                backgroundColor: "blue",
              }}
            >
              <Box
                component="form"
                sx={{
                  bgcolor: "red",
                  display: "flex",
                  p: "2px 4px",
                  alignItems: "center",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="What's on your mind?"
                  inputProps={{ "aria-label": "what's on your mind" }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton
                  color="primary"
                  sx={{ p: "10px" }}
                  aria-label="directions"
                  onClick={handleSubmit}
                >
                  <Send />
                </IconButton>
              </Box>
              <Copyright />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
