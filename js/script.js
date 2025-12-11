
var bookDataFromLocalStorage = [];
var bookLendDataFromLocalStorage =[];

var state="";

var stateOption={
    "add":"add",
    "update":"update"
}


$(function () {
    loadBookData();
    registerRegularComponent();

    //Kendo Window reference
    //初始化：Configuration
    //初始化後、在其他時間顛要控制 Kendo 物件：Methods、key data("kendoXXXX")
    //初始化時綁定 Kendo 的事件(Ex.當 Kendo Window 關閉時要做一些事情(Call function)：Events
    //https://www.telerik.com/kendo-jquery-ui/documentation/api/javascript/ui/window#configuration
    $("#book_detail_area").kendoWindow({
        width: "1200px",
        title: "新增書籍",
        visible: false,
        modal: true,
        actions: [
            "Close"
        ]
    }).data("kendoWindow").center();

    $("#book_record_area").kendoWindow({
        width: "700px",
        title: "借閱紀錄",
        visible: false,
        modal: true,
        actions: [
            "Close"
        ]
    }).data("kendoWindow").center();
    

    $("#btn_add_book").click(function (e) {
        e.preventDefault();
        state=stateOption.add;

        setStatusKeepRelation(state);
        // 確保類別下拉可以操作，並重置為未選擇狀態
        var classDdl = $("#book_class_d").data("kendoDropDownList");
        if(classDdl){
            classDdl.enable(true);
            classDdl.value("");
        }

        // 顯示預設圖片
        $("#book_image_d").attr("src", "image/optional.jpg");

        // 觸發 onChange 以更新圖片（如果需要）
        try{ onChange(); }catch(ex){ console.error(ex); }

        $("#btn-save").css("display","");
        $("#book_detail_area").data("kendoWindow").title("新增書籍");
        $("#book_detail_area").data("kendoWindow").open();
    });


    $("#btn_query").click(function (e) {
        e.preventDefault();
        queryBook();
    });

    $("#btn_clear").click(function (e) {
        e.preventDefault();

        clear();
        queryBook();
    });

    $("#btn-save").click(function (e) {
        e.preventDefault();
        
        //TODO : 存檔前請作必填的檢查
        //低效：使用 if else ==>alert 提示訊息檢查
        //優  : 使用 kendo validator 檢查

        var validator = $("#book_detail_area").kendoValidator().data("kendoValidator");

        if(validator.validate()){
            console.log("驗證成功");

            switch (state) {
                case "add":
                    addBook();
                    break;
                case "update":
                    updateBook(bookId=$("#book_id_d").val());
                    break;
                default:
                    alert("未知操作狀態")
                    break;
            }
        } 
        else {
            alert("每個欄位皆須填寫!")
        }
    });


            //case "add":
                //addBook();
                //break;
            //case "update":
                //updateBook(bookId=$("#book_id_d").val());
            //break;
            //default:
                //brea

    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    id:"BookId",
                    fields: {
                        BookId: { type: "int" },
                        BookClassName: { type: "string" },
                        BookName: { type: "string" },
                        BookBoughtDate: { type: "string" },
                        BookStatusName: { type: "string" },
                        BookKeeperCname: { type: "string" }
                    }
                }
            },
            pageSize: 20,
        },
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號", width: "10%" },
            { field: "BookClassName", title: "圖書類別", width: "15%" },
            { field: "BookName", title: "書名", width: "30%" ,
              template: "<a style='cursor:pointer; color:blue' onclick='showBookForDetail(event,#:BookId #)'>#: BookName #</a>"
            },
            { field: "BookBoughtDate", title: "購書日期", width: "15%" },
            { field: "BookStatusName", title: "借閱狀態", width: "15%" },
            { field: "BookKeeperCname", title: "借閱人", width: "15%" },
            { command: { text: "借閱紀錄", click: showBookLendRecord }, title: " ", width: "120px" },
            { command: { text: "修改", click: showBookForUpdate }, title: " ", width: "100px" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "100px" }
        ]

    });

    $("#book_record_grid").kendoGrid({
        dataSource: {
            data: [],
            schema: {
                model: {
                    fields: {
                        LendDate: { type: "string" },
                        BookKeeperId: { type: "string" },
                        BookKeeperEname: { type: "string" },
                        BookKeeperCname: { type: "string" }
                    }
                }
            },
            pageSize: 20,
        },
        height: 250,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "LendDate", title: "借閱日期", width: "10%" },
            { field: "BookKeeperId", title: "借閱人編號", width: "10%" },
            { field: "BookKeeperEname", title: "借閱人英文姓名", width: "15%" },
            { field: "BookKeeperCname", title: "借閱人中文姓名", width: "15%" },
        ]
    });

})

