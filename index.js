$(document).ready(function () {
  var mobileVar = 0;
  var val1 = 2;
  var val2 = 3;
  var screenWidth = window.matchMedia("(max-width: 600px)");
  if (screenWidth.matches) {
    mobileVar = 1;
  }

  var resultArray = {
    headers: [],
    file_data: [],
  };

  if (mobileVar) {
    $(document).on("click", "#bEdit", function () {
      let getRow = $(this).parents().eq(2);
      let getRowClass = getRow.attr("class");
      let i = String(getRowClass).split("_")[1];
      $(`.${getRowClass} .hidden_class_${i}`).css("display", "block");
    });

    $(document).on("click", "#bAcep", function () {
      let getRow = $(this).parents().eq(2);
      let getRowClass = getRow.attr("class");
      let i = String(getRowClass).split("_")[1];
      $(`.${getRowClass} .hidden_class_${i}`).css("display", "none");
    });

    $(document).on("click", "#bCanc", function () {
      let getRow = $(this).parents().eq(2);
      let getRowClass = getRow.attr("class");
      let i = String(getRowClass).split("_")[1];
      $(`.${getRowClass} .hidden_class_${i}`).css("display", "none");
    });
  }

  function createTable(resultArray) {
    var headLen = resultArray.headers.length;
    $(".table_main").show();
    if (resultArray.file_data.length == 0) {
      $(".table_body").html(
        "<tr><td class='text-center' colspan='11' style='padding:10px;font-size:16px;'>No Data</td></tr>"
      );
      return false;
    }
    if (Array.isArray(resultArray.headers) && resultArray.headers.length != 0) {
      var th_data = ``;
      resultArray.headers.forEach((val, i) => {
        th_data += `<th class="text-center">${val}</th>`;
      });
      th_data +=
        "<th class='text-center' style='white-space:nowrap' data-id='edit_row'>Edit</th>";
      $(".table_head_row").html(th_data);
    }

    if (
      Array.isArray(resultArray.file_data) &&
      resultArray.file_data.length != 0
    ) {
      var tr_data = "";
      resultArray.file_data.forEach((item, index) => {
        if (item.length == headLen) {
          var td_data = "";
          item.forEach((val, i) => {
            if (i <= 2 || i == 4) {
              td_data += `<td data-label="${resultArray.headers[i]}" class="text-center input-text-center all_td first_td">${val}</td>`;
            } else {
              td_data += `<td data-label="${
                resultArray.headers[i]
              }" class="text-center input-text-center all_td hidden_class hidden_class_${
                index + 1
              }">${val}</td>`;
            }
          });
          tr_data += `<tr class="row_${index + 1}">${td_data}</tr>`;
        }
      });
      $(".table_body").html(tr_data);
    }

    $("#masterSheetTable").SetEditable({
      $addButton: $("#addNewRow"),
      onDelete: function () {
        console.log("delete");
      },

      onEdit: function () {
        console.log("Edit");
      },

      onAdd: function () {
        console.log("Add");
      },
    });
  }

  $("#searchInput").keyup(function () {
    let input = $(this).val();
    let { headers, file_data } = resultArray;
    let result = {
      headers,
      file_data,
    };
    let val = input.toLowerCase();
    result.file_data = val
      ? result?.file_data.filter((v) => {
          return (
            v[0]?.toLowerCase()?.includes(val) ||
            v[1]?.toLowerCase()?.includes(val) ||
            v[2]?.toLowerCase()?.includes(val)
          );
        })
      : result?.file_data;

    createTable(result);
  });

  $(".upload_master_sheet").change(function () {
    var imgData = $(".upload_master_sheet")[0].files[0];

    if (imgData != undefined) {
      var fileType = ["csv", "xsls", "xls", "xlsx"];
      var file_typ = imgData.name.substring(imgData.name.indexOf(".") + 1);

      if (fileType.indexOf(file_typ) < 0) {
        $(".upload_master_sheet").val("");
        alert("file not supported");
        return false;
      }

      var reader = new FileReader();

      reader.onload = function () {
        var fileData = reader.result;
        var wb = XLSX.read(fileData, { type: "binary" });
        wb.SheetNames.forEach(function (sheetName) {
          var csvData = XLSX.utils.sheet_to_csv(wb.Sheets[sheetName]);
          var temp = csvData.split("\n");
          temp.splice(0, 2);
          var csvData = temp.join("\n");

          var headers = csvData
            .split("\n")[0]
            .replace(/\s/g, " ")
            .trim()
            .split(",");

          headers = headers.filter((v) => v != "");
          var csv_data = csvData.split("\n");
          if (csv_data[0] != "" && csv_data[1] != "") {
            var csvLen = csv_data.length;
            var file_data = [];
            for (var i = 0; i < csvLen; i++) {
              file_data[i] = String(csv_data[i + 1])
                .replace(/\s/g, " ")
                .trim()
                .split(",");
              file_data[i] = file_data[i].filter((v) => v != "");
            }
            resultArray.headers = headers;
            resultArray.file_data = file_data;
          }
        });

        createTable(resultArray);
      };

      reader.readAsBinaryString(imgData);
    }
  });

  $("#download").click(function () {
    var tble = document.getElementById("masterSheetTable");
    var row = tble.rows;

    for (let i = 0; i < row[0].cells.length; i++) {
      var str = row[0].cells[i];
      var id = $(str).data("id");
      if (id == "edit_row") {
        for (var j = 0; j < row.length; j++) {
          row[j].deleteCell(i);
        }
      }
    }

    let table = document.querySelector("#masterSheetTable");
    TableToExcel.convert(table, {
      name: "masterSheet.xlsx",
    });
  });
});
