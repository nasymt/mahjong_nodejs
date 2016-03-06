/*var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);*/
var express = require('express'),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http);


app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  
  var playerNum=0;
  socket.on('setup',function(data){
  	socket.join(data.room);
  	playerNum++;
  	var baName;
  	switch(data.room){
  		case "ton":
  			baName="東";
  			break;
  		case "nan":
  			baName="南";
  			break;
  		case "sha":
  			baName="西";
  			break;
  		case "pei":
  			baName="北";
  			break;
  		case "stage":
  			baName="ステージ";
  			break;
  	}
//  	socket.emit('notice_bakaze',"あなたは"+baName+"です。");
	io.sockets.emit('notice_bakaze', playerNum);
  	console.log("あなたは"+baName+"です。参加人数:"+playerNum+"人");
  });
  socket.on('haipai',function(data){
  	if(data==1){//配牌を行う
  		console.log("配牌完了！");
  	}
  });
  
});

//http.listen(process.env.PORT||3000 , function(){
http.listen(3000 , function(){
  console.log('listening on *:3000');
});