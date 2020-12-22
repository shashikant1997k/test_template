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
  var topData = {};
  var _totalValue;
  var tempCat = ["bi", "cf", "nd", "sx", "at", "ju"];
  var catgName = [
    "Bi-Biscuits",
    "CF-Confectionery",
    "ND-Noodles",
    "SX-Snacks",
    "AT-Atta",
    "JU-Juice",
  ];
  var CatgColor = [
    "#35a630",
    "#e08f62",
    "#583d72",
    "#cc7351",
    "#a685e2",
    "#ffd66b",
  ];

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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
    if (resultArray.file_data.length == 0) {
      $(".panel_group").html(
        "<div class='text-center' style='padding:10px;font-size:16px;width:100%;border:1.5px solid #DDD;font-weight:600;'>No Data</div>"
      );
      return false;
    }

    // Create the topbar data info table
    var topDataTable = `<table class="topDatatable">
                          <tr>
                            <td class="tr_1td title_">WD Name:</td>
                            <td class="tr_1td value_">${topData["wd name"]}</td>
                            <td class="tr_1td title_">WD Address:</td>
                            <td class="tr_1td value_">${topData["wd address"]}</td>
                          </tr>
                          <tr>
                            <td class="title_">Task Number:</td>
                            <td class="value_">${topData["task number"]}</td>
                            <td class="title_">Total Value:</td>
                            <td class="value_">${_totalValue}</span></td>
                          </tr>
                        </table>`;

    $(".topDataInfo").html(topDataTable);

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
    var rfaQty;
    var itmCode;
    var categoryVar;
    var itemName;
    var totalValue;
    var salvQty;
    var salvValue;
    var rfaValue;

    $(".table_main").show();
    $(".second_page,.back_btn,.submit_btn,.category_btn").show();
    $(".first_page,.first_page_1,.next_btn,.next_btn_1").hide();

    // creating the table data
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
        if (val.toLowerCase() == "category") {
          categoryVar = i;
        }
        if (val.toLowerCase() == "item code") {
          itmCode = i;
        }
        if (val.toLowerCase() == "item name") {
          itemName = i;
        }
        if (val.toLowerCase() == "rfa qty") {
          rfaQty = i;
        }
        if (val.toLowerCase() == "total value") {
          totalValue = i;
        }
        if (val.toLowerCase() == "salv qty") {
          salvQty = i;
        }
        if (val.toLowerCase() == "salv value") {
          salvValue = i;
        }
        if (val.toLowerCase() == "rfa value") {
          rfaValue = i;
        }
      });
      $(".table_head_row").html(`<tr>${th_data}</tr>`);
    }

    var tables = "";
    var ct = 0;
    for (const [key, value] of Object.entries(arr1)) {
      var tr_data = "";
      var totalRfaQty = 0;
      var totalSumValue = 0;
      ct++;
      value.forEach((item, index) => {
        if (item.length == headLen || item.length == dataLen) {
          var td_data = ``;
          item.forEach((val, i) => {
            if (i == categoryVar || i == itmCode) {
              td_data += ``;
            } else if (i == rfaQty) {
              td_data += `<td class="${
                mobileVar == 1
                  ? "editable_cell editable_cell_style"
                  : "editable_cell"
              }" data-id="${parseInt(
                val
              )}" data-index="${index}" data-category="${key}" data-itemCode="${
                item[itmCode]
              }">${parseInt(val)}</td>`;
              totalRfaQty += Number(val);
            } else if (i == itemName) {
              td_data += `<td class="first_visible_td">
                  <div class="category_style">
                    <div>
                    ${
                      tempCat.indexOf(key.toLowerCase()) != -1
                        ? `<div class="category_icon" style="background-color:${
                            CatgColor[tempCat.indexOf(key.toLowerCase())]
                          };border-color:${
                            CatgColor[tempCat.indexOf(key.toLowerCase())]
                          };">${item[categoryVar]}</div>`
                        : `<div class="category_icon" style="background-color:#35a630;border-color:#35a630;">${item[categoryVar]}</div>`
                    }
                      
                    </div>
                    <div class="name_code_style">
                      <div>${val}</div>
                      <div class="item_code">${item[itmCode]}</div>
                    </div>
                  </div>
                </td>`;
            } else if (i == totalValue) {
              totalSumValue += Number(val);
              td_data += `<td class="update_tVal_${key}_${index}">${val}</td>`;
            } else if (i == salvQty) {
              td_data += `<td class="update_slvQty_${key}_${index}">${val}</td>`;
            } else if (i == salvValue) {
              td_data += `<td class="update_slvVal_${key}_${index}">${val}</td>`;
            } else if (i == rfaValue) {
              td_data += `<td class="update_rfaVal_${key}_${index}">${val}</td>`;
            } else {
              td_data += `<td class="update_${val}">${val}</td>`;
            }
          });

          // tr_data += `<tr ${
          //   index == 0 ? "data-expanded='true'" : ""
          // }>${td_data}</tr>`;

          tr_data += `<tr>${td_data}</tr>`;
        }
      });

      tables += `<div class="panel panel-default panel_default" data-id="${key}">
                    <div class="panel-heading collapse_heading collapse_heading_${key}" role="tab" data-id="${key}" id="heading_${key}" style="padding: 2px 15px;">
                        <div class="panel-title">
                            <div class="panel1">
                                  <div style="display:flex;flex-direction:row;align-items:center;">
                                    ${
                                      tempCat.indexOf(key.toLowerCase()) != -1
                                        ? `<span class="category_icon" style="background-color:${
                                            CatgColor[
                                              tempCat.indexOf(key.toLowerCase())
                                            ]
                                          };border-color:${
                                            CatgColor[
                                              tempCat.indexOf(key.toLowerCase())
                                            ]
                                          };">${key}</span><span style="margin-left:10px;font-size:0.8em;">
                                          ${
                                            catgName[
                                              tempCat.indexOf(key.toLowerCase())
                                            ]
                                          }
                                        </span>`
                                        : `<span class="category_icon" style="background-color:#35a630;border-color:#35a630;">${key}</span><span style="margin-left:10px;font-size:0.8em;">
                                        ${key}
                                      </span>`
                                    }
                                  </div>
                              <div class="TotalSumValues">Total Value: <span class="total_value">${totalSumValue.toFixed(
                                2
                              )}</span></div>
                              <div class="TotalSumQty">Total Qty.: <span class="total_rfaQty">${totalRfaQty.toFixed(
                                2
                              )}</span></div>
                            </div>
                            <div class="more_details_main">
                              <div class="more_details">
                                <span>More Details </span><span class="collapse_caret collapse_icon_${key}"><i class="fa fa-angle-down" aria-hidden="true"></i></span>
                              </div>
                              <div class="totalRows">Rows: <span class="total_rows">${
                                value.length
                              }</span>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div id="collapse_${key}" class="panel-collapse collapse ${
        ct == 1 ? "in" : ""
      }" role="tabpanel" aria-labelledby="heading_${key}">
                        <div class="panel-body">
                            <table id="collapse-table-${key}" class="table table-bordered masterSheetTable" data-sorting="true">
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

    $(`.collapse_heading`).click(function () {
      let id = $(this).data("id");
      let cl = $(`#collapse_${id}`).attr("class");
      if (cl.includes("in")) {
        $(`.collapse_heading_${id}`).attr(
          "style",
          "background-color: #FFF !important; padding: 2px 15px;"
        );
        $(`#collapse_${id}`).removeClass("in");
        if (!sel.includes(id.toLowerCase())) {
          $(`.switch_btn_${id}`).removeClass("active");
          $(`#_btns_${id}`)[0].checked = false;
          // sel = sel.filter((v) => v != id.toLocaleLowerCase());
        }

        $(`.collapse_icon_${id}`).html(
          '<i class="fa fa-angle-down" aria-hidden="true"></i>'
        );
      } else {
        $(`.collapse_heading_${id}`).attr(
          "style",
          "background-color: #F5F5F5 !important; padding: 2px 15px;"
        );
        $(`#collapse_${id}`).addClass("in");
        $(`.switch_btn_${id}`).addClass("active");
        $(`#_btns_${id}`)[0].checked = true;

        // if (!sel.includes(id.toLowerCase())) {
        //   sel.push(id.toLocaleLowerCase());
        // }

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
          `<input type='text' inputmode='numeric' pattern="[0-9]" class="_input _input_${v3}" style='width:100%;' data-id="${v3}" value='${v1}' />`
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

          let updateRfaQty = $(this).children().val();
          $(this).html(parseInt(updateRfaQty));
          $(this).data("id", parseInt(updateRfaQty));
          let updatedItemCode = $(this).attr("data-itemCode");
          let indexNo = $(this).attr("data-index");
          let categoryName = $(this).attr("data-category");

          $(".loading").show();
          setTimeout(() => {
            $(".loading").hide();

            swal({
              title: "Successfully Updated!",
              text: "Successfully Updated",
              icon: "success",
              buttons: false,
              timer: 1500,
            });
          }, 1000);
        }
      });
    }

    $(document).on("keypress", "._input", function (event) {
      if (
        event.code == "ArrowLeft" ||
        event.code == "ArrowRight" ||
        event.code == "ArrowUp" ||
        event.code == "ArrowDown" ||
        event.code == "Delete" ||
        event.code == "Backspace"
      ) {
        return;
      } else if (event.key.search(/\d/) == -1) {
        event.preventDefault();
      }
    });

    $(document).on("keypress", function (e) {
      var key = e.keyCode || e.charCode;
      if (key == 13) {
        e.preventDefault();
        removeInput();
      }
    });

    $(document).click(function () {
      if (!$("._input").is(":focus")) {
        removeInput();
      }
    });
  }

  // create all category filter button
  function createCategoryBtn(resultArray) {
    resultArray.file_data.forEach((item, index) => {
      if (categories.indexOf(item[0]) == -1) {
        categories.push(item[0]);
      }
    });

    var catBtn = "";
    var catBtn2 =
      '<li><a data-id="all" class="dropDownItem dropDownItem_all" href="#">All</a></li>';
    categories.forEach((val) => {
      catBtn += `<input id="_btns_${val}" class="checkbox_btns" type="checkbox"><label class="switch_btn switch_btn_${val}" data-val="${val}" for="_btns_${val}">${val}</label>`;
      catBtn2 += `<li><a data-id="${val}" class="dropDownItem dropDownItem_${val}" href="#">${val}</a></li>`;
    });

    $(".category_btn").html(catBtn);
    $(".scrollable-dropdown").html(catBtn2);
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

      for (let i = 0; i < csv2.length; i = i + 2) {
        topData[csv2[i].toLowerCase()] = csv2[i + 1];
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

      var tempArr = [];
      for (let c = 0; c < temp.length; c++) {
        if (Array.isArray(temp[c]) && temp[c].length > 0) {
          tempArr.push(temp[c]);
        }
      }

      if (Array.isArray(tempArr) && tempArr.length > 0) {
        tempArr.forEach((arr) => {
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

      let totValArr = tempArr[file_data.length].filter((v) => v);
      _totalValue = totValArr[1];

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

  const searchResult = (input, sel) => {
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
    if (input.length > 0) {
      let val = input.toLowerCase();
      let allItemName = [];
      result.file_data.forEach((v) => {
        allItemName.push(v[2]);
      });

      $("#searchInput").autocomplete({
        source: allItemName,
      });

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

    createTable(result, mappedResult);
  };

  var input = "";
  var sel = [];
  $("#searchInput").on("change keyup paste", function () {
    input = $(this).val();
    searchResult(input, sel);
  });

  function searchClicked(input, sel) {
    $(`.collapse_heading`).each(function () {
      let id = $(this).data("id");
      let cl = $(`#collapse_${id}`).attr("class");
      if (cl.includes("in")) {
        $("#search_concept").html(id);

        // $(`#collapse_${id}`).addClass("in");
        // $(`.switch_btn_${id}`).addClass("active");
        // $(`#_btns_${id}`)[0].checked = true;
        // if (!sel.includes(id.toLowerCase())) {
        //   sel.push(id.toLocaleLowerCase());
        // }
      } else {
        // $(`#collapse_${id}`).removeClass("in");
        // $(`.switch_btn_${id}`).removeClass("active");
        // $(`#_btns_${id}`)[0].checked = false;
        // sel = sel.filter((v) => v != id.toLocaleLowerCase());
      }
    });
    setTimeout(() => {
      $("#searchInput").blur();
    }, 100);

    searchResult(input, sel);
  }

  $("#searchInput").on("keydown", function search(e) {
    if (e.keyCode == 13) {
      searchClicked(input, sel);
    }
  });

  $(".searchButton").click(function () {
    searchClicked(input, sel);
  });

  $(document).on("click", ".dropDownItem", function (e) {
    e.preventDefault();
    // $("#searchInput").val("");
    // input = "";
    var selectedCat = $(this).text();
    var lowerCaseCategory = [];
    categories.forEach((v) => {
      lowerCaseCategory.push(v.toLowerCase());
    });
    $(".search-panel span#search_concept").text(selectedCat);
    $(".checkbox_btns").each(function () {
      $(this)[0].checked = false;
    });
    $(".switch_btn").each(function () {
      $(this).removeClass("active");
    });
    sel.length = 0;

    if (selectedCat == "All") {
      searchResult(input, lowerCaseCategory);
    } else {
      $(`#_btns_${selectedCat}`)[0].checked = true;
      $(`.switch_btn_${selectedCat}`).addClass("active");
      sel.push(selectedCat.toLocaleLowerCase());
      searchResult(input, [selectedCat.toLocaleLowerCase()]);
    }
  });

  // Filter record based on cateogry
  $(document).on("click", ".switch_btn", function () {
    let cls1 = $(this).attr("class");
    let d_val = "";
    $("#search_concept").html("All");
    if (cls1.includes("active")) {
      $(this).removeClass("active");
      d_val = $(this).data("val");
      sel = sel.filter((v) => v != d_val.toLocaleLowerCase());
    } else {
      $(this).addClass("active");
      d_val = $(this).data("val");
      sel.push(d_val.toLocaleLowerCase());
    }

    searchResult(input, sel);
  });

  // upload master sheet to edit
  function uploadSheet(files) {
    // var imgData = $(".upload_master_sheet")[0].files[0];
    var imgData = files;

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
  }

  // download the sheet after updating table
  $("#download").click(function () {
    // let aa = new FooTable.Export(new FooTable.Table("#collapse-table-BI"));
    // var tble = document.getElementById("masterSheetTable");
    // var row = tble.rows;
    // for (let i = 0; i < row[0].cells.length; i++) {
    //   var str = row[0].cells[i];
    //   var id = $(str).data("id");
    //   if (id == "edit_row") {
    //     for (var j = 0; j < row.length; j++) {
    //       row[j].deleteCell(i);
    //     }
    //   }
    // }
    // let table = document.querySelector("#masterSheetTable");
    // TableToExcel.convert(table, {
    //   name: "masterSheet.xlsx",
    // });
  });

  $("#uploadFiles").on("click", function () {
    $(".file_names").html("");
  });
  if ($("#uploadFiles")[0]) {
    var fileInput = document.querySelector('label[for="uploadFiles"]');
    fileInput.ondragover = function () {
      this.className = "uploadFiles_label changed";
      return false;
    };
    fileInput.ondragleave = function () {
      this.className = "uploadFiles_label";
      return false;
    };
    fileInput.ondrop = function (e) {
      e.preventDefault();
      var fileNames = e.dataTransfer.files;
      uploadSheet(fileNames[0]);
      $ = jQuery.noConflict();
      $('label[for="uploadFiles"]').append(
        "<div class='file_names'>" + fileNames[0].name + "</div>"
      );
    };
    $("#uploadFiles").change(function () {
      uploadSheet($("#uploadFiles")[0].files[0]);
      var fileNames = $("#uploadFiles")[0].files[0].name;
      $('label[for="uploadFiles"]').append(
        "<div class='file_names'>" + fileNames + "</div>"
      );
      $('label[for="uploadFiles"]').css("background-color", "##eee9ff");
    });
  }
});
