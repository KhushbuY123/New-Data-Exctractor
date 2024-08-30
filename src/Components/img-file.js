import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import { ResizableBox } from "react-resizable";
import 'react-resizable/css/styles.css';
import InvoiceEdit from "./InvoiceEditor";

function ImgFile({ file }) {
  const [loading, setLoading] = useState(false);
  const [dataLoader, setDataLoader] = useState(false);
  const [jsonData, setJsonData] = useState();

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
          <Button sx={{ background: "lightblue", marginBottom: "20px" }} onClick={() => ExtractData(file)}>
            Extract Data
          </Button>
          <Box display="flex">
            <ResizableBox
              width={500}
              height={500}
              minConstraints={[200, 400]}
              maxConstraints={[900, 400]}
              axis="x"
              resizeHandles={['e']}
            >
              <Box sx={{ width: "100%", height: "100%", cursor: "pointer" }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt="img"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </ResizableBox>
            <Box flexGrow={1} sx={{ display: "flex", flexDirection: "column", overflow: "auto" }}>
              {jsonData && <InvoiceEdit initialData={jsonData} />}
              {dataLoader && (
                <Box sx={{ alignSelf: "center" }}>
                  <CircularProgress />
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default ImgFile;
