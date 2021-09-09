const Excel = require("exceljs");

async function generateExcelWithHeaders(header, data, file) {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet("sheet1");
  worksheet.columns = header.map((item, index) => {
    return { header: item, key: index, width: 30 };
  });
  data
    .map((item) => Object.values(item))
    .forEach((item) => worksheet.addRow(item));
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (rowNumber == 1) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "f5b914" },
        };
      }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    row.commit();
  });

  await workbook.xlsx.writeFile(file);
}

async function generateExcelWithTitle(titles, header, data, file) {
  let total = data.map(item => item.cost).reduce((v, k) => k + v,0);
  let lastRow = ["", "", "", "TOTAL", total]
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet("sheet1");
  let titleRows = Object.values(titles).flat();
  for (const row of titleRows) {
    worksheet.addRow([row]);
  }
  worksheet.addRow(header);
  worksheet.columns = header.map((item) => {
    return { width: 30 };
  });
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (rowNumber == 1) {
        row.height = 20;
        cell.font = { bold: true, size: 18, color: { argb: "3a80d5" } };
      } else if (rowNumber <= titleRows.length) {
        cell.font = { italic: true, size: 10, color: { argb: "3a80d5" } };
      } else {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "f5b914" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    });

    row.commit();
  });
  data
    .map((item) => Object.values(item))
    .forEach((item) => worksheet.addRow(item));
  //add last row
  worksheet.addRow(lastRow);  
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (rowNumber > titleRows.length + 1) {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      };
    //format header and last row
    if (rowNumber == (data.length + 4) || rowNumber == 3) {
      cell.font = { bold: true };
    }  
    });
    row.commit();
  });
  
  await workbook.xlsx.writeFile(file);
}

module.exports = {
  generateExcelWithHeaders: generateExcelWithHeaders,
  generateExcelWithTitle: generateExcelWithTitle,
};