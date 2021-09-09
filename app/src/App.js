import "./App.css";
import axios from "axios";
import React, { useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {downloadCb, renderCb, downloadExcel} from './utils/fetch';

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: "flex",
    flexDirection: "row",
    marginLeft: theme.spacing(0),
  },
  selectEmpty: {
    marginRight: theme.spacing(2),
    minWidth: 120,
    marginBottom: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();
  const initState = {
    fileType: "pdf",
    numberOfReport: 1,
    downloadOrRender: "render",
    streamOrFile: "stream",
    excelTemplate: "template",
    errorText: "",
    error: false
  };
  const [state, setState] = React.useState(initState);
  const [folderName, setFolderName] = React.useState("");
  const [file, setFile] = useState(null);
  const onChangeHandler = (event) => {
    setFile(event.target.files[0]);
  };


const onclickCreatFolder = (folderName = "hello") => {
  axios({
    url: "http://localhost:3000/api/containers",
    method: "POST",
    data: { name: folderName },
  });
}
  const onclickUploadFile = () => {
    const data = new FormData();
    data.append("file", file);
    axios({
      url: "http://localhost:3000/api/containers/hello/upload",
      method: "POST",
      data: data,
    });
  };


  const folderChange = (event) => {
    setFolderName(event.target.value);
  };
  const fileTypeChange = (event) => {
    setState({ ...state, fileType: event.target.value });
  };
  const numberOfReportChange = (event) => {
    
      if (event.target.value < 1) {
        setState({...state, errorText: 'Must be positive number', error: true });
      } else {
        setState({ ...state, numberOfReport: event.target.value, error: false });
      }
    
   
  };
  const downloadOrRenderChange = (event) => {
    setState({ ...state, downloadOrRender: event.target.value });
  };
  const streamOrFileChange = (event) => {
    setState({ ...state, streamOrFile: event.target.value });
  };
  const excelTemplateChange = (event) => {
    setState({ ...state, excelTemplate: event.target.value });
  };
  const onClick = () => {
    let url, cb;
    
    switch (state.fileType) {
      case "pdf":
        state.streamOrFile === "stream"
          ? (url = "http://localhost:3000/api/Reports/createPdf")
          : (url = "http://localhost:3000/api/Reports/mergePdfs");
        state.downloadOrRender === "download"
          ? (cb = downloadCb)
          : (cb = renderCb);
        break;
      case "excel":
        state.excelTemplate === "noTemplate"
          ? (url = "http://localhost:3000/api/Reports/createExcelWithTitle")
          : (url = "http://localhost:3000/api/Reports/createExcelByTemplate");
        cb = downloadExcel;
        break;
      default:
        return;
    }
    //call api
    axios({
      url: url,
      method: "GET",
      params: {numberOfReport: state.numberOfReport},
      responseType: "blob", // important
    })
      .then((response) => cb(response))
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{ padding: 10 }}>
   
      <Typography variant="h6" gutterBottom>
        Create report
      </Typography>
      <FormControl className={classes.formControl}>
        <Select
          id="demo-simple-select-placeholder-label"
          value={state.fileType}
          onChange={fileTypeChange}
          className={classes.selectEmpty}
        >
          <MenuItem value={"pdf"}>Pdf</MenuItem>
          <MenuItem value={"excel"}>Excel</MenuItem>
        </Select>
        <TextField
          label="Number of report"
          type="number"
          defaultValue = {1}
          errorText= {state.errorText}
          error= {state.error}
          required
          onChange={numberOfReportChange}
          className={classes.selectEmpty}
        />
        {state.fileType === "pdf" && (
          <Select
            id="demo-simple-select-placeholder-label"
            value={state.streamOrFile}
            onChange={streamOrFileChange}
            className={classes.selectEmpty}
          >
            <MenuItem value={"stream"}>Stream</MenuItem>
            <MenuItem value={"file"}>File</MenuItem>
          </Select>
        )}

        {state.fileType === "pdf" && (
          <Select
            id="demo-simple-select-placeholder-label"
            className={classes.selectEmpty}
            value={state.downloadOrRender}
            onChange={downloadOrRenderChange}
          >
            <MenuItem value={"render"}>Render</MenuItem>
            <MenuItem value={"download"}>Download</MenuItem>
          </Select>
        )}

        {state.fileType === "excel" && (
          <Select
            value={state.excelTemplate}
            onChange={excelTemplateChange}
            id="demo-simple-select-placeholder-label"
            className={classes.selectEmpty}
          >
            <MenuItem value={"template"}>Template</MenuItem>
            <MenuItem value={"noTemplate"}>No template</MenuItem>
          </Select>
        )}
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        className={classes.selectEmpty}
        onClick={onClick}
      >
        Create report
      </Button>
      {/*comment create folder and upload file*/}
      {/* 
<hr/>
      <Typography variant="h6" gutterBottom>
        Upload template
      </Typography>
      <FormControl className={classes.formControl}>
        <TextField
          label="Folder name"
          type="text"
          onChange={folderChange}
          className={classes.selectEmpty}
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        className={classes.selectEmpty}
        onClick={()=> onclickCreatFolder(folderName)}
      >
        Create folder
      </Button>
      <hr/>
      <FormControl className={classes.formControl}>
        <TextField
          type="file"
          variant="outlined"
          onChange={onChangeHandler}
          className={classes.selectEmpty}
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
       
        className={classes.selectEmpty}
        onClick={onclickUploadFile}
      >
        Upload template
      </Button> */}
    </div>
  );
}

export default App;
