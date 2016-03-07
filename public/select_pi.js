var pre_select =0;

$('#tehai_img1').click(function(e){
  	e.preventDefault();
  	selectPi(1);
  	if(pre_select!=1)pre_select = 1;
  	else {
  		socket.emit('sutehai' , 0);
  	}
  	console.log("okokok");
  });
$('#test1').click(function(e){
  	e.preventDefault();
  	selectPi(1);
  	if(pre_select!=1)pre_select = 1;
  	else {
  		socket.emit('sutehai' , 0);
  	}
  	console.log("okokok");
  });
    
  
  $('#tehai_img2').click(function(e){
  	e.preventDefault();
  	selectPi(2);
  	pre_select = 2;
  });
  $('#tehai_img3').click(function(e){
  	e.preventDefault();
  	selectPi(3);
  	pre_select = 3;
  });
  $('#tehai_img4').click(function(e){
  	e.preventDefault();
  	selectPi(4);
  	pre_select = 4;
  });
  $('#tehai_img5').click(function(e){
  	e.preventDefault();
  	selectPi(5);
  	pre_select = 5;
  });
$('#tehai_img6').click(function(e){
	e.preventDefault();
	selectPi(6);
  	pre_select = 6;
});
$('#tehai_img7').click(function(e){
	e.preventDefault();
	selectPi(7);
  	pre_select = 7;
});
$('#tehai_img8').click(function(e){
	e.preventDefault();
	selectPi(8);
  	pre_select = 8;
});
$('#tehai_img9').click(function(e){
	e.preventDefault();
	selectPi(9);
  	pre_select = 9;
});
$('#tehai_img10').click(function(e){
	e.preventDefault();
	selectPi(10);
  	pre_select = 10;
});
$('#tehai_img11').click(function(e){
	e.preventDefault();
	selectPi(11);
  	pre_select = 11;
});
$('#tehai_img12').click(function(e){
	e.preventDefault();
	selectPi(12);
  	pre_select = 12;
});
$('#tehai_img13').click(function(e){
	e.preventDefault();
	selectPi(13);
  	pre_select = 13;
});
$('#tehai_img14').click(function(e){
	e.preventDefault();
	selectPi(14);
  	pre_select = 14;
});

function selectPi(pi){
	if(pre_select!=pi)pre_select = pi;
	else {
		console.log("牌を捨てました:"+pi);
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
  
  function replaceHTML(){
  	console.log("change!!!!!!");
  }