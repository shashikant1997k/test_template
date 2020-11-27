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

  $(document).on("keypress", function (e) {
    var key = e.keyCode || e.charCode;
    if (key == 13) {
      e.preventDefault();
      $("td.all_td").blur();
    }
  });

  $(document).on("click", ".showDetails", function (e) {
    let id = $(this).data("id");
    if ($(`.hidden_class_${id}`).css("display") != "none") {
      $(`.hidden_class_${id}`).css("display", "none");
      $(this).html("Show Details");
    } else {
      $(`.hidden_class_${id}`).css("display", "flex");
      $(this).html("Hide Details");
    }
  });

  function createTable(resultArray) {
    var headLen = resultArray.headers.length;
    $(".table_main").show();
    $(".second_page,.back_btn, .submit_btn").show();
    $(".first_page,.next_btn").hide();
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
      $(".table_head_row").html(`<tr>${th_data}</tr>`);
    }

    if (
      Array.isArray(resultArray.file_data) &&
      resultArray.file_data.length != 0
    ) {
      var tr_data = "";
      resultArray.file_data.forEach((item, index) => {
        if (item.length == headLen) {
          var td_data = ``;
          item.forEach((val, i) => {
            if (i <= 1) {
              td_data += `<td data-label="${resultArray.headers[i]}" class="text-center input-text-center all_td first_td">${val}</td>`;
            } else if (i == 2 || i == 3) {
              td_data += `<td contenteditable="true" data-label="${resultArray.headers[i]}" class="text-center input-text-center all_td first_td">${val}</td>`;
            } else {
              td_data += `<td contenteditable="true" data-label="${
                resultArray.headers[i]
              }" class="text-center input-text-center all_td hidden_class hidden_class_${
                index + 1
              }">${val}</td>`;
            }
          });
          tr_data += `<tr class="row_${
            index + 1
          }">${td_data}<td class="text-center input-text-center show_btn_td"><button class="showDetails" data-id="${
            index + 1
          }">Show Details</button></td></tr>`;
        }
      });
      $(".table_body").html(tr_data);
    }

    if (mobileVar == 1) {
      $("#masterSheetTable .table_body tr").each(function () {
        let cls = $(this).attr("class");
        let con1 = $(`.${cls} td[data-label='Category']`).html();
        let con2 = $(`.${cls} td[data-label='Item Code']`).html();
        $(`.${cls} td[data-label='Category']`).html(`${con1} (${con2})`);
      });
    }
  }

  function createDummyTable(res) {
    var tData = "";
    var thData = "";
    var optionRow = "";
    if (Array.isArray(res) && res.length) {
      for (var i = 0; i < (res.length >= 8 ? 8 : res.length); i++) {
        tData += `<tr class="option_row" data-id="${i}"><td>${i}</td>`;
        for (var j = 0; j <= res[i].length; j++) {
          tData += `<td class="_data_td${j}">${
            res[i][j] != undefined
              ? res[i][j].length < 20
                ? res[i][j]
                : res[i][j].slice(0, 20) + "..."
              : ""
          }</td>`;
        }

        tData += `</tr>`;
      }
    }
    $(".table_main").show();
    $(".second_page").hide();
    $(".first_page,.next_btn").show();
    $(".first_page table tbody").html(`${tData}`);
  }

  var rowNum = null;
  $(document).on("click", ".option_row", function () {
    rowNum = $(this).data("id");
    $(".error_msg").hide();
    $(".option_row").removeClass("option_row_color");
    $(this).addClass("option_row_color");
  });

  $(document).on("click", ".back_btn", function () {
    $(".table_main").modal("show");
    $(".second_page,.back_btn, .submit_btn").hide();
    $(".first_page,.next_btn").show();
  });

  $(document).on("click", ".next_btn", function () {
    if (!rowNum) {
      $(".error_msg").show();
      return false;
    }
    if (_csvData.length > 0) {
      var csv1 = [..._csvData[0], ..._csvData[1]];
      csv1 = csv1.filter((v) => v);
      var csv2 = [];
      csv1.forEach((v) => {
        csv2.push(v.trim().replace(":", ""));
      });

      var topData = {};
      for (let i = 0; i < csv2.length; i = i + 2) {
        topData[csv2[i]] = csv2[i + 1];
      }

      var headers =
        _csvData[rowNum].length > 0 && _csvData[rowNum].filter((v) => v);
      var temp = _csvData.slice(rowNum + 1, _csvData.length);
      var temp1 = temp[0].filter((v) => v);
      var _len = temp1.length;
      var file_data = [];

      if (Array.isArray(temp) && temp.length > 0) {
        temp.forEach((arr) => {
          if (Array.isArray(arr) && arr.length > 0) {
            var temp2 = arr.filter((v) => v);
            if (temp2.length == _len) {
              file_data.push(temp2);
            }
          }
        });
      }

      resultArray.headers = headers;
      resultArray.file_data = file_data;

      createTable(resultArray);
    }
  });

  const serachResult = (input, sel) => {
    let { headers, file_data } = resultArray;

    let result = {
      headers,
      file_data,
    };

    if (sel.length > 0) {
      result.file_data = sel.length
        ? result?.file_data.filter((v) => {
            return (
              v[0]?.toLowerCase()?.includes(sel[0]) ||
              v[0]?.toLowerCase()?.includes(sel[1]) ||
              v[0]?.toLowerCase()?.includes(sel[2])
            );
          })
        : result?.file_data;
    }
    if (input.length > 0) {
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
    }

    createTable(result);
  };
  let input = "";
  let sel = [];
  $("#searchInput").keyup(function () {
    input = $(this).val();
    serachResult(input, sel);
  });

  $(document).on("click", ".switch_btn", function () {
    let cls1 = $(this).attr("class");
    let d_val = "";
    if (cls1.includes("active")) {
      $(this).removeClass("active");
      d_val = $(this).data("val");
      sel = sel.filter((v) => v != d_val.toLocaleLowerCase());
    } else {
      $(this).addClass("active");
      d_val = $(this).data("val");
      sel.push(d_val.toLocaleLowerCase());
    }

    serachResult(input, sel);
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
          _csvData = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
            header: 1,
          });
        });
        createDummyTable(_csvData);
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
