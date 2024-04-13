import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Button,
  TextField,
  MenuItem,
  CardContent,
  Typography,
  Card,
} from "@mui/material";
import SaveTransport from "../Components/SaveTransport";
import useOpenClose from "../Functions/useOpenClose";

const transportTypes = ["bus", "train", "plane", "other"];
const InfoCard = ({ title, content }) => (
  <Card
    variant="outlined"
    sx={{
      mb: 1,
      backgroundColor: "#f5f5f5",
      width: "300px",
      overflow: "hidden",
    }}
  >
    <CardContent sx={{ overflow: "hidden", height: "20px" }}>
      <Box sx={{ marginTop: "-10px" }}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6" component="div">
          {content}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const InfoTransport = ({ open, onClose, transport, handleDelete, onEdit }) => {
  const [openTransport, handleOpenTransport, handleCloseTransport] =
    useOpenClose();
  const fields = [
    { title: "Title", content: transport.name },
    { title: "Type", content: transport.type },
    { title: "Date", content: transport.dateOfDeparture },
    { title: "Duration", content: transport.duration },
    { title: "From", content: transport.from },
    { title: "To", content: transport.to },
    { title: "Price", content: transport.price },
  ];

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Transport</DialogTitle>
        <DialogContent>
          {fields.map((field, index) => (
            <React.Fragment key={index}>
              <InfoCard title={field.title} content={field.content} />
              <Divider sx={{ mb: 1 }} />
            </React.Fragment>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpenTransport}>Edit</Button>
          <Button onClick={handleClose}>Cancel</Button>
          <Button sx={{ color: "red" }} onClick={() => handleDelete(transport)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <SaveTransport
        open={openTransport}
        onClose={handleCloseTransport}
        onSave={onEdit}
        oldTransport={transport}
      />
    </div>
  );
};

export default InfoTransport;
