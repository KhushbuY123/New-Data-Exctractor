import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Typography, Paper, Box, Snackbar, Alert } from '@mui/material';

const InvoiceEdit = ({ initialData = {} }) => {
  const [data, setData] = useState(initialData);
  
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = data.ProductDetails.map((product, i) =>
      i === index ? { ...product, [name]: value } : product
    );
    setData((prevData) => ({
      ...prevData,
      ProductDetails: updatedProducts
    }));
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  const uploadJSONToServer = async (jsonData) => {
    try {
      const response = await fetch('http://localhost:4000/api/upload-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('Invoice uploaded:', result);
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <>
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Edit Invoice</Typography>
      <form>
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>Invoice Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                name="InvoiceNumber"
                value={data?.InvoiceInformation?.InvoiceNumber || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    InvoiceInformation: {
                      ...data.InvoiceInformation,
                      InvoiceNumber: e.target.value
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Invoice Date"
                name="InvoiceDate"
                value={data?.InvoiceInformation?.InvoiceDate || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    InvoiceInformation: {
                      ...data.InvoiceInformation,
                      InvoiceDate: e.target.value
                    }
                  })
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>Supplier Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Supplier Name"
                name="SupplierName"
                value={data?.SupplierInformation?.SupplierName || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    SupplierInformation: {
                      ...data.SupplierInformation,
                      SupplierName: e.target.value
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="Address"
                value={data?.SupplierInformation?.Address || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    SupplierInformation: {
                      ...data.SupplierInformation,
                      Address: e.target.value
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GSTIN"
                name="GSTIN"
                value={data?.SupplierInformation?.GSTIN || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    SupplierInformation: {
                      ...data.SupplierInformation,
                      GSTIN: e.target.value
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile"
                name="Mobile"
                value={data?.SupplierInformation?.Mobile || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    SupplierInformation: {
                      ...data.SupplierInformation,
                      Mobile: e.target.value
                    }
                  })
                }
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>Product Details</Typography>
          {data?.ProductDetails?.map((product, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="S. No."
                    name="S.No"
                    value={product["S.No"] || ''}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Description of Goods"
                    name="DescriptionOfGoods"
                    value={product["DescriptionOfGoods"] || ''}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="HSN Code"
                    name="HSNCode"
                    value={product["HSNCode"] || ''}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    name="Quantity"
                    value={product["Quantity"] || ''}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Rate"
                    name="Rate"
                    value={product["Rate"] || ''}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Amount"
                    name="Amount"
                    value={product["Amount"] || ''}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Paper>

        <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>Tax Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Total Amount Before Tax"
                name="TotalAmountBeforeTax"
                value={data?.TaxDetails?.TotalAmountBeforeTax || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    TaxDetails: {
                      ...data.TaxDetails,
                      TotalAmountBeforeTax: e.target.value
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Add CGST 9%"
                name="AddCGST9Percent"
                value={data?.TaxDetails?.AddCGST9Percent || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    TaxDetails: {
                      ...data.TaxDetails,
                      AddCGST9Percent: e.target.value
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Add SGST 9%"
                name="AddSGST9Percent"
                value={data?.TaxDetails?.AddSGST9Percent || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    TaxDetails: {
                      ...data.TaxDetails,
                      AddSGST9Percent: e.target.value
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Round Off"
                name="RoundOff"
                value={data?.TaxDetails?.RoundOff || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    TaxDetails: {
                      ...data.TaxDetails,
                      RoundOff: e.target.value
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Total Amount After Tax"
                name="TotalAmountAfterTax"
                value={data?.TaxDetails?.TotalAmountAfterTax || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    TaxDetails: {
                      ...data.TaxDetails,
                      TotalAmountAfterTax: e.target.value
                    }
                  })
                }
              />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ textAlign: 'center', marginTop: 3, display:"flex", gap:"2rem" }}>
          <Button variant="contained" color="primary" onClick={downloadJSON}>
            Download JSON
          </Button>
          <Button variant="contained" color="primary" onClick={()=>{uploadJSONToServer(data); setOpen(true);}}>
            Post JSON
          </Button>
        </Box>
      </form>
    </Box>
    <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} sx={{ width: "100%" }}>
          JSON Uploaded
        </Alert>
      </Snackbar>
    </>
  );
};

export default InvoiceEdit;
