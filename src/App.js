import React, { useState } from "react";
import "./App.css";
import { Grid } from "@mui/material";
import FileInput from "./Components/file-input";
import Navbar from "./Components/Front-End/Navbar";
import Sidebar from "./Components/Front-End/Sidebar";
import FileConverter from "./Components/file-converter";
import ImgFile from "./Components/img-file";

export const primary = "#176ede";

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [imgFile, setImgFile] = useState(null);

  return (
    <div style={{ height: "100dvh", display: 'flex'}}>
      <Sidebar />
      <div style={{ flexGrow: 1 }}>
        <Navbar />
        <Grid container sx={{ py:18, px:4}}>
          <Grid item className="box">
            <FileInput
              onFileChange={(file) => setPdfFile(file)}
              setImgFile={setImgFile}
            />
          </Grid>
          {pdfFile && (
            <Grid item sx={{ width: "100%" }}>
              <FileConverter
                pdfUrl={URL.createObjectURL(pdfFile)}
                fileName={pdfFile.name}
              />
            </Grid>
          )}
          {imgFile && (
            <Grid item sx={{ width: "100%" }}>
              <ImgFile
                file={imgFile}
              />
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
}

export default App;
