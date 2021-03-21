const fs = require("fs");
const csv = require("csv-parse");
const stringify = require("csv-stringify/lib/sync");
const config = require("./config.json");
const moment = require("moment");

moment.defaultFormat = "YYYY-MM-DD";

var startDate = moment(config.startDate);
var endDate = moment(config.endDate);

const errors = fs.createWriteStream("errors.csv", { flags: "a" });
const stream = fs.createWriteStream(config.fileName, { flags: "a" });
// stream.write(config.headers);

const Aggregator = (err, records) => {
  try {
    const recordsWithDate = records.map((record) => {
      return { ...record, मिति: startDate.format("YYYY-MM-DD") };
    });
    const data = stringify(recordsWithDate, { header: false });
    console.log("INSIDE AGGREGATOR");
    stream.write(data);
    ////Async
    // stringify(
    //   recordsWithDate,
    //   {
    //     header: false,
    //   },
    //   CsvFileWriter
    // );
  } catch (err) {
    console.log(err);
    errors.write(`${startDate.format("YYYY-MM-DD")},`);
  }
};

let parser = csv({ columns: true }, Aggregator);

let dateStr = startDate.format("YYYY-MM-DD");
let filename = `${config.downloadDir}${dateStr}.csv`;
fs.createReadStream(filename).pipe(parser);

// while (startDate < endDate) {
//   try {
//     let dateStr = startDate.format("YYYY-MM-DD");
//     let filename = `${config.downloadDir}${dateStr}.csv`;
//     console.log(filename);
//     fs.createReadStream(filename).pipe(parser);
//     startDate = startDate.add(1, "days");
//   } catch (err) {}
// }

// console.log("AT LAST");
// console.log(startDate);
