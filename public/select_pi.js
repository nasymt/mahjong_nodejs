var pre_select =0;
var pair_pi = new Array(2);
var tehai_length=0;

function selectPi(pi){
	console.log(pi+":"+reach_flag+"   selectPi");
	if(pre_select!=pi)pre_select = pi;
	else {
		if(bTrash){
			if(reach_flag<2||(reach_flag==2&&pi==14)){
				socket.emit('sutehai',myTehai[pi-1]);
				myTehai.splice(pi-1,1);		
				myTehai = sortPi(myTehai);
				document.getElementById("tehai_img14").innerHTML = "";
				console.log("牌を捨てました:"+pi+":"+reach_flag);
				bTrash=false;
				if(reach_flag==1){
					socket.emit('reach' , your_kaze);
					document.getElementById("aReach").play();
				}else {
					document.getElementById("aSute").play();
				}
				banAction(5);
			}
		}else if(bSelectPair){
			if(nSelectPair==0){
				pair_pi[0]=myTehai[pi-1];
				nSelectPair++;
				console.log("1st selected"+pair_pi[0]);
				myTehai[pi-1]=0;
			}
			else if(nSelectPair == 1&& (pi != pair_pi[0])){
				pair_pi[1] = myTehai[pi-1];
				//console.log("chi now_turn:"+now_turn+":"+your_kaze);
				socket.emit('chi',{
					kaze:now_turn,
					pi1:pair_pi[0],//サーバー経由で選んだ牌をステージに送る
					pi2:pair_pi[1],
					naki_player:your_kaze
				});
				nSelectPair=0;
				bSelectPair=false;
				console.log("2nd selected"+pair_pi[1]);
				myTehai[pi-1]=0;
				myTehai = sortPi(myTehai);
				bTrash = true;
				document.getElementById("aChi").play();
			}
		}
	}
	var c = '#tehai_img' + pi ;
	for(var i=1;i<=14;i++){
		var temp = '#tehai_img' + i;
		$(temp).css({
			'border-style':'none'
		});
	}
	$(c).css({
  		'border':'3px solid #FF0'
  	});
}

  function createPiAddr(num){
 	var pai_img = {
 		addr: "aka1-66-90-l.png",
 		type: "1",
 		id:"1"
 	}
 	pai_img.id = Math.floor(num/4)+1;
 	if(num>=0&&num<36){//マンズ
 		pai_img.type = Math.floor((num/4))+1;
  		pai_img.addr = "man" + pai_img.type + "-66-90-l.png";
  	}else if(num>=36&&num<72){//ピンズ
  		pai_img.type = Math.floor((num-36)/4)+1;
  		pai_img.addr = "pin" + pai_img.type + "-66-90-l.png";
  	}else if(num>=72&&num<108){//ソーズ
  		pai_img.type = Math.floor((num-72)/4)+1;
  		pai_img.addr = "sou" + pai_img.type + "-66-90-l.png";
  	}else if(num>=108&&num<136){//字牌
  		pai_img.type = Math.floor((num-108)/4)+1;
  		pai_img.addr = "ji" + pai_img.type + "-66-90-l.png";
  	}
  	return pai_img;
  }
  
  function sortPi(n){	
  	for(var i=0;i<12;i++){
  		for(var j=12 ; j>i ; j--){
  			var temp;
  			if(n[j-1]>n[j]){
  				temp = n[j];
  				n[j] = n[j-1];
  				n[j-1] = temp;
  			}
  		}
  	}
  	var index = 0;
  	var count=0;
  	var zero_count=0;
  	for(var i=0;i<13;i++){
  		if(n[i]==0||n[i]==null)count++;
  		if(n[i]==0)zero_count++;
  		$('#tehai_img'+(i+1)).empty();
  	}
  	tehai_length=13-count;
  	if(zero_count!=0)n.splice(0,zero_count);
  	console.log("手牌は"+(13-count)+"枚です。");
  	for(var i=0;i<13-count;i++){
  		var temp = createPiAddr(n[i]);
		var pai_img = temp.addr;
		myTehai_type[i] = temp.type;
		var tmp = i+1;
  		document.getElementById("tehai_img"+tmp).innerHTML = "<img src=\"./img/"+pai_img+"\" onClick=\"selectPi("+tmp+");\">";
  	}
  	return n;
  }
  
