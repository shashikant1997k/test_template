$(document).ready(function () {
  var mobileVar = 0;
  var categories = [];
  var screenWidth = window.matchMedia("(max-width: 600px)");
  if (screenWidth.matches) {
    mobileVar = 1;
  }

  var resultArray = {
    headers: [],
    file_data: [],
  };

  // map table uploaded sheet column from pre-define values
  function tableColumnMapping(output) {
    $(".table_main").show();
    $(".first_page_1,.back_btn,.category_btn,.next_btn_1").show();
    $(".first_page,.second_page,.next_btn,.submit_btn").hide();
    var headers = output.headers || [];
    var file_data = output.file_data || [];
    var tData = "";
    var thData = "";
    var optionRow = "";
    var mobileOptionRow = "";

    var map_array = {
      Category: "Category",
      "Item Code": "Item Code",
      "Item Name": "Item Name",
      "RFA Qty": "RFA Qty",
      "Total Value": "Total Value",
      "Salv Qty": "Salv Qty",
      UOM: "UOM",
      "Salv Value": "Salv Value",
      "RFA Value": "RFA Value",
    };

    // headers[j].toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())

    // creating column mapping dropdown
    if (Array.isArray(headers) && headers.length) {
      for (var j = 0; j < headers.length; j++) {
        if (headers[j]) {
          // For mobile view
          if (mobileVar) {
            let mobileSelect = "";
            for (var key in map_array) {
              let con1 = headers[j];
              mobileSelect += `<option ${
                con1 == map_array[key] ? "selected" : ""
              } value="${map_array[key]}" align='center'>${key}</option>`;
            }
            mobileOptionRow = `<div class="_mobile_select_td">
                <div class="_select">
                  <select class="form-control mappingVal" onchange="selectMapping(this)" id="_select_${j}">
                    <option value="">Select</option>
                    ${mobileSelect}
                  </select>
                </div></div>`;

            thData += `<td class='mappedVal' id="_skip_td${j}" data-value="${
              headers[j]
            }">
                <div class="mob_head_style">
                  <div style="width:60%;display:flex;flex-direction:column;justify-content:space-arround;">
                    <div style="font-weight:600;color:#656565">
                      ${
                        headers[j].length < 20
                          ? headers[j]
                          : headers[j].slice(0, 20) + "..."
                      }
                    </div>
                    <div style="font-weight:500;color:#656565">
                      ${
                        file_data[0][j].length < 20
                          ? file_data[0][j]
                          : file_data[0][j].slice(0, 20) + "..."
                      }
                    </div>
                  </div>
                  <div style="width:40%;font-wieght:normal;color:#656565;">
                    ${mobileOptionRow}
                  </div>
                </div>
                <div id="ErrorMessage${i}" style="color:red;margin-left:3.5rem; display:none; font-size: 11px; text-align: left;  text-transform: capitalize; margin-top: 3px;">Select field</div>
                 </td> `;
          } else {
            optionRow += `<td class="_data_td${j}"><div class="_select_td">
                <div class="_select">
                  <select class="form-control mappingVal" onchange="selectMapping(this)" id="_select_${j}">
                    <option value="">Select</option>`;

            for (var key in map_array) {
              let con1 = headers[j];
              optionRow += `<option ${
                con1 == map_array[key] ? "selected" : ""
              } value="${map_array[key]}" align='center'>${key}</option>`;
            }

            optionRow += `</select></div></div><div id="ErrorMessage${j}" style="color:red;margin-left:3.5rem; display:none; font-size: 11px; text-align: left;  text-transform: capitalize; margin-top: 3px;">Select field</div></td>`;

            thData += `<th align='center' id="_skip_td${j}" data-value="${
              headers[j]
            }" class="mappedVal">${
              headers[j].length < 20
                ? headers[j]
                : headers[j].slice(0, 20) + "..."
            }
              </th> `;
          }
        }
      }
    }

    if (Array.isArray(file_data) && file_data.length) {
      for (var i = 0; i < (file_data.length > 4 ? 4 : file_data.length); i++) {
        tData += `<tr>`;
        for (var j = 0; j < headers.length; j++) {
          tData += `<td class="_data_td${j}">${
            file_data[i][j] != undefined
              ? file_data[i][j].length < 20
                ? file_data[i][j]
                : file_data[i][j].slice(0, 20) + "..."
              : ""
          }</td>`;
        }

        tData += `</tr>`;
      }
    }
    $(".first_page_1 .first_table_1 thead #thead").html(`${thData}`);
    $(".first_page_1 .first_table_1 tbody").html(
      `<tr>${optionRow}</tr>${tData}`
    );
  }

  // Create the table from uploaded sheet
  function createTable(resultArray, mappedObj) {
    var headLen = resultArray.headers.length;
    var dataLen = resultArray.file_data[0].length;
    let num1;
    Object.values(mappedObj).forEach((v, i) => {
      if (v.toLowerCase() == "category") {
        num1 = i;
      }
    });

    // creating array according to the category///
    let arr1 = [];
    resultArray.file_data.forEach((v, i) => {
      arr1[v[num1]] = [];
    });
    resultArray.file_data.forEach((v, i) => {
      arr1[v[num1]].push(v);
    });

    /////////////////////////////

    var th_data = ``;
    var cnt;
    var itmCode;
    var categoryVar;
    var itemName;

    $(".table_main").show();
    $(".second_page,.back_btn,.submit_btn,.category_btn").show();
    $(".first_page,.first_page_1,.next_btn,.next_btn_1").hide();

    // creating the table data
    if (resultArray.file_data.length == 0) {
      $("#masterSheetTable .table_body").html(
        "<tr><td class='text-center' colspan='11' style='padding:10px;font-size:16px;'>No Data</td></tr>"
      );
      return false;
    }
    if (
      Array.isArray(Object.values(mappedObj)) &&
      Object.values(mappedObj).length != 0
    ) {
      Object.values(mappedObj).forEach((val, i) => {
        if (
          val.toLowerCase() == "item name" ||
          val.toLowerCase() == "rfa qty"
        ) {
          th_data += `<th style="background: #E6E7EB;">${val}</th>`;
        } else if (
          val.toLowerCase() == "category" ||
          val.toLowerCase() == "item code"
        ) {
          th_data += ``;
        } else {
          th_data += `<th class="" style="background: #E6E7EB;" data-breakpoints="xs">${val}</th>`;
        }

        if (val.toLowerCase() == "rfa qty") {
          cnt = i;
        }
        if (val.toLowerCase() == "item code") {
          itmCode = i;
        }
        if (val.toLowerCase() == "category") {
          categoryVar = i;
        }
        if (val.toLowerCase() == "item name") {
          itemName = i;
        }
      });
      $(".table_head_row").html(`<tr>${th_data}</tr>`);
    }

    var tables = "";
    var ct = 0;
    for (const [key, value] of Object.entries(arr1)) {
      var tr_data = "";
      var totalRfaQty = 0;
      ct++;
      value.forEach((item, index) => {
        if (item.length == headLen || item.length == dataLen) {
          var td_data = ``;
          item.forEach((val, i) => {
            if (i == categoryVar || i == itmCode) {
              td_data += ``;
            } else if (i == cnt) {
              td_data += `<td class="${
                mobileVar == 1
                  ? "editable_cell editable_cell_style"
                  : "editable_cell"
              }" data-id="${val}" data-index="${index}" data-itemCode="${
                item[itmCode]
              }">${val}</td>`;
              totalRfaQty += Number(val);
            } else if (i == itemName) {
              td_data += `<td class="first_visible_td">
                  <div class="category_style">
                    <div><div class="category_icon">${item[categoryVar]}</div></div>
                    <div class="name_code_style">
                      <div>${val}</div>
                      <div class="item_code">${item[itmCode]}</div>
                    </div>
                  </div>
                </td>`;
            } else {
              td_data += `<td class="">${val}</td>`;
            }
          });

          tr_data += `<tr ${
            index == 0 ? "data-expanded='true'" : ""
          }>${td_data}</tr>`;
        }
      });

      tables += `<div class="panel panel-default panel_default" data-id="${key}">
                    <div class="panel-heading collapse_heading collapse_heading_${key}" role="tab" data-id="${key}" id="heading_${key}" style="padding: 2px 15px;">
                        <div class="panel-title">
                            <div class="panel1">
                              <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse_${key}" aria-expanded="true" aria-controls="collapse_${key}">
                                  <div style="display:flex;flex-direction:row;align-items:center;">
                                    <span class="category_icon">${key}</span>
                                    <span style="margin-left:10px;font-size:0.8em;">${
                                      key.toLowerCase() == "bi"
                                        ? "Bi-Biscuits"
                                        : key.toLowerCase() == "cf"
                                        ? "CF-Confectionery"
                                        : key.toLowerCase() == "nd"
                                        ? "ND-Noodles"
                                        : key.toLowerCase() == "sx"
                                        ? "SX-Snacks"
                                        : key.toLowerCase() == "at"
                                        ? "AT-Atta"
                                        : key.toLowerCase() == "at"
                                        ? "JU-Juice"
                                        : key
                                    }</span>
                                  </div>
                              </a>
                              <div class="panel2">Total Rows: <span class="total_rows">${
                                value.length
                              }</span></div>
                              <div class="panel2">Total Qty.: <span class="total_rfaQty">${totalRfaQty}</span></div>
                            </div>
                            <div class="more_details" data-id="${key}"><span>More Details </span><span class="collapse_caret collapse_icon_${key}"><i class="fa fa-angle-down" aria-hidden="true"></i></span></div>
                        </div>
                    </div>
                    <div id="collapse_${key}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading_${key}">
                        <div class="panel-body">
                            <table id="collapse-table-${key}" class="table table-bordered masterSheetTable" data-editing-allow-edit="true" data-filtering="true" data-sorting="true">
                              <thead>${th_data}</thead>
                              <tbody>${tr_data}</tbody>
                            </table>
                        </div>
                    </div>
                </div>`;
    }

    $(".panel-group").html(tables);

    jQuery(function ($) {
      $(".masterSheetTable").footable();
    });

    $(`.more_details`).click(function () {
      let id = $(this).data("id");
      let cl = $(`#collapse_${id}`).attr("class");
      if (cl.includes("in")) {
        $(`.collapse_heading_${id}`).attr(
          "style",
          "background-color: #FFF !important; padding: 2px 15px;"
        );
        $(`#collapse_${id}`).removeClass("in");
        $(`.collapse_icon_${id}`).html(
          '<i class="fa fa-angle-down" aria-hidden="true"></i>'
        );
      } else {
        $(`.collapse_heading_${id}`).attr(
          "style",
          "background-color: #F5F5F5 !important; padding: 2px 15px;"
        );
        $(`#collapse_${id}`).addClass("in");
        $(`.collapse_icon_${id}`).html(
          '<i class="fa fa-angle-up" aria-hidden="true"></i>'
        );
      }
    });

    $(".editable_cell").click(function () {
      let v1 = $(this).data("id");
      let v2 = $(this).html();
      let v3 = $(this).attr("data-index");
      if (!v2.includes(`<input type="text"`)) {
        $(this).html(
          `<input type='text' inputmode='numeric' pattern="[0-9]*" class="_input _input_${v3}" style='width:100%;' data-id="${v3}" value='${v1}' />`
        );
        if (mobileVar == 1) {
          $(this).css({ color: "#000", "font-weight": "normal" });
        }

        $(this).children().focus();
        let num = $(this).children().val();
        $(this).children().focus().val("").val(num);
      }
    });

    function removeInput() {
      $(".editable_cell").each(function () {
        let c1 = $(this).html();
        if (c1.includes(`<input type="text"`)) {
          if (mobileVar == 1) {
            $(this).css({ color: "#5d78ff", "font-weight": "600" });
          }

          let c2 = $(this).children().val();

          $(this).html(c2);
          $(this).data("id", c2);
          let c3 = $(this).attr("data-itemCode");
          console.log(c2, c3);
          $(".loading").show();
          setTimeout(() => {
            $(".loading").hide();
          }, 1000);
        }
      });
    }

    $(document).on("keypress", function (e) {
      var key = e.keyCode || e.charCode;
      if (key == 13) {
        e.preventDefault();
        removeInput();
      }
    });

    $(document).click(function () {
      if (!$("._input").is(":focus")) {
        console.log($("._input").is(":focus"));
        removeInput();
      }
    });

    // var input_index;
    // $(document).on("focus", "._input", function () {
    //   let indx = $(this).data("id");
    //   console.log(input_index, indx);
    //   input_index = $(this).data("id");
    //   if (input_index != undefined && input_index != indx) {
    //     removeInput();
    //   }
    // });
  }

  // create all category filter button
  function createCategoryBtn(resultArray) {
    resultArray.file_data.forEach((item, index) => {
      if (categories.indexOf(item[0]) == -1) {
        categories.push(item[0]);
      }
    });

    var catBtn = "";
    var catBtn2 = "";
    categories.forEach((val) => {
      catBtn += `<input id="_btns_${val}" type="checkbox"><label class="switch_btn" data-val="${val}" for="_btns_${val}">${val}</label>`;
    });

    $(".category_btn").html(catBtn);
  }

  // create as it is table like uploaded sheet
  function createDummyTable(res) {
    var tData = "";
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
    $(
      ".csv_files,.csv_dummy_files,.back_btn, .submit_btn,.next_btn,.next_btn_1"
    ).hide();
    $(".second_page,.category_btn").hide();
    $(".first_page,.next_btn").show();
    $(".first_page table tbody").html(`${tData}`);
  }

  var rowNum = null;
  $(document).on("click", ".option_row", function () {
    rowNum = $(this).data("id");
    $(".error_msg").hide();
    let va1 = $(this).attr("class");
    if (va1.includes("option_row_color")) {
      $(this).removeClass("option_row_color");
    } else {
      $(".option_row").removeClass("option_row_color");
      $(this).addClass("option_row_color");
    }
  });

  // Go back from pages
  $(document).on("click", ".back_btn", function () {
    let d1 = $(".first_page_1").css("display");
    let d2 = $(".second_page").css("display");

    $(".table_main").show();
    $(
      ".csv_files,.csv_dummy_files,.back_btn, .submit_btn,.next_btn,.next_btn_1,.next_btn"
    ).hide();
    if (d1 != "none") {
      $(".second_page,.first_page_1,.category_btn").hide();
      $(".first_page,.next_btn").show();
    } else if (d2 != "none") {
      $(".second_page,.first_page_1").hide();
      $(".first_page_1,.next_btn_1,.category_btn,.back_btn").show();
    }
  });

  selectMapping = (el) => {
    var id1 = $(el).attr("id").split("_select_")[1];
    $(`#ErrorMessage${id1}`).hide();
  };

  // click next button to go on column mapping page
  $(document).on("click", ".next_btn", function () {
    if (rowNum == null) {
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

      const emptyIndexes = _csvData[rowNum]
        .map((val, i) => (val != null ? i : -1))
        .filter((index) => index !== -1);

      var emptyIndxArr = [];
      for (let b = 0; b < emptyIndexes[emptyIndexes.length - 1]; b++) {
        if (!emptyIndexes.includes(b)) {
          emptyIndxArr.push(b);
        }
      }

      if (Array.isArray(temp) && temp.length > 0) {
        temp.forEach((arr) => {
          if (Array.isArray(arr) && arr.length > 0) {
            for (let c = 0; c < arr.length - 1; c++) {
              if (!emptyIndxArr.includes(c)) {
                if (arr[0]) {
                  arr[c] = arr[c] ? arr[c] : "";
                }
              }
            }

            var temp2 = arr.filter((v, i) => !emptyIndxArr.includes(i));
            if (temp2.length == _len || temp2.length == headers.length) {
              file_data.push(temp2);
            }
          }
        });
      }

      resultArray.headers = headers;
      resultArray.file_data = file_data;
      tableColumnMapping(resultArray);
      createCategoryBtn(resultArray);
    }
  });

  var mappedResult;
  // click next button after mapping all column and got to final table
  $(document).on("click", ".next_btn_1", function () {
    mappedResult = {};

    var error_val = 0;
    var input1 = $(".mappedVal");
    var input2 = $(".mappingVal");
    var mappedVal = [];
    var mappingVal = [];

    for (let i = 0; i < input2.length; i++) {
      let v1 = $(input2[i]).find(":selected").val();
      let v2 = $(input1[i]).data("value");
      if (v1 != "") {
        mappingVal.push(v1);
      } else {
        mappingVal.push("");
      }
    }
    for (let i = 0; i < input1.length; i++) {
      mappedVal.push($(input1[i]).data("value"));
    }

    mappedVal.forEach((key, i) => {
      if (mappingVal[i] != 1) {
        mappedResult[key] = mappingVal[i];
      }
    });

    for (var i = 0; i < mappingVal.length; i++) {
      if (mappingVal[i] == "") {
        error_val = 1;
        $(`#ErrorMessage${i}`).show();
      }
    }

    if (error_val == 1) {
      return false;
    }

    createTable(resultArray, mappedResult);
  });

  const searchResult = (sel) => {
    let { headers, file_data } = resultArray;
    let result = {
      headers,
      file_data,
    };

    if (sel.length > 0) {
      result.file_data = sel.length
        ? result?.file_data.filter((v) => {
            return sel.includes(v[0].toLowerCase());
          })
        : result?.file_data;
    }

    createTable(result, mappedResult);
  };

  let sel = [];
  // Filter record based on cateogry
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

    searchResult(sel);
  });

  // upload sheet
  $(".upload_master_sheet").change(function () {
    var imgData = $(".upload_master_sheet")[0].files[0];

    if (imgData != undefined) {
      var fileType = ["csv", "xsls", "xls", "xlsx"];
      var file_typ = imgData.name.substring(imgData.name.lastIndexOf(".") + 1);
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
          let csv_data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
            header: 1,
          });
          _csvData = csv_data.length ? csv_data : _csvData;
        });

        createDummyTable(_csvData);
      };

      reader.readAsBinaryString(imgData);
    }
  });

  // download the sheet after updating table
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
