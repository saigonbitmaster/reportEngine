let downloadCb = (response) => {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "report.pdf");
  document.body.appendChild(link);
  link.click();
};
let renderCb = (response) => {
  const file = new Blob([response.data], { type: "application/pdf" });
  const fileURL = URL.createObjectURL(file);
  window.open(fileURL);
};
let downloadExcel = (response) => {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "report.xlsx");
  document.body.appendChild(link);
  link.click();
};


// eslint-disable-next-line import/no-anonymous-default-export
export  {downloadCb, renderCb, downloadExcel}