/**
 * 初始化 localStorage 資料
 * 將 data 內的 book-data.js..bookData；book-lend-record.js..lendData 寫入 localStorage 作為"資料庫"使用
 */
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
    }

    bookLendDataFromLocalStorage = JSON.parse(localStorage.getItem("lendData"));
    if (bookLendDataFromLocalStorage == null) {
        bookLendDataFromLocalStorage = lendData;
        localStorage.setItem("lendData", JSON.stringify(bookLendDataFromLocalStorage));
    }
}

function onChange() {
    //TODO : 請完成遺漏的邏輯

    // 取得使用者選擇的類別ID
    var selectedvalue = $("#book_class_d").data("kendoDropDownList").value();

    if(selectedvalue===""){
        console.log("no class selected");
        $("#book_image_d").attr("src", "image/optional.jpg"); // 若使用者未選擇類別，則顯示預設圖片
    }else{
       // 根據使用者選擇的類別ID，找出對應的類別物件
        var selectclass = classData.find(c => c.value == selectedvalue);
        console.log("selectclass= ", selectclass);

        // 根據類別物件取得對應的圖片路徑
        var imagePath = selectclass && selectclass.imagePath ? selectclass.imagePath:"image/optional.jpg"; // 先檢查selectclass是否存在，若存在，再檢查selectclass.imagePath是否存在，若都存在就回傳selectclass.imagePath的值，否則就回傳false
        console.log("imagePath= ", imagePath);

        // 確認img元素是否存在
        var $image = $("#book_image_d");
        if($image.length === 0){
            console.log("Image element not found!");
            return;
        }

        $("#book_image_d").attr("src", imagePath); // 更新圖片路徑
    }
}


/**
 * 新增書籍
 */
function addBook() { 

    //TODO：請完成新增書籍的相關功能
    var grid=$("#book_grid").data("kendoGrid");
    var book = {
        "BookId": 0,
        "BookName": $("#book_name_d").val(),
        "BookClassId": $("#book_class_d").data("kendoDropDownList").value(),
        "BookClassName": "",
        "BookBoughtDate": kendo.toString($("#book_bought_date_d").data("kendoDatePicker").value(),"yyyy-MM-dd"),
        "BookStatusId": "A",
        "BookStatusName": bookStatusData.find(m=>m.StatusId==defaultBookStatusId).StatusText,
        "BookKeeperId": "",
        "BookKeeperCname": "",
        "BookKeeperEname": "",
        "BookAuthor": $("#book_author_d").val() || "",
        "BookPublisher": $("#book_publisher_d").val() || "",
        "BookNote": $("#book_note_d").val() || ""
    }

    // 計算新的BookId
    if(bookDataFromLocalStorage.length > 0){
        newId = Math.max(...bookDataFromLocalStorage.map(b => b.BookId)) + 1; // 將陣列中每本書的BookId取出，並找出最大值，最後再加1
    }
    else{
        newId = 1; // 若目前沒有任何書籍，就將這本書的Id設為1
    }
    book.BookId = newId; // 更新BookId

    // 填入類別與狀態名稱
    var cls = (classData || []).find(c => c.value == book.BookClassId); // 若classData(使用者選擇的類別)存在，就用它，否則就用空陣列[]
    book.BookClassName = cls ? cls.text : ""; // 若找到了對應的類別(例如選擇了ID為2，對應的類別為"文學"，就取它的text，否則就設為空字串

    var st = (bookStatusData || []).find(s => s.StatusId == book.BookStatusId) // 在bookStatusData中找出對應的狀態
             ||(bookStatusData || []).find(s => s.StatusId == defaultBookStatusId); // 如果找不到，就用預設的狀態
    book.BookStatusName = st ? st.StatusText : ""; // 取出對應的狀態名稱，若找不到就設為空字串

    // 將新書同步到localstorage
    bookDataFromLocalStorage.push(book); // 將剛建立的book物件加入到陣列bookDataFromLocalStorage的末端
    localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));  // localstorage只能儲存字串，故須先使用JSON.stringify轉成字串，並以"bookData"作為key，存入瀏覽器儲存空間

    // 更新grid
    grid.dataSource.add(book); // 將新書加入Kendo Grid的資料來源

    //關閉 Window
    clear();
    $("#book_detail_area").data("kendoWindow").close();
 }

 /**
  * 更新書籍
  * @param {} bookId 
  */
