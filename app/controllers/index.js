//var express = require('express');
var Note = require('../models/note');
var User = require('../models/user');
var HolidayType = require('../models/holidayType');
var Role = require('../models/role');

var moment = require('moment');

/* GET home page. */
exports.index = function(req, res, next) {
  res.render('index', { title: 'index' });
};


// HolidayType Holiday And User Info
exports.holandUser = function(req, res, next){
  console.log("coold");
  //var userId = req.body.userID;
  userId = '584aab9f23ac5520a7cf0947';

    //通过user的ObjectId， 拿到对应的用户信息以及各类假期剩余天数就好了
    //1. 拿到所有的假期类型
    /**
    //2 拿到一个时间段内员工某个假期类型请假的天数
    *  a. 查询当下时间到今年的1月1号该类行假期请假的天数
    *  b. 根据该类型假期的总时长得到剩余时长
    */
  console.log(userId);
  if(userId){
    User
      .find({_id: userId})
      .populate({
        path:'userRole'
        //select: 'roleName Poster'
      })
      .exec(function(err, userRes){
          if(err){
            console.log(err);
          }
          console.log(userRes + "\n" + userRes[0].userRole.roleName);

          var _now = moment();
          var now = new Date();
          var year = _now.get('year');
          //console.log("year = "+ year + "; year =" + now);
          var timeLength = 0;
          //根据用户ID , 假期类型ID , 时间参数查询假期剩余天数

          /**
           * 1) 根据用户ID, 假期ID , 当前时间，以及默认的这一年的开始时间，
           *   查询一下内容： 这段时间内高用户该种假期的所有记录时间总和
          */
          Note
            .find({'user': userRes[0]._id})
            .gte('startTime',year)
            .lte('startTime',now)
            .exec(function(err, notes){
              if(err){
                console.log(err);
              }else{
                HolidayType
                    .find()
                    .exec(function(err, holidayTypes){
                        if(err){
                          console.log(err);
                        }
                        var holidays = {};
                        var holLength = holidayTypes.length;
                        var notesLength = notes.length;
                        for(var i=0; i<holLength; i++){
                          var holiday = {name: null, length:0};
                          holiday.name = holidayTypes[i].holidayName;
                          holiday.length = 0;
                          for(var j=0; j<notesLength; j++){
                            //判等处理
                            if(notes[j].holidayType.equals(holidayTypes[i]._id)){
                                holiday.length += notes[j].timeLength;
                                // console.log("啊哈？？"+ holiday.length + ":"+notes[j].timeLength);
                            }
                            holidays[i] = holiday;

                            // console.log(notes[j].holidayType +"==" + holidayTypes[i]._id);
                            // console.log(notes[j].holidayType.equals(holidayTypes[i]._id));
                          }

                        }
                        //console.log(holidays);
                        res.send(holidays);
                        //返回信息
                        // res.render('',{
                        //   'title' : '假期申请页',
                        //    user: user,
                        //    holidays: holidays
                        // });
                    });
              }
            });
      });
  }
};
