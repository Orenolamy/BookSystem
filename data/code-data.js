var classData = [
    { "text": "Banking", "value": "BK", "imagePath": "image/BK.jpg" },
    { "text": "Database", "value": "DB", "imagePath": "image/DB.jpg" },
    { "text": "Languages", "value": "LG", "imagePath": "image/LG.jpg" },
    { "text": "Laws And Rules", "value": "LR", "imagePath": "image/LR.jpg" },
    { "text": "Management", "value": "MG", "imagePath": "image/MG.jpg" },
    { "text": "Marketing", "value": "MK", "imagePath": "image/MK.jpg" },
    { "text": "Networking", "value": "NW", "imagePath": "image/NW.jpg" },
    { "text": "Operating System", "value": "OS", "imagePath": "image/OS.jpg" },
    { "text": "Security", "value": "SC", "imagePath": "image/SC.jpg" },
    { "text": "Software Engineering", "value": "SE", "imagePath": "image/SE.jpg" },
    { "text": "Others", "value": "OT", "imagePath": "image/OT.jpg" },
    { "text": "內部訓練課程光碟", "value": "TRCD", "imagePath": "image/TRCD.jpg" },
    { "text": "研討會/產品介紹光碟", "value": "SECD", "imagePath": "image/SECD.jpg" }];

var memberData = [
    { "UserId": "0010", "UserCname": "彭杰姆", "UserEname": "Jim" },
    { "UserId": "0011", "UserCname": "喻彼特", "UserEname": "Peter" },
    { "UserId": "0012", "UserCname": "藍伊恩", "UserEname": "Ian" },
    { "UserId": "0013", "UserCname": "林查理", "UserEname": "Charlie" },
    { "UserId": "0014", "UserCname": "陳凱爾文", "UserEname": "Kelven" },
    { "UserId": "0015", "UserCname": "黃莎拉", "UserEname": "Sarah" },
    { "UserId": "0016", "UserCname": "蔣蒂芬妮", "UserEname": "Tiffany" },
    { "UserId": "0017", "UserCname": "李安迪", "UserEname": "Andy" },
    { "UserId": "0018", "UserCname": "陳伊凡", "UserEname": "Ivan" },
    { "UserId": "0019", "UserCname": "曾雪倫", "UserEname": "Sharon" }
]


var bookStatusData = [
    { "StatusId": "A", "StatusText": "可以借出" },
    { "StatusId": "B", "StatusText": "已借出" },
    { "StatusId": "U", "StatusText": "不可借出" },
    { "StatusId": "C", "StatusText": "已借出(未領)" }
]

var defaultBookStatusId = "A"; // 預設書籍狀態為「可以借出」