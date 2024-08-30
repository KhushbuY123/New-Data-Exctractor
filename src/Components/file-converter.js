
import { RemoveRedEye } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import { ResizableBox } from "react-resizable";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useEffect, useMemo, useState } from "react";
import InvoiceEdit from "./InvoiceEditor";

var pdfjsLib = window["pdfjs-dist/build/pdf"];
pdfjsLib.GlobalWorkerOptions.workerSrc = "./assets/js/pdf.worker.js";

function FileConverter({ pdfUrl }) {
  const myRef = React.createRef();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoader, setDataLoader] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [numOfPages, setNumOfPages] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, [imageUrls]);

  const handleClickOpen = (url, index) => {
    setSelectedImage({ url, index });
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedImage(null);
    setOpen(false);
  };

  const UrlUploader = (url) => {
    fetch(url).then((response) => {
      response.blob().then((blob) => {
        let reader = new FileReader();
        reader.onload = (e) => {
          const data = atob(e.target.result.replace(/.*base64,/, ""));
          renderPage(data);
        };
        reader.readAsDataURL(blob);
      });
    });
  };

  useMemo(() => {
    UrlUploader(pdfUrl);
  }, []);

  const renderPage = async (data) => {
    setLoading(true);
    const imagesList = [];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("className", "canv");
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    for (let i = 1; i <= pdf.numPages; i++) {
      var page = await pdf.getPage(i);
      var viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      var render_context = {
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
      };
      await page.render(render_context).promise;
      let img = canvas.toDataURL("image/png");
      imagesList.push(img);
    }
    setNumOfPages((e) => e + pdf.numPages);
    setImageUrls((e) => [...e, ...imagesList]);
  };

  useEffect(() => {
    myRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [imageUrls]);

  const ExtractData = async (base64Images) => {
    setDataLoader(true);
    try {
      if (!base64Images || base64Images.length === 0) {
        console.log("Please select at least one file");
        return;
      }

      const response = await fetch("http://localhost:4000/pdfupload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Images }),
      });

      const data = await response.json();
      setExtractedData(data?.extractedTexts);

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      console.log("Finally");
      setDataLoader(false);
    }
  };

  const cleanAndParseJson = (rawJson) => {
    const cleanedJsonString = rawJson
      .replace(/^```json\s*/, "")
      .replace(/\s*```$/, "");
    try {
      const parsedJson = JSON.parse(cleanedJsonString);
      return parsedJson;
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  return (
    <Box sx={{ my: 4, textAlign: "center" }} ref={myRef} id="image-container">
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {imageUrls.length > 0 && (
            <>
              <h4 className="drop-file-preview__title">
                Number Of Pages - {numOfPages}
              </h4>
              <Button
                sx={{ background: "lightblue", marginBottom: "20px" }}
                onClick={() => ExtractData(imageUrls)}
              >
                Extract Data from PDF
              </Button>
              <Box display="flex">
              <ResizableBox
                width={500}
                height={500}
                minConstraints={[200, 400]}
                maxConstraints={[900, 400]}
                resizeHandles={["e"]}
                axis="x"
              >
                <Grid container>
                  <Grid
                    container
                    item
                    xs={12}
                    sm={3}
                    sx={{ marginLeft: { xs: "0", sm: "10rem" } }}
                  >
                    {imageUrls.map((url, index) => (
                      <Grid item xs={12} key={index}>
                        <Box
                          sx={{
                            width: "100%",
                            height: "220px",
                            cursor: "pointer",
                          }}
                          className="img-card"
                        >
                          <img
                            src={url}
                            alt={`Page ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ position: "absolute", top: 2, right: 2 }}
                          >
                            <IconButton
                              onClick={() => handleClickOpen(url, index)}
                              className="btn-bg"
                            >
                              <RemoveRedEye />
                            </IconButton>
                          </Stack>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </ResizableBox>
                {dataLoader ? (
                  <Box sx={{ alignSelf: "center",margin:"auto"}}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box>
                    {extractedData?.map((item, index) => (
                      <InvoiceEdit
                        key={index}
                        initialData={cleanAndParseJson(item)}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </>
          )}
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

export default FileConverter;
