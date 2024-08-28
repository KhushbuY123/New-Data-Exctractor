import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import InvoiceEdit from "./InvoiceEditor";
import { RemoveRedEye } from "@mui/icons-material";
import SplitPane from "react-split-pane";

var pdfjsLib = window["pdfjs-dist/build/pdf"];
pdfjsLib.GlobalWorkerOptions.workerSrc = "./assets/js/pdf.worker.js";

function ImgFile({ file }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoader, setDataLoader] = useState(false);
  const [jsonData, setJsonData] = useState();
  const [selectedImage, setSelectedImage] = useState(null);

  const cleanAndParseJson = (rawJson) => {
    const cleanedJsonString = rawJson
      .replace(/^```json\s*/, "")
      .replace(/\s*```$/, "");
    try {
      const parsedJson = JSON.parse(cleanedJsonString);
      setJsonData(parsedJson);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  // const handleClickOpen = (url) => {
  //   setSelectedImage({ url });
  //   setOpen(true);
  // };

  const handleClose = () => {
    setSelectedImage(null);
    setOpen(false);
  };

  const ExtractData = async (file) => {
    setJsonData();
    if (!file) return;
    setDataLoader(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      cleanAndParseJson(data.extractedText);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setDataLoader(false);
    }
  };

  return (
    <Box sx={{ my: 4, textAlign: "center" }} id="image-container">
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <h4 className="drop-file-preview__title">File</h4>
          <Button sx={{ background: "lightblue",marginBottom:"20px" }} onClick={() => ExtractData(file)}>
            Extract Data
          </Button>
          <SplitPane
            split="vertical"
            defaultSize="50%"
            minSize={100}
            maxSize={-100}
            resizerStyle={{
              width: '5px',
              cursor: 'col-resize',
              backgroundColor: '#ccc',
              margin: '0px 2px',
              height: '100%',
            }}
            paneStyle={{ overflow: 'auto' }}
          >
            <Grid container item xs={12} sm={9} sx={{margin:"auto"}}>
              <Box
                sx={{ width: "100%", cursor: "pointer" }}
                className="img-card"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="img"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
                {/* <Stack
                  direction="row"
                  spacing={1}
                  sx={{ position: "absolute", top: 2, right: 2 }}
                >
                  <IconButton
                    onClick={() => handleClickOpen(URL.createObjectURL(file))}
                    className="btn-bg"
                  >
                    <RemoveRedEye />
                  </IconButton>
                </Stack> */}
              </Box>
            </Grid>

            <Grid
              container
              item
              xs={9}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {jsonData && <InvoiceEdit initialData={jsonData} />}
              {dataLoader && (
                <Box sx={{ alignSelf: "center" }}>
                  <CircularProgress />
                </Box>
              )}
            </Grid>
          </SplitPane>
        </>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Preview</DialogTitle>
        <DialogContent dividers={true}>
          <img
            src={selectedImage?.url}
            alt={selectedImage?.url}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ImgFile;
