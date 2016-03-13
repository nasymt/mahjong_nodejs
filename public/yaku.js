  var yaku_name=["平和","断ヤオ","イーペーコー","チャンタ","一気通貫","三色同順","三色同刻","トイトイ","三暗刻","三槓子","小三元","七対子","二盃口","ジュンチャン","ホンイツ","チンイツ","役満系"];
  var yaku_point=["一飜","二飜","三飜","四飜","五飜","六飜","七飜","八飜","九飜","十飜","十一飜","十二飜","十三飜以上"];
  var oya=0;

  
  function doCulc(n){
  	console.log(n+"役です");
  	console.log("上がった人:"+winner+"  上がられた人"+now_turn);
  	if(oya==winner&&winner!=now_turn){//親ロンあがり 
  		if(n==1)winner_point = 1500;
  		else if(n==2)winner_point = 3000;
  		else if(n==3)winner_point = 5800;
  		else if(n==4||n==5)winner_point = 12000;
  		else if(n==6||n==7)winner_point = 18000;
  		else if(n>=8&&n<11)winner_point = 24000;
  		else if(n==11||n==12)winner_point = 36000;
  		else if(n>=13)winner_point = 48000;
  		points[winner]+=winner_point;
  		points[now_turn]-=winner_point;
  	}else if(oya!=winner&&winner!=now_turn){//子ロンあがり
  		if(n==1)winner_point = 1000;
  		else if(n==2)winner_point = 2000;
  		else if(n==3)winner_point = 3900;
  		else if(n==4||n==5)winner_point = 8000;
  		else if(n==6||n==7)winner_point = 12000;
  		else if(n>=8&&n<11)winner_point = 16000;
  		else if(n==11||n==12)winner_point = 24000;
  		else if(n>=13)winner_point = 32000;
  		points[winner]+=winner_point;
  		points[now_turn]-=winner_point;
  	}else if(oya==winner && winner==now_turn){//親ツモあがり
  		if(n==1)winner_point = 500;
  		else if(n==2)winner_point = 1000;
  		else if(n==3)winner_point = 2000;
  		else if(n==4||n==5)winner_point = 4000;
  		else if(n==6||n==7)winner_point = 6000;
  		else if(n>=8&&n<11)winner_point = 8000;
  		else if(n==11||n==12)winner_point = 12000;
  		else if(n>=13)winner_point = 16000;
  		if(PLAYER_NUM==4)points[winner]+=winner_point*3;
  		else if(PLAYER_NUM==3)points[winner]+=winner_point*2;
  		for(var i=0;i<4;i++){
	  		if(winner!=i)points[i]-=winner_point;
  		}
  	}else if(oya!=winner&&winner==now_turn){//子ツモあがり
  		if(n==1){
  			winner_point = 500;
  			winner_point2 = 300;
  		}
  		else if(n==2){
  			winner_point = 1000;
  			winner_point2 = 500;
  		}
  		else if(n==3){
  			winner_point = 2000;
  			winner_point2 = 1000;
  		}
  		else if(n==4||n==5){
  			winner_point = 4000;
  			winner_point2 = 2000;
  		}
  		else if(n==6||n==7){
  			winner_point = 6000;
  			winner_point2 = 3000;
  		}
  		else if(n>=8&&n<11){
  			winner_point = 8000;
  			winner_point2 = 4000;
  		}
  		else if(n==11||n==12){
  			winner_point = 12000;
  			winner_point2 = 6000;
  		}
  		else if(n>=13){
  			winner_point = 16000;
  			winner_point2 = 8000;
  		}
  		if(PLAYER_NUM==3)points[winner]+=winner_point+winner_point2;
  		else if(PLAYER_NUM==4)points[winner]+=winner_point+winner_point2*2;
  		for(var i=0;i<4;i++){
	  		if( winner!=i && i != oya)points[i]-=winner_point2;
	  		if(i==oya)points[i]-=winner_point;
  		}
  	} 
  	console.log("得点:"+points[0]+":"+points[1]+":"+points[2]+":"+points[3]); 	
  	document.getElementById("game_end_monitor").innerHTML +="<p>東　"+temp_points[0]+"  →  "+points[0]+"</p>";
	document.getElementById("game_end_monitor").innerHTML +="<p>南　"+temp_points[1]+"  →  "+points[1]+"</p>";
	document.getElementById("game_end_monitor").innerHTML +="<p>西　"+temp_points[2]+"  →  "+points[2]+"</p>";
	if(PLAYER_NUM==4)document.getElementById("game_end_monitor").innerHTML +="<p>北　"+temp_points[3]+"  →  "+points[3]+"</p>";
  }
