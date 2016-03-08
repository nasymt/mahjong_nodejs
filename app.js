var express = require('express'),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http);
var fs =require('fs');


app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.use(express.static('public'));


var playerId=new Array(4);
var playerId_index;
var playerNum=0;
var bPass = false;
var ton_tehai = new Array(14),
  nan_tehai = new Array(14),
  sha_tehai = new Array(14),
  pei_tehai = new Array(14),
  ton_sutehai = new Array(30),
  nan_sutehai = new Array(30),
  sha_sutehai = new Array(30),
  pei_sutehai = new Array(30),
  ton_trash_index,nan_trash_index,sha_trash_index,pei_trash_index;
  
  var used_index = 0;
  var all_pai = [];
  var now_turn = 0;
  var PLAYER_NUM = 0;
  var pass_count = 0;
  var pai_left = 70;
  var dora;
  var temp_sutehai;
  var bakaze_name = ["ton","nan","sha","pei","stage"];
io.on('connection', function(socket){
//-------------------セットアップ--------------
  socket.on('setup',function(data){
  	socket.join(data.room);
	playerId[playerId_index] = socket.id;
	if(playerId_index<4)playerId_index++;
	//console.log(playerId[playerId_index]);
  	if(data.room!="stage")playerNum++;
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
	io.sockets.emit('notice_bakaze', playerNum);
  	console.log("あなたは"+baName+"です。参加人数:"+playerNum+"人");
  }); 
  //--------------配牌-----------------------
  socket.on('haipai',function(data){
  	if(data == 0)PLAYER_NUM=3;
  	else PLAYER_NUM=4;
  	for (var i=0; i<136;i++){
  		all_pai[i] = i;
  	}
  	var n = all_pai.length;
  	for(var i = (n-1) ; i >= 0;i--){
  		var r = Math.floor(Math.random() * (i+1));
  		var tmp = all_pai[i];
  		all_pai[i] = all_pai[r];
  		all_pai[r] = tmp;
  	}
  	for(var i=0;i<13;i++){
  		ton_tehai[i]=all_pai[i];
  		nan_tehai[i]=all_pai[i+13];
  		sha_tehai[i]=all_pai[i+26];
  		if(data==1){
  			pei_tehai[i] = all_pai[i+39];
  		}
  	}
  	if(data==0)used_index = 39;
  	else if(data==1)used_index = 52;
  	
  	dora = all_pai[135];
  	socket.emit('stage_set',dora);
//  	socket.to("stage").emit('stage_set',4);
  	
  	
  	socket.to("ton").emit("tehai",{
  		"tehai1" : ton_tehai[0],"tehai2" : ton_tehai[1],tehai3 : ton_tehai[2],tehai4 : ton_tehai[3],tehai5 : ton_tehai[4],tehai6 : ton_tehai[5],tehai7 : ton_tehai[6],
  		tehai8 : ton_tehai[7],tehai9 : ton_tehai[8],tehai10 : ton_tehai[9],tehai11 : ton_tehai[10],tehai12 : ton_tehai[11],tehai13 : ton_tehai[12],
  	});
  	socket.to("nan").emit("tehai",{
  		tehai1 : nan_tehai[0],
  		tehai2 : nan_tehai[1],
  		tehai3 : nan_tehai[2],
  		tehai4 : nan_tehai[3],
  		tehai5 : nan_tehai[4],
  		tehai6 : nan_tehai[5],
  		tehai7 : nan_tehai[6],
  		tehai8 : nan_tehai[7],
  		tehai9 : nan_tehai[8],
  		tehai10 : nan_tehai[9],
  		tehai11 : nan_tehai[10],
  		tehai12 : nan_tehai[11],
  		tehai13 : nan_tehai[12],
  	});
  	socket.to("sha").emit("tehai",{
  		tehai1 : sha_tehai[0],
  		tehai2 : sha_tehai[1],
  		tehai3 : sha_tehai[2],
  		tehai4 : sha_tehai[3],
  		tehai5 : sha_tehai[4],
  		tehai6 : sha_tehai[5],
  		tehai7 : sha_tehai[6],
  		tehai8 : sha_tehai[7],
  		tehai9 : sha_tehai[8],
  		tehai10 : sha_tehai[9],
  		tehai11 : sha_tehai[10],
  		tehai12 : sha_tehai[11],
  		tehai13 : sha_tehai[12],
  	});
  	socket.to("pei").emit("tehai",{
  		tehai1 : pei_tehai[0],
  		tehai2 : pei_tehai[1],
  		tehai3 : pei_tehai[2],
  		tehai4 : pei_tehai[3],
  		tehai5 : pei_tehai[4],
  		tehai6 : pei_tehai[5],
  		tehai7 : pei_tehai[6],
  		tehai8 : pei_tehai[7],
  		tehai9 : pei_tehai[8],
  		tehai10 : pei_tehai[9],
  		tehai11 : pei_tehai[10],
  		tehai12 : pei_tehai[11],
  		tehai13 : pei_tehai[12],
  	});
  });  
  //--------------ツモ-----------------------
  socket.on('start' , function(data){
  	tsumo(data,5);
  });
  function tsumo(data,last_pass){
//  	var char = ["ton","nan","sha","pei"];
  	var turn_end_index = data-1;
  	if(turn_end_index <0) turn_end_index=PLAYER_NUM-1;
  	used_index++;
  	socket.to(bakaze_name[turn_end_index]).json.emit('turn_end',0);
  	for(var i=0;i<PLAYER_NUM;i++){
  		socket.to(i).emit('now_turn',data);
  	}
  	if(data==last_pass)socket.emit('tsumo' , all_pai[used_index]);
  	else socket.to(bakaze_name[data]).json.emit('tsumo' , all_pai[used_index]);
  	pai_left--;
  	socket.to("stage").emit('stage_update',pai_left);
  }
 //--------------捨て牌処理---------------------
  socket.on('sutehai',function(data){
  	temp_sutehai = data;
  	var pre_turn;
  	if(now_turn!=PLAYER_NUM-1)pre_turn = now_turn + 1;
  	else pre_turn = 0;
	sutehaiFunc(now_turn,data);

  	bPass = true;
  	socket.broadcast.emit('canPass',1);
  	socket.broadcast.emit('canPon',1);
  	socket.to(bakaze_name[pre_turn]).broadcast.emit('canChi' ,1);
  });
  //-----------パス時の処理--------------------
  socket.on('pass',function(data){
  	if(bPass){
  		if(pass_count<PLAYER_NUM-2){
  			pass_count++;
  		}else{
  			if(now_turn<PLAYER_NUM-1)now_turn++;
  			else now_turn=0;
  			bPass=false;
  			pass_count=0;
  			console.log("NEXT TSUMO:"+now_turn+" last Pass:"+data);	
  			tsumo(now_turn,data);
  		}
  	}
  });
  //-------------チー------------------------
  socket.on('chi' , function(data){
  	socket.emit('get_sutehai', temp_sutehai );
  	sutehaiFunc(now_turn , 0);
  });
  function sutehaiFunc(_now_turn,_pi){
  	var bChipon=false;
  	if(_pi==0)bChipon=true;
  	switch(_now_turn){
  		case 0:
  			ton_sutehai[ton_trash_index] = _pi;
  			ton_trash_index++;
  			break;
  		case 1:
  			nan_sutehai[nan_trash_index] = _pi;
  			nan_trash_index++;
  			break;
  		case 2:
  			sha_sutehai[sha_trash_index] = _pi;
  			sha_trash_index++;
  			break;
  		case 3:
  			pei_sutehai[pei_trash_index] = _pi;
  			pei_trash_index++;
  			break;
  	}
  	socket.to("stage").emit('sutehai',{
  		index: _pi,
  		player : _now_turn,
  		chipon: bChipon
  	});
  }
});



//http.listen(process.env.PORT||3000 , function(){
http.listen(3000 , function(){
  console.log('listening on *:3000');
});