function updateBook(bookId){
    
    //TODO：請完成更新書籍的相關功能
    var book=bookDataFromLocalStorage.find(m=>m.BookId==bookId);

    book.BookName=$("#book_name_d").val();
    book.BookClassId=$("#book_class_d").data("kendoDropDownList").value();
    book.BookClassName=classData.find(m=>m.value==book.BookClassId).text;
    book.BookBoughtDate=kendo.toString($("#book_bought_date_d").data("kendoDatePicker").value(),"yyyy-MM-dd");
    
    var bookStatusId=$("#book_status_d").data("kendoDropDownList").value();
    book.BookStatusId=bookStatusId;
    book.BookStatusName=bookStatusData.find(m=>m.StatusId==bookStatusId).StatusText;
    
    var bookKeeperId=$("#book_keeper_d").data("kendoDropDownList").value();
    var bookKeeperCname=bookKeeperId==""?"":memberData.find(m=>m.UserId==bookKeeperId).UserCname;
    var bookKeeperEname=bookKeeperId==""?"":memberData.find(m=>m.UserId==bookKeeperId).UserEname;

    book.BookKeeperId=bookKeeperId;
    book.BookKeeperCname=bookKeeperCname;
    book.BookKeeperEname=bookKeeperEname;

    book.BookAuthor=$("#book_author_d").val();
    book.BookPublisher=$("#book_publisher_d").val();
    book.BookNote=$("#book_note_d").val();

    // 同步回 localStorage
    localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));

    var grid=$("#book_grid").data("kendoGrid");
    grid.dataSource.pushUpdate(book);

    // 若狀態為已借出(B)或已借出未領(U)就寫借閱紀錄
    if(bookStatusId=="B" || bookStatusId=="U"){
        addBookLendRecord(bookId);
    }
    
    $("#book_detail_area").data("kendoWindow").close();

    clear();
 }

 /**新增借閱紀錄 */
 function addBookLendRecord(bookId) {  
     //TODO：請完成新增借閱紀錄相關功能
     var book = bookDataFromLocalStorage.find(m => m.BookId == bookId);
     var bookKeeperId = book.BookKeeperId;
     var bookKeeperData = memberData.find(m => m.UserId == bookKeeperId);
    
     var lendRecord = {
          "BookId": bookId,
          "LendDate": kendo.toString(new Date(), "yyyy-MM-dd"),
          "BookKeeperId": bookKeeperId,
          "BookKeeperEname": bookKeeperData.UserEname,
          "BookKeeperCname": bookKeeperData.UserCname,
          "ReturnDate": ""
     };
    
     bookLendDataFromLocalStorage.push(lendRecord);
     localStorage.setItem("lendData", JSON.stringify(bookLendDataFromLocalStorage));
 }

 /**
  * 查詢
  */
