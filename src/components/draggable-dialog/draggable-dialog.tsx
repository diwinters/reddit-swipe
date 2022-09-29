import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";
import { TextField } from "@mui/material";
import { useRef } from "react";

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

interface DialogProps {
  subreddits: string[];
  setSubreddits: any;
  openSubredditConfig: any;
  setOpenSubredditConfig: any;
}

export default function DraggableDialog(props: DialogProps) {
  const val = props.subreddits.join("\n");
  const [textContent, setTextContent] = React.useState(val);

  const handleClose = () => {
    props.setOpenSubredditConfig(false);
  };

  const handleSave = () => {
    console.log(textContent);
    let arr = textContent.split("\n");
    console.log(arr);
    props.setSubreddits(arr);
    props.setOpenSubredditConfig(false);
  };

  return (
    <div>
      <Dialog
        open={props.openSubredditConfig}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: "move", color: "black" }}
          id="draggable-dialog-title"
        >
          {" "}
          Subreddits{" "}
        </DialogTitle>
        <DialogContent>
          <br />
          <TextField
            id="outlined-textarea"
            label="Subreddits"
            placeholder="Placeholder"
            defaultValue={val}
            onChange={(e) => setTextContent(e.target.value)}
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
