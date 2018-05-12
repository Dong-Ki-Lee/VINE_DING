/*
작성자 : DongKi Lee
수정일 : 2018-05-13
기능 : 
1. 메인페이지 출력
change log : 
2018-05-13 : 설명 추가
need to change :
1. 파일명의 변경이 필요함.
*/

var express = require('express');
var router = express.Router();

//메인페이지 호출
router.get('/', function(req, res, next) {
  res.render('inde2.html');
});

module.exports = router;