function queryBook(){
    
    var grid=getBooGrid();

    var bookClassId=$("#book_class_q").data("kendoDropDownList").value() ?? "";


    var filtersCondition=[];
    if(bookClassId!=""){
        filtersCondition.push({ field: "BookClassId", operator: "contains", value: bookClassId });
    }

    grid.dataSource.filter({
        logic: "and",
        filters:filtersCondition
    });
}

function deleteBook(e) {
    
    var grid = $("#book_grid").data("kendoGrid");    
    var row = grid.dataItem(e.target.closest("tr"));

    grid.dataSource.remove(row);    
    alert("刪除成功");

}


/**
 * 顯示圖書編輯畫面
 * @param {} e 
 */
function showBookForUpdate(e) {
    e.preventDefault();

    state=stateOption.update;
    $("#book_detail_area").data("kendoWindow").title("修改書籍");
    $("#btn-save").css("display","");

    // 確保欄位可編輯（若之前開過明細會被禁用）
    $("#book_name_d").prop("disabled", false);
    $("#book_class_d").data("kendoDropDownList").enable(true);
    $("#book_bought_date_d").data("kendoDatePicker").enable(true);
    $("#book_author_d").prop("disabled", false);
    $("#book_publisher_d").prop("disabled", false);
    $("#book_note_d").prop("disabled", false);
    $("#book_status_d").data("kendoDropDownList").enable(true);
    $("#book_keeper_d").data("kendoDropDownList").enable(true);

    var grid = getBooGrid();
    var bookId = grid.dataItem(e.target.closest("tr")).BookId;

    bindBook(bookId);
    
    setStatusKeepRelation();
    $("#book_detail_area").data("kendoWindow").open();
}

/**
 * 顯示圖書明細畫面
 * @param {} e 
 * @param {*} bookId 
 */
function showBookForDetail(e,bookId) {
    e.preventDefault();
    //TODO : 請補齊未完成的功能
    $("#book_detail_area").data("kendoWindow").title("書籍明細");

    // 唯讀模式：隱藏存檔，禁用輸入
    $("#btn-save").css("display", "none");

    bindBook(bookId);

    $("#book_name_d").prop("disabled", true);
    $("#book_class_d").data("kendoDropDownList").enable(false);
    $("#book_bought_date_d").data("kendoDatePicker").enable(false);
    $("#book_author_d").prop("disabled", true);
    $("#book_publisher_d").prop("disabled", true);
    $("#book_note_d").prop("disabled", true);
    $("#book_status_d").data("kendoDropDownList").enable(false);
    $("#book_keeper_d").data("kendoDropDownList").enable(false);

    $("#book_detail_area").data("kendoWindow").open();

}

/**
 * 繫結圖書資料
 * @param {*} bookId 
 */
function bindBook(bookId){
    var book = bookDataFromLocalStorage.find(m => m.BookId == bookId);
    $("#book_id_d").val(bookId);
    $("#book_name_d").val(book.BookName);
    $("#book_author_d").val(book.BookAuthor);
    $("#book_publisher_d").val(book.BookPublisher);
    //TODO : 完成尚未完成的程式碼
    // 補齊欄位綁定
    $("#book_class_d").data("kendoDropDownList").value(book.BookClassId);
    // 程式設定值後也觸發 onChange，讓圖片隨類別變更
    try{ onChange(); }catch(ex){ console.error(ex); }
    $("#book_bought_date_d").data("kendoDatePicker").value(new Date(book.BookBoughtDate));
    $("#book_status_d").data("kendoDropDownList").value(book.BookStatusId);
    $("#book_keeper_d").data("kendoDropDownList").value(book.BookKeeperId);
    $("#book_note_d").val(book.BookNote);
}
    //TODO : 請補齊未完成的功能
