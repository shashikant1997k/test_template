$(document).ready(function () {
  var mobileVar = 0;
  var categories = [];
  var screenWidth = window.matchMedia("(max-width: 768px)");
  if (screenWidth.matches) {
    mobileVar = 1;
  }

  var resultArray = {
    headers: [],
    file_data: [],
  };
  var topData = {};
  var sheetTopInfo = {};
  var tempCat = ["bi", "cf", "nd", "sx", "at", "ju", "sn"];
  var catgName = [
    "Biscuits",
    "Confectionery",
    "Noodles",
    "Snacks",
    "Atta",
    "Juice",
    "Pasta",
  ];
  var CatgColor = [
    "#35a630",
    "#e08f62",
    "#583d72",
    "#cc7351",
    "#a685e2",
    "#ffd66b",
  ];

  // New Code start
  var fetchedValue = [
    {
      category: "BI",
      bagCount: 12,
      expectedWt: 20,
      receivedWt: 121,
      variance: 121,
    },
    {
      category: "ND",
      bagCount: 34,
      expectedWt: 0,
      receivedWt: 233,
      variance: 233,
    },
    {
      category: "CF",
      bagCount: 20,
      expectedWt: 300,
      receivedWt: 459,
      variance: 459,
    },
    {
      category: "AT",
      bagCount: 456,
      expectedWt: 0,
      receivedWt: 2364,
      variance: 2364,
    },
  ];

  // Function to generate random color.
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Function to seprate number by placing comma on appropriate places.
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Function to Change the sentence to title case (Captlize first letter of each word)
  var toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // map table uploaded sheet column from pre-define values
  function tableColumnMapping(output) {
    $(".table_main").show();
    $(".first_page_1,.back_btn,.category_btn,.next_btn_1").show();
    $(".first_page,.second_page,.next_btn,.submit_btn,.searchMain").hide();
    var headers = output.headers || [];
    var file_data = output.file_data || [];
    var tData = "";
    var thData = "";
    var optionRow = "";
    var mobileOptionRow = "";

    var map_array = {
      Category: "category",
      "Item Code": "item_code",
      "Item Name": "item_name",
      "Item Qty": "item_qty",
      "Total Value": "total_value",
      "Salv Qty": "salv_qty",
      UOM: "uom",
      "Salv Value": "salv_value",
      "Item Value": "item_value",
      "No Mapping": "no_mapping",
    };

    // creating column mapping dropdown
    if (Array.isArray(headers) && headers.length) {
      for (var j = 0; j < headers.length; j++) {
        if (headers[j]) {
          // For mobile view
          if (mobileVar) {
            let mobileSelect = "";
            for (var key in map_array) {
              let con1 = headers[j].split(" ").join("_");
              mobileSelect += `<option ${
                con1.toLowerCase() == map_array[key] ? "selected" : ""
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
                    <div id="ErrorMessage${j}" style="color:red;font-weight:600; display:none; font-size: 11px; text-align: left;  text-transform: capitalize; margin-top: 3px;">Select field</div>
                  </div>
                </div>
                
                 </td> `;
          } else {
            optionRow += `<td class="_data_td${j}"><div class="_select_td">
                <div class="_select">
                  <select class="form-control mappingVal" onchange="selectMapping(this)" id="_select_${j}">
                    <option value="">Select</option>`;

            for (var key in map_array) {
              let con1 = headers[j].split(" ").join("_");
              optionRow += `<option ${
                con1.toLowerCase() == map_array[key] ? "selected" : ""
              } value="${map_array[key]}" align='center'>${key}</option>`;
            }

            optionRow += `</select></div></div><div id="ErrorMessage${j}" style="color:red;font-weight:600;margin-left:3.5rem; display:none; font-size: 11px; text-align: left;  text-transform: capitalize; margin-top: 3px;">Select field</div></td>`;

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

  // Hide the extra column which are mapped with 'no_mapping' key.
  function hideExtraColumn() {
    let moa = Object.values(mappedResult);
    for (const [key, val] of Object.entries(mappedResult)) {
      let i = moa.indexOf(val);
      moa[i] = `${val}_${i}`;
      if (val == "no_mapping") {
        if (mobileVar == 1) {
          $(`.footable-details .tdata_${i}`)
            .parent()
            .attr("style", "display:none !important;");
        } else {
          $(`.${key}_${i}`).attr(
            "style",
            "background: #E6E7EB;display:none !important;"
          );
          $(`.tdata_${i}`).attr("style", "display:none !important;");
        }
      }
    }
  }

  // Create the table from uploaded sheet after the mapping the column header
  function createTable(resultArray, mappedObj) {
    console.log(resultArray);
    if (resultArray.file_data.length == 0) {
      $(".panel_group").html(
        "<div class='text-center noDataDiv' style='padding:10px;font-size:16px;width:100%;border:1.5px solid #DDD;font-weight:600;'>No Data</div>"
      );
      return false;
    }
    $(".addItemForm").hide();

    let _totalItemValSum = 0;
    let _totalItemQtySum = 0;
    // Create the topbar data info table
    var topDataTable = `<table class="topDatatable">
                          <tr>
                            <td class="tr_1td title_">WD Name:</td>
                            <td class="tr_1td value_">${sheetTopInfo["wd_name"]}</td>
                            <td class="tr_1td title_">Destruction Period:</td>
                            <td class="tr_1td value_">${sheetTopInfo["destruction_period"]}</td>
                          </tr>
                          <tr>
                            <td class="tr_1td title_">Task Number:</td>
                            <td class="tr_1td value_">${sheetTopInfo["task_number"]}</td>
                            <td class="tr_1td title_">Scheduled date:</td>
                            <td class="tr_1td value_">${sheetTopInfo["date"]}</td>
                          </tr>
                          <tr>
                            <td class="title_">Total Value:</td>
                            <td class="value_ _totSumItem"></td>
                            <td class="title_">Total Weight:</td>
                            <td class="value_"><span class="_totSumWght"></span><span> kg</span></td>
                          </tr>
                        </table>`;

    $(".topDataInfo").html(topDataTable);

    var headLen = resultArray.headers.length;
    var dataLen = resultArray.file_data[0].length;
    let num1;
    Object.values(mappedObj).forEach((v, i) => {
      if (v == "category") {
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
    var itemQty;
    var itmCode;
    var categoryVar;
    var itemName;
    var totalValue;
    var salvQty;
    var salvValue;
    var itemValue;
    var showMoreColumn = "";

    $(".table_main").show();
    $(".second_page,.back_btn,.submit_btn,.category_btn").show();
    $(".searchMain").css("display", "flex");
    $(".first_page,.first_page_1,.next_btn,.next_btn_1").hide();
    let mappedObjArr = Object.values(mappedObj);
    // creating the table data
    if (
      Array.isArray(Object.values(mappedObj)) &&
      Object.values(mappedObj).length != 0
    ) {
      for (const [key, val] of Object.entries(mappedObj)) {
        // Object.values(mappedObj).forEach((val, i) => {
        let i = mappedObjArr.indexOf(val);
        mappedObjArr[i] = `${val}_${i}`;

        if (val == "category") {
          categoryVar = i;
          th_data += ``;
        } else if (val == "item_code") {
          itmCode = i;
          th_data += ``;
        } else if (val == "item_name") {
          itemName = i;
          th_data += `<th class="${key}_${i}" style="background: #E6E7EB;">${toTitleCase(
            val
          )}</th>`;
        } else if (val == "item_qty") {
          itemQty = i;
          th_data += `<th class="${key}_${i}" data-type="number" style="background: #E6E7EB;">${toTitleCase(
            val
          )}</th>`;
        } else if (val == "total_value") {
          totalValue = i;
          th_data += `<th class="${key}_${i}" data-type="number" style="background: #E6E7EB;" data-breakpoints="xs">${toTitleCase(
            val
          )}</th>`;
        } else if (val == "salv_qty") {
          salvQty = i;
          th_data += `<th class="${key}_${i}" data-type="number" style="background: #E6E7EB;" data-breakpoints="xs">${toTitleCase(
            val
          )}</th>`;
        } else if (val == "salv_value") {
          salvValue = i;
          th_data += `<th class="${key}_${i}" data-type="number" style="background: #E6E7EB;" data-breakpoints="xs">${toTitleCase(
            val
          )}</th>`;
        } else if (val == "item_value") {
          itemValue = i;
          th_data += `<th class="${key}_${i}" data-type="number" style="background: #E6E7EB;" data-breakpoints="xs">${toTitleCase(
            val
          )}</th>`;
        } else if (val == "uom") {
          th_data += `<th class="${key}_${i}" style="background: #E6E7EB;" data-breakpoints="xs">${toTitleCase(
            val
          )}</th>`;
        } else {
          if (val == "no_mapping") {
            th_data += `<th class="${key}_${i}" style="background: #E6E7EB;" data-breakpoints="xs">${toTitleCase(
              key
            )}</th>`;
          } else {
            th_data += `<th class="${key}_${i}" style="background: #E6E7EB;" data-breakpoints="xs">${toTitleCase(
              val
            )}</th>`;
          }
        }

        if (!["category", "item_code", "item_name", "item_qty"].includes(val)) {
          showMoreColumn += `<div class="col-sm-4 col-xs-6 d-flex-row">
                                  <input type="checkbox" class="inputShowColumn" ${
                                    val == "no_mapping" ? "" : "checked"
                                  } id="more_checkbox_${i}" style="margin-right: 5px;" data-id="${i}" value="${key}_${i}">
                                  <label for="more_checkbox_${i}">${
            val == "no_mapping" ? toTitleCase(key) : toTitleCase(val)
          }</label><br></div>`;
        }

        // });
      }
      $("#moreColumnModal .modal-body .row").html(showMoreColumn);
      $(".table_head_row").html(`<tr>${th_data}</tr>`);
    }

    var tables = "";
    var ct = 0;
    for (const [key, value] of Object.entries(arr1)) {
      var tr_data = "";
      var totalItemQty = 0;
      var totalItemValue = 0;
      let randCol = getRandomColor();
      ct++;
      value.forEach((item, index) => {
        if (item.length == headLen || item.length == dataLen) {
          var td_data = ``;
          item.forEach((val, i) => {
            if (i == categoryVar || i == itmCode) {
              td_data += ``;
            } else if (i == itemQty) {
              td_data += `<td class="${
                mobileVar == 1
                  ? "editable_cell editable_cell_style"
                  : "editable_cell"
              } tdata_${i}" data-id="${parseInt(
                val
              )}" data-index="${index}" data-category="${key}" data-itemCode="${
                item[itmCode]
              }">${parseInt(val)}</td>`;
              totalItemQty += Number(val);
            } else if (i == itemName) {
              td_data += `<td class="first_visible_td tdata_${i}">
                  <div class="category_style">
                    <div>
                    ${
                      tempCat.indexOf(key.toLowerCase()) != -1
                        ? `<div class="category_icon" style="background-color:${randCol};border-color:${randCol};">${item[categoryVar]}</div>`
                        : `<div class="category_icon" style="background-color:${randCol};border-color:${randCol};">${item[categoryVar]}</div>`
                    }
                      
                    </div>
                    <div class="name_code_style">
                      <div>${val}</div>
                      <div class="item_code">${
                        item[itmCode] != undefined ? item[itmCode] : ""
                      }</div>
                    </div>
                  </div>
                </td>`;
            } else if (i == totalValue) {
              td_data += `<td class="update_tVal_${key}_${index} tdata_${i}">
              ${numberWithCommas(Number(val).toFixed(2))}
              </td>`;
            } else if (i == salvQty) {
              td_data += `<td class="update_slvQty_${key}_${index} tdata_${i}">
              ${numberWithCommas(val)}</td>`;
            } else if (i == salvValue) {
              td_data += `<td class="update_slvVal_${key}_${index} tdata_${i}">
              ${numberWithCommas(Number(val).toFixed(2))}</td>`;
            } else if (i == itemValue) {
              totalItemValue += Number(val);
              td_data += `<td class="update_itemVal_${key}_${index} tdata_${i}">
              ${numberWithCommas(Number(val).toFixed(2))}</td>`;
            } else {
              td_data += `<td class="tdata_${i}">${val}</td>`;
            }
          });

          // tr_data += `<tr ${
          //   index == 0 ? "data-expanded='true'" : ""
          // }>${td_data}</tr>`;

          tr_data += `<tr>${td_data}</tr>`;
        }
      });

      tables += `<div class="panel panel-default panel_default panel_default_${key}" data-id="${key}">
                    <div class="panel-heading collapse_heading collapse_heading_${key}" role="tab" data-id="${key}" id="heading_${key}" style="">
                        <div class="panel-title">
                            <div class="panel1">
                                  <div class="panel_category">
                                    ${
                                      tempCat.indexOf(key.toLowerCase()) != -1
                                        ? `<span class="category_icon" style="background-color:${randCol};border-color:${randCol};">${key}</span><span class="cat_text" style="margin-left:10px;font-size:0.8em;">
                                          ${
                                            catgName[
                                              tempCat.indexOf(key.toLowerCase())
                                            ]
                                          }
                                        </span>`
                                        : `<span class="category_icon" style="background-color:${randCol};border-color:${randCol};">${key}</span><span class="cat_text" style="margin-left:10px;font-size:0.8em;">
                                        ${key}
                                      </span>`
                                    }
                                  </div>
                                <div class="panel1_rows">
                                  <div class="panel1_row">
                                    <div class="fnt_size m_b_4">
                                      <span style="font-weight:normal">Exp. Weight</span>: <span class="expected_weight expected_${key}">0.00</span> <span> kg</span>
                                    </div>
                                    <div class="fnt_size m_b_4">
                                    <span style="font-weight:normal">Rec. Weight</span>: <span class="received_${key}">0.00</span> <span> kg</span>
                                    </div>
                                    <div class="fnt_size">
                                      <span style="font-weight:normal">Variance</span>: &#8722;<span class="variance_${key}">0.00</span> <span> kg</span>
                                    </div>
                                  </div>
                                </div>
                            </div>
                            <div class="more_details_main">
                              <div class="more_details">
                                <span>More Details <i class="fa fa-angle-down" aria-hidden="true"></i></span>
                              </div>
                              <div class="panel2_rows">
                                <div class="panel2_row">
                                  <div class="TotalSumItemValues fnt_size m_b_4">
                                      <span style="font-weight:normal">Total Value</span>:<span class="total_value">
                                        <span style="font-weight: normal">₹ </span>
                                        ${numberWithCommas(
                                          totalItemValue.toFixed(2)
                                        )}</span>
                                  </div>
                                  <div class="TotalSumItemQty fnt_size">
                                      <span style="font-weight:normal">Pac</span>: <span class="total_itemQty">
                                      ${numberWithCommas(totalItemQty)}
                                      </span>
                                  </div>
                                  <div class="TotalBagCount fnt_size">
                                      <span style="font-weight:normal">Bag Count</span>: <span class="bagCount_${key}">0</span>
                                  </div>
                                  <div class="totalRows">Rows: <span class="total_rows">${
                                    value.length
                                  }</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div id="collapse_${key}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading_${key}">
                        <div class="panel-body">
                            <table id="collapse-table-${key}" class="table table-bordered masterSheetTable" data-sorting="true">
                              <thead>${th_data}</thead>
                              <tbody>${tr_data}</tbody>
                            </table>
                        </div>
                    </div>
                </div>`;

      _totalItemValSum += Number(totalItemValue);
      _totalItemQtySum += Number(totalItemQty);
    }

    $("._totSumItem").html(
      `<span style="font-weight: normal">₹ </span>${numberWithCommas(
        _totalItemValSum.toFixed(2)
      )}`
    );
    $("._totSumWght").html(`0.00`);

    // New Code start
    // Create the new card for pre-input data which are inputed before upload sheet.
    let fetchedValueTable = "";
    if (Array.isArray(fetchedValue) && fetchedValue.length > 0) {
      fetchedValue.forEach((item, i2) => {
        let th_data1 = "";
        let td_data1 = "";
        let key = item.category.toUpperCase();
        let randCol = getRandomColor();
        if (uploadedCategory.includes(key.toUpperCase())) {
          setTimeout(() => {
            if (parseInt(item.receivedWt)) {
              let rwt = $(`.received_${key}`).html();
              $(`.received_${key}`).html(
                (Number(item.receivedWt) + Number(rwt)).toFixed(2)
              );
            }
            if (parseInt(item.expectedWt)) {
              let ewt = $(`.expected_${key}`).html();
              $(`.expected_${key}`).html(
                (Number(item.expectedWt) + Number(ewt)).toFixed(2)
              );
            }
            if (parseInt(item.variance)) {
              let diff = Number($(`.variance_${key}`).html());
              $(`.variance_${key}`).html(
                (Number(item.variance) + Number(diff)).toFixed(2)
              );
            }
            if (parseInt(item.bagCount)) {
              let bct = Number($(`.bagCount_${key}`).html());
              $(`.bagCount_${key}`).html(Number(item.bagCount) + Number(bct));
            }
          }, 500);
        } else {
          fetchedValueTable += `<div class="panel panel-default panel_default panel_default_${key}" data-id="${key}">
          <div class="panel-heading collapse_heading collapse_heading_${key}" role="tab" data-id="${key}" id="heading_${key}" style="">
              <div class="panel-title">
                  <div class="panel1">
                        <div class="panel_category">
                          ${
                            tempCat.indexOf(key.toLowerCase()) != -1
                              ? `<span class="category_icon" style="background-color:${randCol};border-color:${randCol};">${key}</span><span class="cat_text" style="margin-left:10px;font-size:0.8em;">
                                ${catgName[tempCat.indexOf(key.toLowerCase())]}
                              </span>`
                              : `<span class="category_icon" style="background-color:${randCol};border-color:${randCol};">${key}</span><span class="cat_text" style="margin-left:10px;font-size:0.8em;">
                              ${key}
                            </span>`
                          }
                        </div>
                      <div class="panel1_rows">
                        <div class="panel1_row">
                          <div class="fnt_size m_b_4">
                          <span style="font-weight:normal">Exp. Weight</span>: <span class="expected_weight">${numberWithCommas(
                            item.expectedWt.toFixed(2)
                          )}</span> <span> kg</span>
                          </div>
                          <div class="fnt_size m_b_4">
                          <span style="font-weight:normal">Rec. Weight</span>: <span class="">${numberWithCommas(
                            item.receivedWt.toFixed(2)
                          )} </span><span> kg</span>
                          </div>
                          <div class="fnt_size">
                          <span style="font-weight:normal">Variance</span>: &#8722;<span class="">${numberWithCommas(
                            item.variance.toFixed(2)
                          )} </span><span> kg</span></div>
                        </div>
    
                      </div>
                      
                  </div>
                  <div class="more_details_main">
                    <div class="more_details">
                      <span>More Details <i class="fa fa-angle-down" aria-hidden="true"></i></span>
                    </div>
                    <div class="panel2_rows">
                      <div class="panel2_row">
                        <div class="TotalSumItemValues fnt_size m_b_4">
                        <span style="font-weight:normal">Total Value</span>: <span class="total_value">
                              <span style="font-weight: normal">₹ </span>
                              0.00</span></div>
                        <div class="TotalSumItemQty fnt_size ">
                            <span style="font-weight:normal">Pac</span>: <span class="total_itemQty">
                            0
                            </span>
                        </div>
                        <div class="TotalBagCount fnt_size">
                            <span style="font-weight:normal">Bag Count</span>: <span class="bagCount_${key}">${
            item.bagCount
          }</span>
                        </div>
                        <div class="totalRows">Rows: <span class="total_rows">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
          <div id="collapse_${key}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading_${key}">
              <div class="panel-body">
                  <table id="collapse-table-${key}" class="table table-bordered ${
            th_data1 != "" ? "masterSheetTable" : ""
          }" data-sorting="true">
                    <thead>${th_data1}</thead>
                    <tbody>${td_data1}</tbody>
                  </table>
              </div>
          </div>
      </div>`;
        }
      });
    }

    $(".panel-group").html(tables + "" + fetchedValueTable);

    $(function ($) {
      $(".masterSheetTable").footable();
    });

    setTimeout(() => {
      hideExtraColumn();
    }, 1000);

    // Expand the table clicking on the each category cards.
    $(`.collapse_heading`).click(function () {
      let id = $(this).data("id");
      let cl = $(`#collapse_${id}`).attr("class");
      if (cl.includes("in")) {
        $(`.collapse_heading_${id}`).attr(
          "style",
          "background-color: #FFF !important;"
        );
        $(`#collapse_${id}`).removeClass("in");
        $(`.panel_default_${id}`).removeClass("panel_default_active");
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
          "background-color: #F5F5F5 !important;"
        );
        $(`#collapse_${id}`).addClass("in");
        $(`.switch_btn_${id}`).addClass("active");
        $(`.panel_default_${id}`).addClass("panel_default_active");
        $(`#_btns_${id}`)[0].checked = true;
        $(`.collapse_icon_${id}`).html(
          '<i class="fa fa-angle-up" aria-hidden="true"></i>'
        );
      }
    });

    // Creating the Item Qty editable
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

    // Remove input from td after editing and sumbit the Item Qty.
    function removeInput() {
      $(".editable_cell").each(function () {
        let c1 = $(this).html();
        if (c1.includes(`<input type="text"`)) {
          if (mobileVar == 1) {
            $(this).css({ color: "#5d78ff", "font-weight": "600" });
          }

          let updateItemQty = $(this).children().val();
          $(this).html(parseInt(updateItemQty));
          $(this).data("id", parseInt(updateItemQty));
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

    // Disabling the character other than number.
    $(document).on("keypress", "._input", function (event) {
      var key = event.keyCode || event.charCode;
      if (
        event.code == "ArrowLeft" ||
        event.code == "ArrowRight" ||
        event.code == "ArrowUp" ||
        event.code == "ArrowDown" ||
        event.code == "Delete" ||
        event.code == "Backspace"
      ) {
        return;
      } else if (key == 13) {
        event.preventDefault();
        removeInput();
      } else if (event.key.search(/\d/) == -1) {
        event.preventDefault();
      }
    });

    $(document).click(function () {
      if (!$("._input").is(":focus")) {
        removeInput();
      }
    });

    // Expand the details (or hiddenn column) clicking on the row.
    $(".inputShowColumn").click(function () {
      let ch1 = $(this).data("id");
      let ch2 = $(this).val();
      if ($(this).prop("checked")) {
        if (mobileVar == 1) {
          $(`.footable-details .tdata_${ch1}`).parent().show();
        } else {
          $(`.${ch2}`).show();
          $(`.tdata_${ch1}`).show();
        }
      } else {
        if (mobileVar == 1) {
          $(`.footable-details .tdata_${ch1}`).parent().hide();
        } else {
          $(`.${ch2}`).hide();
          $(`.tdata_${ch1}`).hide();
        }
      }
    });

    $(document).on("click", ".footable-toggle", function () {
      setTimeout(() => {
        hideExtraColumn();
      }, 100);
    });

    (function () {
      let elmt = document.querySelector(".category_btn");
      if (elmt.offsetWidth < elmt.scrollWidth) {
        $(".rightSideScroll, .leftSideScroll").css("display", "flex");
      } else {
        $(".rightSideScroll, .leftSideScroll").css("display", "none");
      }
    })();

    setTimeout(() => {
      let totalExpWt = 0;
      $(".expected_weight").each(function () {
        totalExpWt += Number($(this).html());
      });
      if (totalExpWt) {
        $("._totSumWght").html(totalExpWt);
      }
    }, 1000);
  } // createTable() end////////

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  var uploadedCategory = [];
  // Creating the filters according to there Category
  function createCategoryBtn(resultArray) {
    categories = [];
    resultArray.file_data.forEach((item, index) => {
      if (categories.indexOf(item[0]) == -1) {
        categories.push(item[0].toUpperCase());
      }
    });

    // New Code start
    uploadedCategory = [...categories];
    fetchedValue.forEach((item) => {
      if (!categories.includes(item.category)) {
        categories.push(item.category.toUpperCase());
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
        tData += `<tr class="option_row option_row_${i}" href="#scrollToBtns" data-id="${i}"><td class="">${i}</td>`;
        for (var j = 0; j <= res[i].length; j++) {
          tData += `<td data-id="${res[i][j]}" class="_data_td${j}">${
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
      ".csv_files,.csv_dummy_files,.back_btn, .submit_btn,.next_btn,.next_btn_1,.searchMain"
    ).hide();
    $(
      ".second_page,.category_btn,.first_page_1,._steps,.stepDone,.stepBack"
    ).hide();
    $(".first_page,.next_btn,.step_1,.stepNext").show();
    $(".first_page table tbody").html(`${tData}`);

    $(".stepsC,.stepLine").removeClass("stepActive");
    $(".stepsC_1").addClass("stepActive");
    $("input").val("");
    $(".currentStep").html("1");
    $("html, body").animate({ scrollTop: 0 }, 500, "linear");
  }

  // Choosing the column header of sheet
  var rowNum = null;
  $(document).on("click", ".option_row", function () {
    if (setpDoneClicked == 1) {
      rowNum = $(this).data("id");
      $(".error_msg,.stepErrorMsg").hide();
      let va1 = $(this).attr("class");

      if (va1.includes("option_row_color")) {
        $(this).removeClass("option_row_color");
        $("#scrollToFirst").css("border", "2px solid red");
        rowNum = null;
      } else {
        $(".option_row").removeClass("option_row_color");
        $(this).addClass("option_row_color");
        $("html, body").animate(
          { scrollTop: $($(this).attr("href")).offset().top },
          1000,
          "linear"
        );
        $("#scrollToFirst").css("border", "0px");
        $(".stepperMain").show();
      }
    } else {
      $("html, body").animate({ scrollTop: 0 }, 500, "linear");
    }
  });

  // click on next button to go on the next page to input to select topbar info data
  $(".stepNext").click(function (e) {
    $(".stepErrorMsg").hide();
    $(this).css("pointer-events", "none");
    setTimeout(() => {
      $(this).css("pointer-events", "auto");
    }, 200);
    setpDoneClicked = 0;
    rowNum = null;
    $(".option_row").removeClass("option_row_hover");
    $(".option_row").removeClass("option_row_color");
    if ($(".currentStep").html() == 1) {
      if (
        $(`.step_${$(".currentStep").html()} #fromDate input`).val() == "" ||
        $(`.step_${$(".currentStep").html()} #toDate input`).val() == ""
      ) {
        $(".stepErrorMsg").show();
        return false;
      }
    } else {
      if ($(`.step_${$(".currentStep").html()} input`).val() == "") {
        $(".stepErrorMsg").show();
        return false;
      }
    }
    if (Number($(".currentStep").html()) < 4) {
      $(".currentStep").html(Number($(".currentStep").html()) + 1);
      $("._steps").hide();
      $(`.stepsC_${$(".currentStep").html()}`).addClass("stepActive");
      $(`.stepLine_${$(".currentStep").html()}`).addClass("stepActive");
      $(`.step_${$(".currentStep").html()}`).show(
        "slide",
        { direction: "right" },
        200
      );
      if (Number($(".currentStep").html()) == 4) {
        $(".stepNext").hide();
        $(".stepDone").show();
      }
      if (Number($(".currentStep").html()) > 1) {
        $(".stepBack").show();
      } else {
        $(".stepBack").hide();
      }
    }
  });

  // click on next button to go on the back page to input to select topbar info data
  $(".stepBack").click(function () {
    $(".stepErrorMsg").hide();
    $(".stepDone").hide();
    $("._steps").hide();
    $(this).css("pointer-events", "none");
    setTimeout(() => {
      $(this).css("pointer-events", "auto");
    }, 200);
    setpDoneClicked = 0;
    rowNum = null;
    $(".option_row").removeClass("option_row_hover");
    $(".option_row").removeClass("option_row_color");
    $(".stepperMain").css("border", "2px solid red");
    $("#scrollToFirst").css("border", "0px");
    if (Number($(".currentStep").html()) > 1) {
      $(".currentStep").html(Number($(".currentStep").html()) - 1);
      $(`.stepsC_${Number($(".currentStep").html()) + 1}`).removeClass(
        "stepActive"
      );
      $(`.stepLine_${Number($(".currentStep").html()) + 1}`).removeClass(
        "stepActive"
      );
      $(`.step_${$(".currentStep").html()}`).show(
        "slide",
        { direction: "left" },
        200
      );
      $(".stepBack").show();
      $(".stepNext").show();
      if (Number($(".currentStep").html()) == 1) {
        $(".stepBack").hide();
      }
    }
  });

  var setpDoneClicked = 0;
  $(".stepDone").click(function (e) {
    e.preventDefault();
    if ($(`.step_4 input`).val() == "") {
      $(".stepErrorMsg").show();
      return false;
    }
    setpDoneClicked = 1;
    $(".option_row").addClass("option_row_hover");
    $(".stepErrorMsg").hide();
    let mT = mobileVar == 1 ? 60 : 0;
    $(".stepperMain").css("border", "0px");
    $("#scrollToFirst").css("border", "2px solid red");
    $("html, body").animate(
      { scrollTop: $($(this).attr("href")).offset().top - mT },
      500,
      "linear"
    );
  });

  $("#scheduledDate").datepicker({
    autoclose: true,
    todayHighlight: true,
  });

  $("#fromDate").datepicker({
    autoclose: true,
    todayHighlight: true,
  });

  $("#toDate").datepicker({
    autoclose: true,
    todayHighlight: true,
  });

  // Go back from pages
  $(document).on("click", ".back_btn", function () {
    let d1 = $(".first_page_1").css("display");
    let d2 = $(".second_page").css("display");
    $(".table_main").show();
    $(
      ".csv_files,.csv_dummy_files,.back_btn, .submit_btn,.next_btn,.next_btn_1,.next_btn,.searchMain"
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
    $(".selectErrorMsg,.sameValueErrorMsg").hide();
  };

  var _csvData;

  // Click on next button after selcting the column header row and go on the column mapping page.
  $(document).on("click", ".next_btn", function () {
    if (rowNum == null) {
      $(".error_msg").show();
      return false;
    }

    $("#scrollToFirst").css("border", "0px");

    if (rowNum == 0) {
    } else {
      let fd = $(".step_1 #fromDate input").val().split("/");
      let td = $(".step_1 #toDate input").val().split("/");

      let sd = $(".step_4 input").val();
      let sd1;
      if (sd && (String(sd).includes("/") || String(sd).includes("-"))) {
        if (String(sd).includes("-")) {
          sd = String(sd).split("-");
        } else if (String(sd).includes("/")) {
          sd = String(sd).split("/");
        }
        sd1 = moment(new Date(sd[2], sd[1] - 1, sd[0])).format("ll");
      } else {
        sd1 = moment(
          new Date(Math.round((Number(sd) - 25569) * 86400 * 1000))
        ).format("ll");
      }

      sheetTopInfo = {
        destruction_period:
          fd && td
            ? `${moment(new Date(fd[2], fd[1] - 1, fd[0])).format(
                "ll"
              )} - ${moment(new Date(td[2], td[1] - 1, td[0])).format("ll")}`
            : "",
        wd_name: $(".step_2 input").val(),
        task_number: $(".step_3 input").val(),
        date: sd ? sd1 : "",
      };

      for (const key in sheetTopInfo) {
        if (sheetTopInfo[key] == "") {
          $("._steps").hide();
          $("._steps input").css("border", "1px solid #ccc");
          $(".stepErrorMsg").show();
          if (key == "destruction_period") {
            $(".step_1").show();
            $(".step_1 input").css("border", "1px solid red");
            $(".currentStep").html("1");
            return false;
          } else if (key == "wd_name") {
            $(".step_2").show();
            $(".step_2 input").css("border", "1px solid red");
            $(".currentStep").html("2");
            return false;
          } else if (key == "task_number") {
            $(".step_3").show();
            $(".step_3 input").css("border", "1px solid red");
            $(".currentStep").html("3");
            return false;
          } else if (key == "date") {
            $(".step_4").show();
            $(".step_4 input").css("border", "1px solid red");
            $(".currentStep").html("4");
            return false;
          }
        }
      }
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

      let _head =
        _csvData[rowNum].length > 0 && _csvData[rowNum].filter((v) => v);

      let headerIndexArr = [];
      var headers = [];
      for (let x = 0; x < _head.length; x++) {
        if (headers.indexOf(_head[x]) == -1) {
          headers.push(_head[x]);
        } else {
          headerIndexArr.push(x);
        }
      }

      var temp = _csvData.slice(rowNum + 1, _csvData.length);
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

      var temp1 = temp[0];
      for (let c = 0; c < temp1.length - 1; c++) {
        if (!emptyIndxArr.includes(c)) {
          if (temp1[0]) {
            temp1[c] = temp1[c] ? temp1[c] : "";
          }
        }
      }

      var temp1 = temp1.filter((v, i) => !emptyIndxArr.includes(i));
      var _len = temp1.length;

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
            temp2 = temp2.filter((v, i) => !headerIndexArr.includes(i));
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
  var mappedKeyIndex = {};
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
      let mpgVal = $(input1[i]).data("value");
      mpgVal = mpgVal.split(" ").join("_");
      mappedVal.push(mpgVal.toLowerCase());
    }

    mappedVal.forEach((key, i) => {
      if (mappingVal[i] != 1) {
        if (!mappedKeyIndex.hasOwnProperty(key)) {
          mappedKeyIndex[key] = i;
        }
        mappedResult[key] = mappingVal[i];
      }
    });

    let error_val2 = ["category", "item_name", "item_qty", "uom"].every((val) =>
      mappingVal.includes(val)
    );

    if (!error_val2) {
      $("html, body").animate({ scrollTop: 0 }, 300, "linear");
      $(`.selectErrorMsg`).show();
      return false;
    }

    let temprArr = [];
    for (var i = 0; i < mappingVal.length; i++) {
      if (temprArr.includes(mappingVal[i]) && mappingVal[i] != "no_mapping") {
        $(".sameValueErrorMsg").show();
        $("html, body").animate({ scrollTop: 0 }, 300, "linear");
        return false;
      }
      temprArr.push(mappingVal[i]);
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

  // Global search function based on the category, item code and item name
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

  // Click on the search button for global search
  function searchClicked(input, sel) {
    $(`.collapse_heading`).each(function (index) {
      let id = $(this).data("id");
      // let cl = $(`#collapse_${id}`).attr("class");
      // if (cl.includes("in"))

      if (index == 0) {
        $("#search_concept").html(id);
        $(`#collapse_${id}`).addClass("in");
        $(`.switch_btn_${id}`).addClass("active");
        $(`#_btns_${id}`)[0].checked = true;
        if (!sel.includes(id.toLowerCase())) {
          sel.push(id.toLocaleLowerCase());
        }
      } else {
        $(`#collapse_${id}`).removeClass("in");
        $(`.switch_btn_${id}`).removeClass("active");
        $(`#_btns_${id}`)[0].checked = false;
        sel = sel.filter((v) => v != id.toLocaleLowerCase());
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

  function tog(v) {
    return v ? "addClass" : "removeClass";
  }
  $(document)
    .on("input", "#searchInput", function () {
      $(this)[tog(this.value)]("x");
    })
    .on("mousemove", ".x", function (e) {
      $(this)[
        tog(
          this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left
        )
      ]("onX");
    })
    .on("touchstart click", ".onX", function (ev) {
      ev.preventDefault();
      $(this).removeClass("x onX").val("").change();
    });

  $(".searchButton").on("click", function () {
    searchClicked(input, sel);
  });

  // dropdown list of all category. Use for searching the particular category.
  $(document).on("click", ".dropDownItem", function (e) {
    e.preventDefault();
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

  if ($("#uploadFiles")[0]) {
    var fileInput = document.querySelector('label[for="uploadFiles"]');
    $("#uploadFiles").change(function () {
      uploadSheet($("#uploadFiles")[0].files[0]);
      var fileNames = $("#uploadFiles")[0].files[0].name;
    });
  }

  // Click on Add Item to add a new row in table by entering some field.
  $(".addItem").click(function () {
    if ($(".addItemForm").css("display") != "none") {
      $(".addItemForm").hide();
    } else {
      $(".addItemForm").show();
    }
  });

  $(".close_btn span").click(function () {
    $(".addItemForm").hide();
  });

  // Submit the form after filling the form for adding a new row.
  $(".add_item_form").on("submit", function (e) {
    e.preventDefault();
    let add_category = $("#add_category").val();
    let add_itemcode = $("#add_itemcode").val();
    let add_itemname = $("#add_itemname").val();
    let add_itemqty = $("#add_itemqty").val();

    let addCatId = $("#add_category").data("id");
    let additCodeId = $("#add_itemcode").data("id");
    let additmNameID = $("#add_itemname").data("id");
    let additemQtyID = $("#add_itemqty").data("id");

    let keyValObj = {
      [addCatId]: add_category.toUpperCase(),
      [additCodeId]: add_itemcode.toUpperCase(),
      [additmNameID]: add_itemname.toUpperCase(),
      [additemQtyID]: add_itemqty,
    };

    let addedItem = [];
    for (const key in mappedKeyIndex) {
      if (key == "uom") {
        addedItem[mappedKeyIndex[key]] = "PAC";
      } else {
        addedItem[mappedKeyIndex[key]] = keyValObj[key]
          ? keyValObj[key]
          : "0.00";
      }
    }

    uploadedCategory.push(add_category.toUpperCase());

    resultArray.file_data.push(addedItem);
    createTable(resultArray, mappedResult);
    createCategoryBtn(resultArray);

    $(".add_item_form input").each(function () {
      $(this).val("");
    });
  });

  document
    .querySelector(".rightSideScroll")
    .addEventListener("click", function (e) {
      document.querySelector(".category_btn").scrollBy({
        top: 0,
        left: 50,
        behavior: "smooth",
      });
    });

  document
    .querySelector(".leftSideScroll")
    .addEventListener("click", function (e) {
      document.querySelector(".category_btn").scrollBy({
        top: 0,
        left: -50,
        behavior: "smooth",
      });
    });

  window.onresize = function (event) {
    let elmt = document.querySelector(".category_btn");
    if (elmt.offsetWidth < elmt.scrollWidth) {
      $(".rightSideScroll, .leftSideScroll").css("display", "flex");
    } else {
      $(".rightSideScroll, .leftSideScroll").css("display", "none");
    }
  };

  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $("#backToTop").fadeIn();
    } else {
      $("#backToTop").fadeOut();
    }
  });
  $("#backToTop").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
  });
});
