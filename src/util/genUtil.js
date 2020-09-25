function getSampleColumn(key, title, type) {
  var obj = {};
  obj.name = key;
  obj.title = title;
  obj.type = type;
  return obj;
}

function getSampleRows(nRows, cols) {
  var records = [];
  for (let i = 0; i < nRows; i++) {
    var row = {};
    cols.forEach((e) => {
      row[e] = e + "-" + i;
    });
    records.push(row);
  }
  return records;
}

export function generateSampleData(nRows = 10) {
  var colId = getSampleColumn("id", "Id", "number");
  var colName = getSampleColumn("name", "Name", "text");
  var colPhoneNum = getSampleColumn("phNum", "Phone Number", "text");
  var colEmail = getSampleColumn("email", "Email", "text");

  var columns = [colId, colName, colPhoneNum, colEmail];
  var rows = getSampleRows(nRows, ["id", "name", "phNum", "email"]);

  return {
    columns: columns,
    rows: rows,
  };
}
