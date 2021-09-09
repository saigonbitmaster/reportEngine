"use strict";
const fs = require("fs");
const util = require("util");
const Handlebars = require("handlebars");
const path = require("path");
const puppeteer = require("puppeteer");
const pdf = require("handlebars-pdf");
const { v4: uuidv4 } = require("uuid");
const mergePdf = require("easy-pdf-merge");
const { excelData } = require("../../data/excelData");
const {
  generateExcelWithTitle,
  generateExcelWithHeaders,
} = require("../../utils/createExcel");
const moment = require("moment");
const { invoiceData, singleInvoiceData } = require("../../data/invoiceData");
const VNnum2words = require("vn-num2words");
const { ToWords } = require("to-words");
const XlsxTemplate = require("xlsx-template");

module.exports = (Report) => {
  //create and send back client a raw excel file
  Report.createExcelWithTitle = (numberOfReport, cb) => {
    let data = [];
    for (let i = 0; i < numberOfReport; i++) {
      data.push(excelData);
    }
    let createExcel = async (titles, header, data, file) => {
      try {
        await generateExcelWithTitle(titles, header, data, file);
        let dataBuffer = await fs.promises.readFile(file);
        const fileName = file;
        const contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const contentDisposition = `attachment; filename=${fileName}`;
        return cb(null, dataBuffer, contentType, contentDisposition);
      } catch (err) {
        console.log(err);
      }
    };
    let titles = {
      subject: "Sale report",
      subtitle: [moment(new Date()).format("YYYY-MM-DD")],
    };
    let header = ["Customer Name", "Items", "Quantity", "Price", "Cost"];
    let file = `${path.dirname(__dirname)}/../report.xlsx`;
    createExcel(titles, header, data, file);
  };

  //create from template and send back client a excel file
  Report.createExcel = (numberOfReport, cb) => {
    let data = [];
    const contentType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    for (let i = 0; i < numberOfReport; i++) {
      data.push(excelData);
    }
    let createExcel = async (header, data, file) => {
      try {
        await generateExcelWithHeaders(header, data, file);
        let dataBuffer = await fs.promises.readFile(file);
        const contentDisposition = "attachment; filename=report.xlsx";
        return cb(null, dataBuffer, contentType, contentDisposition);
      } catch (err) {
        console.log(err);
      }
    };
    let header = ["Customer Name", "Items", "Price", "Revenue"];
    let file = `${path.dirname(__dirname)}/../report.xlsx`;
    createExcel(header, data, file);
  };

  //read template, return pdf by stream
  Report.createPdf = (numberOfReport, cb) => {
    let invoiceData = [];
    for (let i = 0; i < numberOfReport; i++) {
      invoiceData.push(singleInvoiceData);
    }

    let htmlHbsFile = "/tmp/invoices.html";
    let hbsToPdf = async (hbsFile, data) => {
      try {
        let template = await fs.promises
          .readFile(hbsFile, "utf8")
          .then((buffer) => Handlebars.compile(buffer, { noEscape: true }));
        let result = template(data);
        const browser = await puppeteer.launch({
          //for if run inside docker
          headless: true,
          executablePath: process.env.CHROME_BIN,
          args: ["--no-sandbox", "--disable-dev-shm-usage"],
        });
        const page = await browser.newPage();
        await fs.promises.writeFile(htmlHbsFile, result);
        await page.goto("file://" + htmlHbsFile, {
          waitUntil: "networkidle0",
        });
        const fileName = "invoices.pdf";
        const contentType = "application/pdf";
        const contentDisposition = `attachment; filename=${fileName}`;
        await page
          .pdf({ format: "A5" })
          .then((dataBuffer) =>
            cb(null, dataBuffer, contentType, contentDisposition)
          );
        await browser.close();
      } catch (err) {
        console.log(err);
      }
    };

    hbsToPdf(`${path.dirname(__dirname)}/../template/invoice.hbs`, invoiceData);
  };

  //create multi pdf, merge then send back to client
  Report.mergePdfs = (numberOfReport, cb) => {
    let invoiceData = [];
    for (let i = 0; i < numberOfReport; i++) {
      invoiceData.push(singleInvoiceData);
    }
    let pdfFiles = [];
    let dir = "/tmp/";
    let htmlHbsFile = "/tmp/invoices.html";
    let invoicesPdfFile = "/tmp/" + "invoice" + uuidv4() + ".pdf";
    let hbsToPdf = async (hbsFile, dataItem) => {
      try {
        let hbsTemplate = await fs.promises.readFile(hbsFile, "utf8");
        let template = Handlebars.compile(hbsTemplate, { noEscape: true });
        let result = template(dataItem);
        await fs.promises.writeFile(htmlHbsFile, result);
        const browser = await puppeteer.launch({
          //for if run inside docker
          headless: true,
          executablePath: process.env.CHROME_BIN,
          args: ["--no-sandbox", "--disable-dev-shm-usage"],
        });
        const page = await browser.newPage();
        await page.goto("file://" + htmlHbsFile, {
          waitUntil: "networkidle0",
        });
        let tempPath = `${dir}${uuidv4()}.pdf`;
        await page.pdf({ path: tempPath, format: "A5" });
        pdfFiles.push(tempPath);
        await browser.close();
      } catch (err) {
        console.log(err);
      }
    };

    let mergePdfFiles = async (data) => {
      for (let item of data) {
        await hbsToPdf(`${path.dirname(__dirname)}/../template/invoice.hbs`, [
          item,
        ]);
      }
      //if only one pdf send it back client
      if (pdfFiles.length == 1) {
        let dataBuffer = await fs.promises.readFile(pdfFiles[0]);
        const fileName = "invoices.pdf";
        const contentType = "application/pdf";
        const contentDisposition = `attachment; filename=${fileName}`;
        return cb(null, dataBuffer, contentType, contentDisposition);
      }
      //if multi pdfs merge it then send back client
      mergePdf(pdfFiles, invoicesPdfFile, async function (err) {
        if (err) {
          console.log(err);
        }
        let dataBuffer = await fs.promises.readFile(invoicesPdfFile);
        const fileName = "invoices.pdf";
        const contentType = "application/pdf";
        const contentDisposition = `attachment; filename=${fileName}`;
        return cb(null, dataBuffer, contentType, contentDisposition);
      });
    };
    mergePdfFiles(invoiceData);
  };

  // create excel from a template
  Report.createExcelByTemplate = (numberOfReport, cb) => {
    let data = [];
    for (let i = 0; i < numberOfReport; i++) {
      data.push(excelData);
    }
    fs.readFile(
      path.join(__dirname, "../../template", "template.xlsx"),
      function (err, _data) {
        if (err) {
          throw err;
        }
        var template = new XlsxTemplate(_data);
        template.substitute(1, {
          data,
          subject: "Sale report",
          date: moment(new Date()).format("YYYY-MM-DD"),
        });
        var dataBuffer = template.generate({ type: "nodebuffer" });
        const contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const contentDisposition = "attachment; filename=report.xlsx";
        return cb(null, dataBuffer, contentType, contentDisposition);
      }
    );
  };

  Report.remoteMethod("createExcelByTemplate", {
    isStatic: true,
    accepts: { arg: "numberOfReport", type: "number" },
    http: { verb: "get" },
    returns: [
      { arg: "body", type: "file", root: true },
      { arg: "Content-Type", type: "string", http: { target: "header" } },
      {
        arg: "Content-Disposition",
        type: "string",
        http: { target: "header" },
      },
    ],
  });
  Report.remoteMethod("createExcelWithTitle", {
    isStatic: true,
    accepts: { arg: "numberOfReport", type: "number" },
    http: { verb: "get" },
    returns: [
      { arg: "body", type: "file", root: true },
      { arg: "Content-Type", type: "string", http: { target: "header" } },
      {
        arg: "Content-Disposition",
        type: "string",
        http: { target: "header" },
      },
    ],
  });
  Report.remoteMethod("createExcel", {
    isStatic: true,
    accepts: { arg: "numberOfReport", type: "number" },
    http: { verb: "get" },
    returns: [
      { arg: "body", type: "file", root: true },
      { arg: "Content-Type", type: "string", http: { target: "header" } },
      {
        arg: "Content-Disposition",
        type: "string",
        http: { target: "header" },
      },
    ],
  });

  Report.remoteMethod("createPdf", {
    isStatic: true,
    accepts: { arg: "numberOfReport", type: "number" },
    http: { verb: "get" },
    returns: [
      { arg: "body", type: "file", root: true },
      { arg: "Content-Type", type: "string", http: { target: "header" } },
      {
        arg: "Content-Disposition",
        type: "string",
        http: { target: "header" },
      },
    ],
  });

  Report.remoteMethod("mergePdfs", {
    isStatic: true,
    accepts: { arg: "numberOfReport", type: "number" },
    http: { verb: "get" },
    returns: [
      { arg: "body", type: "file", root: true },
      { arg: "Content-Type", type: "string", http: { target: "header" } },
      {
        arg: "Content-Disposition",
        type: "string",
        http: { target: "header" },
      },
    ],
  });
};
