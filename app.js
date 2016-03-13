var express = require('express'),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http);
var fs =require('fs');

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.use(express.static('public'));

//--------------変数--------------------------
//var playerNum=0;
var bPass = false;
var ton_tehai = new Array(14),
  nan_tehai = new Array(14),
  sha_tehai = new Array(14),
  pei_tehai = new Array(14),
  points = new Array(4);
  bReach = new Array(4);
  
  var used_index = 0;
  var all_pai = [];
  var now_turn = 0;
  var PLAYER_NUM = 0;
  var pass_count = 0;
  var pai_left = 70;
  var dora;
  var temp_sutehai;
  var baName = ["ton","nan","sha","pei","stage"];
  var baName_jp = ["東","南","西","北","ステージ"];
  var bSelectPair=false;
  var your_kaze = new Array(4);
  var sutehai = new Array(4);
  var sutehai_index = new Array(4);
  var bRyukyoku =false;
  var bOyaren = false;
  var oya = 0;
io.on('connection', function(socket){
//-------------------セットアップ--------------
  socket.on('setup',function(data){
  	socket.join(data.room);
  	if(data.room!="stage")PLAYER_NUM++;
  	for(var i=0;i<baName.length;i++){
  		if(data.room == baName[i]){
  			your_kaze[i] = i;
  		}
  	}  	
	for(var i=0;i<4;i++){
		points[i] = 25000;
	}
	io.sockets.emit('notice_bakaze', PLAYER_NUM);
  	console.log("あなたは"+baName_jp[your_kaze]+"です。参加人数:"+PLAYER_NUM+"人:now_turn"+now_turn);

  	if(data.room=="stage")prepGame();
  }); 
  function prepGame(){
  	used_index=0;
  	now_turn=0;
  	pass_count=0;
  	if(PLAYER_NUM==3)pai_left = 70;
  	else if(PLAYER_NUM==4)pai_left = 57;
  	for(var i=0;i<sutehai.length;i++){
  		sutehai[i] = new Array(30);
  		sutehai_index[i]=0;
  		bReach[i] = false;
  		for(var j=0;j<30;j++){
  			sutehai[i][j] = 0;
  		}
  	}
   }
  //--------------配牌-----------------------
  socket.on('haipai',function(data){
  	console.log("配牌完了");
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
  	socket.emit('stage_set',{
  		dora : dora,
  		left : pai_left-1
  	}); 	  	
  	socket.to("ton").emit("tehai",{
  		"tehai1" : ton_tehai[0],"tehai2" : ton_tehai[1],tehai3 : ton_tehai[2],tehai4 : ton_tehai[3],tehai5 : ton_tehai[4],tehai6 : ton_tehai[5],tehai7 : ton_tehai[6],
  		tehai8 : ton_tehai[7],tehai9 : ton_tehai[8],tehai10 : ton_tehai[9],tehai11 : ton_tehai[10],tehai12 : ton_tehai[11],tehai13 : ton_tehai[12],
  	});
  	socket.to("nan").emit("tehai",{
  		tehai1 : nan_tehai[0],tehai2 : nan_tehai[1],tehai3 : nan_tehai[2],tehai4 : nan_tehai[3],tehai5 : nan_tehai[4],tehai6 : nan_tehai[5],tehai7 : nan_tehai[6],tehai8 : nan_tehai[7],tehai9 : nan_tehai[8],tehai10 : nan_tehai[9],tehai11 : nan_tehai[10],tehai12 : nan_tehai[11],tehai13 : nan_tehai[12],
  	});
  	socket.to("sha").emit("tehai",{
  		tehai1 : sha_tehai[0],tehai2 : sha_tehai[1],tehai3 : sha_tehai[2],tehai4 : sha_tehai[3],tehai5 : sha_tehai[4],tehai6 : sha_tehai[5],tehai7 : sha_tehai[6],tehai8 : sha_tehai[7],tehai9 : sha_tehai[8],tehai10 : sha_tehai[9],tehai11 : sha_tehai[10],tehai12 : sha_tehai[11],tehai13 : sha_tehai[12],
  	});
  	socket.to("pei").emit("tehai",{
  		tehai1 : pei_tehai[0],tehai2 : pei_tehai[1],tehai3 : pei_tehai[2],tehai4 : pei_tehai[3],tehai5 : pei_tehai[4],tehai6 : pei_tehai[5],tehai7 : pei_tehai[6],tehai8 : pei_tehai[7],tehai9 : pei_tehai[8],tehai10 : pei_tehai[9],tehai11 : pei_tehai[10],
  		tehai12 : pei_tehai[11],
  		tehai13 : pei_tehai[12],
  	});
  });  
  //--------------ツモ-----------------------
  socket.on('start' , function(data){
  	tsumo(data,5);
  	now_turn = data;
  });
  function tsumo(data,last_pass){
  	console.log("now"+now_turn+"ツモ牌"+all_pai[used_index]);
  	var turn_end_index = data-1;
  	if(turn_end_index <0) turn_end_index=PLAYER_NUM-1;
  	if(used_index<122)used_index++;
  	else {
  		bRyukyoku = true;
  		io.sockets.emit('ryukyoku' , 0);
  	}
  	socket.to(baName[turn_end_index]).json.emit('turn_end',0);
  	io.sockets.emit('now_turn',data);

  	if(data==last_pass)socket.emit('tsumo' , all_pai[used_index]);
  	else socket.to(baName[data]).json.emit('tsumo' , all_pai[used_index]);
  	pai_left--;
  	socket.to("stage").emit('stage_update',pai_left);
  	socket.to(baName[now_turn]).emit('canAction' , 3);
  	if(!bReach[now_turn])socket.to(baName[now_turn]).emit('canAction' , 5);
  } 
 //--------------捨て牌処理---------------------
  socket.on('sutehai',function(data){
  	temp_sutehai = data;
  	var pre_turn;
  	if(now_turn!=PLAYER_NUM-1)pre_turn = now_turn + 1;
  	else pre_turn = 0;
	sutehaiFunc(now_turn,data);
	console.log("sutehai:"+data);
  	bPass = true;
  	socket.broadcast.emit('canAction', 2);
  	socket.broadcast.emit('canAction', 3);
  	socket.broadcast.emit('canAction', 4);
  	socket.broadcast.emit('banAction', 5);
  	socket.to(baName[pre_turn]).broadcast.emit('canAction' ,0);
  	socket.broadcast.emit('sutehai_data',data);
  });
    function sutehaiFunc(_now_turn,_pi){
  	console.log("now:"+_now_turn);  	
  	sutehai[_now_turn][sutehai_index[_now_turn]] = _pi;
  	sutehai_index[_now_turn]++;
  	
  	for(var i=0;i<sutehai_index[_now_turn];i++){
  		console.log("捨て牌リスト:"+i+":"+_now_turn+":"+sutehai[_now_turn][i]);
  	}
  	
  	socket.to("stage").emit('sutehai',{
  		index: _pi,
  		player : _now_turn,
  	});
  }
  //-----------パス時の処理--------------------
  socket.on('pass',function(data){
  	//console.log("now_turn:"+now_turn);
  	if(bPass){
  		if(pass_count<PLAYER_NUM-2){
  			pass_count++;
  		}else{
  			if(now_turn<PLAYER_NUM-1)now_turn++;
  			else now_turn=0;
  			bPass=false;
  			pass_count=0;
  			console.log("NEXT TSUMO:"+now_turn+" last Pass:"+data);
  			io.sockets.emit('banAction',5);
  			tsumo(now_turn,data);
  		}
  	}
  });
  //-------------チー------------------------
  socket.on('chi' , function(data){
  	socket.emit('get_sutehai', temp_sutehai );
  	pass_count=0;//--------------これ他にも適用させること。
 	var temp = sutehai[data.kaze][sutehai_index[data.kaze]-1];
 	sutehai[data.kaze].splice(sutehai_index[data.kaze]-1,1);

	naki(sutehai[data.kaze] , temp , data.pi1 , data.pi2 , sutehai_index[data.kaze] , data.naki_player);
  });
  //-----------------ポン-------------------------
  socket.on('pon',function(data){
  	console.log("now_kaze : "+data.kaze);
  	if(data.naki_player==0)ton_tehai = data.tehai;
  	else if(data.naki_player==1)nan_tehai = data.tehai;
  	else if(data.naki_player==2)sha_tehai = data.tehai;
  	else if(data.naki_player==3)pei_tehai = data.tehai;
  	
  	var temp = sutehai[data.kaze][sutehai_index[data.kaze]-1];
	sutehai[data.kaze].splice(sutehai_index[data.kaze]-1,1);
	sutehai_index[data.kaze]--;	
	for(var i=0;i<sutehai_index[data.kaze];i++){
		console.log("sutehai list:"+i+":"+sutehai[data.kaze][i]);
	}
	//console.log("pon:"+temp+":"+data.pi1+":"+data.pi2);
  	
  	naki(sutehai[data.kaze] , temp , data.pi1 , data.pi2 , sutehai_index[data.kaze] , data.naki_player);
  });
  //--------------------鳴き処理------------------------------
  function naki( _pi , _getPi , _selected_pi1 , _selected_pi2 , _index , _player ){
  	socket.to("stage").emit('naki',{
		pi : _pi,//鳴かれた人の捨て牌リスト
		get_pi : _getPi,//鳴いた牌
		selected_pi1 : _selected_pi1,
		selected_pi2 : _selected_pi2,
		index : _index,//鳴かれた人の捨て牌リストのindex
		player : _player//鳴いた人
	});
	socket.to(baName[now_turn]).emit('banAction',5);
	socket.to(baName[now_turn]).emit('turn_end',1);
	now_turn = _player;
	socket.emit('your_turn',1);
  }
  
  socket.on('clearClientNotice',function(data){
	socket.to(baName[data]).emit('clearClientNotice',0);
  });
  //----------------ロン-------------------------
 socket.on('ron',function(data){
 	var isReach = false;
 	for(var i=0;i<PLAYER_NUM;i++){
 		if(your_kaze[i]==0)oya=i;
 	}
 	if(data.kaze!=oya){
 		for(var i=0;i<4;i++){
 			your_kaze[i]++;
 			if(your_kaze[i]>PLAYER_NUM-1)your_kaze[i]=0;
 		}
 		oya++;
 		if(oya>PLAYER_NUM-1)oya=0;
 	}
 	console.log("風"+your_kaze[0]+":"+your_kaze[1]);
 	if(bReach[data.kaze])isReach=true;
 	io.sockets.emit('game_end',{
 		kaze : data.kaze,
 		tehai : data.tehai,
 		now_points : data.now_points,
 		ron_pi : temp_sutehai,
 		reach : isReach,
 		dora : all_pai[135],
 		uraDora : all_pai[134],
 		ton : your_kaze[0],
 		nan : your_kaze[1],
 		sha : your_kaze[2],
 		pei : your_kaze[3],
 		new_oya : oya
 	});
  	console.log("gameend ron:  リーチは"+bReach[data.kaze]);
 });
 
  socket.on('reach',function(data){
  	if(!bReach[data])bReach[data]=true;
  	socket.to("stage").emit('reach' , data);
  });
 
 //---------------次の対局-----------------------
 socket.on('next_game' , function(data){
 	io.sockets.emit('resetClient',0);
/* 	if(bOyaren){
 		bOyaren = false;
 	}else {
 		for(var i=0;i<4;i++){
 			your_kaze[i]--;
 			if(your_kaze[i]<0)your_kaze[i]=PLAYER_NUM-1;
 		}
 	}*/
/* 	socket.emit('field_kaze' , {
 		ton : your_kaze[0],
 		nan : your_kaze[1],
 		sha : your_kaze[2],
 		pei : your_kaze[3]
 	});*/
 	prepGame();
 });
  socket.on('now_turn',function(data){
  	now_turn = data;
  });

});

//http.listen(process.env.PORT||3000 , function(){
http.listen(3000 , function(){
  console.log('listening on *:3000');
});