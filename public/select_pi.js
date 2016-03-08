var pre_select =0;
function selectPi(pi,sute){
	if(pre_select!=pi)pre_select = pi;
	else {
		if(bTrash){
			socket.emit('sutehai',sute);
			myTehai.splice(pi-1,1);		
			myTehai = sortPi(myTehai);
			for(var i=0;i<13;i++){
				var temp = createPiAddr(myTehai[i]);
				var pai_img = temp.addr;
				myTehai_type[i] = temp.type;
				var tmp = i+1;
  				document.getElementById("tehai_img"+tmp).innerHTML = "<img src=\"./img/"+pai_img+"\" onClick=\"selectPi("+tmp+");\">";
			}
			document.getElementById("tehai_img14").innerHTML = "";
			console.log("牌を捨てました:"+pi);
			bTrash=false;
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
//  		'background-color':'#FF0',
  		'border':'2px solid #F00'
  	});
}

  function createPiAddr(num){
 	var pai_img = {
 		addr: "man1-66-90-l.png",
 		type: "1"
 	}
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
  	return n;
  }
  
