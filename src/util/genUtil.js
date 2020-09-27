function getSampleColumn(key, title, type, lookup) {
  var obj = {};
  obj.name = key;
  obj.title = title;
  obj.type = type;
  if (obj.type === 'lookup') {
    obj.lookup = lookup
  }
  return obj;
}

function getSampleRows(nRows, cols, leadTypes) {
  let records = [];
  for (let i = 0; i < nRows; i++) {
    let row = {};
    cols.forEach((e) => {
      row[e] = e + "-" + i;
    });
    let randomNo = Math.floor(Math.random() * (4+1))
    row['lead'] =  randomNo === 0? null :randomNo
    records.push(row);
  }
  return records;
}

export function generateSampleData(nRows = 10) {
  var colId = getSampleColumn("id", "Id", "number");
  var colName = getSampleColumn("name", "Name", "text");
  var colPhoneNum = getSampleColumn("phNum", "Phone Number", "text");
  var colEmail = getSampleColumn("email", "Email", "text");
  const leadTypes = {
    1: "No label",
    2: "Cold lead",
    3: "Warm lead",
    4: "Hot lead"
};
  var colLead = getSampleColumn("lead", "Lead Type", "lookup", leadTypes);

  var columns = [colId, colName, colPhoneNum, colEmail, colLead];
  var rows = getSampleRows(nRows, ["id", "name", "phNum", "email"], leadTypes);

  return {
    columns: columns,
    rows: rows,
  };
}