function showBookLendRecord(e) {

    var grid = getBooGrid();
    var dataItem=grid.dataItem(e.target.closest("tr"))
    // 根據書籍ID篩選出該書籍的所有借閱記錄
    var bookLendRecordData = bookLendDataFromLocalStorage.filter(m => m.BookId == dataItem.BookId);
    
    $("#book_record_grid").data("kendoGrid").dataSource.data(bookLendRecordData);
    $("#book_record_area").data("kendoWindow").title(dataItem.BookName).open();

}

/**
 * 清畫面
 * @param {*} area 
 */
function clear(area) {
    //TODO : 請補齊未完成的功能
    $("#book_name_q").val("");
    // 清空 Kendo DropDownList 的選擇
    $("#book_class_q").data("kendoDropDownList").value("");
    $("#book_keeper_q").data("kendoDropDownList").value("");
    $("#book_status_q").data("kendoDropDownList").value("");

    // 清空 Grid 的篩選條件，同步清空 Grid 內容
    getBooGrid().dataSource.filter({});
}

/**
 * 設定借閱狀態與借閱人關聯
 */
function setStatusKeepRelation() { 
    //TODO : 請補齊借閱人與借閱狀態相關邏輯
    switch (state) {
        case "add"://新增狀態
            $("#book_status_d_col").css("display","none");
            $("#book_keeper_d_col").css("display","none");
        
            $("#book_status_d").prop('required',false);
            $("#book_keeper_d").prop('required',false);            
            break;
        case "update"://修改狀態
            $("#book_status_d_col").css("display","");
            $("#book_keeper_d_col").css("display","");

            $("#book_status_d").prop('required',true);

            var bookStatusId=$("#book_status_d").data("kendoDropDownList").value();

            // 判斷借閱狀態：A-可以借出 或 U-已借出(未領) => 設為第一組 (必填, Enable)
            if(bookStatusId=="A" || bookStatusId=="U"){
                $("#book_keeper_d").prop('required',false);
                $("#book_keeper_d").data("kendoDropDownList").enable(false); // 禁用借閱人
                $("#book_keeper_d").data("kendoDropDownList").value("");
                var validator = $("#book_detail_area").data("kendoValidator");
                if(validator){
                    validator.validateInput($("#book_keeper_d"));
                }
            // 否則 (B-已借出 或 C-不可借出) => 必填，啟用 (BC一組)
            }else{ 
                $("#book_keeper_d").prop('required',true);
                $("#book_keeper_d").data("kendoDropDownList").enable(true); // 啟用借閱人
            }
            break;
        default:
            break;
    }
    
 }

 /**
  * 生成畫面所需的 Kendo 控制項
  */
function registerRegularComponent(){
    $("#book_class_q").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: classData,
        optionLabel: "請選擇",
        index: 0
    });

    $("#book_class_d").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: classData,
        optionLabel: "請選擇",
        index: 0,
        change: onChange
    });

    $("#book_keeper_q").kendoDropDownList({
        dataTextField: "UserCname",
        dataValueField: "UserId",
        dataSource: memberData,
        optionLabel: "請選擇",
        index: 0
    });

    $("#book_keeper_d").kendoDropDownList({
        dataTextField: "UserCname",
        dataValueField: "UserId",
        dataSource: memberData,
        optionLabel: "請選擇",
        index: 0
    });

    $("#book_status_q").kendoDropDownList({
        dataTextField: "StatusText",
        dataValueField: "StatusId",
        dataSource: bookStatusData,
        optionLabel: "請選擇",
        index: 0
    });

    $("#book_status_d").kendoDropDownList({
        dataTextField: "StatusText",
        dataValueField: "StatusId",
        dataSource: bookStatusData,
        optionLabel: "請選擇",
        change:setStatusKeepRelation,
        index: 0
    });


    $("#book_bought_date_d").kendoDatePicker({
        value: new Date()
    });
}

/**
 * 取得畫面上的 BookGrid
 * @returns 
 */
function getBooGrid(){
    return $("#book_grid").data("kendoGrid");
}