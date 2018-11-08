var v = {
	_w: 360,
	_h: 240,

	_y: 154,	// 牌的坐标
	_x: 6,		// 牌的边距

	_s: 90,		// 牌的大小
	_gap: 2.5,  // 牌的间隔

	canvas: {},
	poker_list: {
		list : [], 	//所剩
		out: [], 	// 打出的
		select :[]	// 选中的
	},

	img: {},

	ov: '',

	init : function (canvas, ov) {
		var that = this;
		this._w = canvas.canvas.offsetWidth;
		this._h = canvas.canvas.offsetHeight;
		this._s = this._h/4;
		this._y = this._h - this._s - this._x;

		this.canvas = canvas;
		this.poker_list = ov.p.poker_list;
		this.img = res.img;
		this.ov = ov;

		// // 载入图片资源 
		// var img = {cp: 'cp.png', bc: 'bc.png'};
		// var j = 0;
		// var l = Object.keys(img).length;
		// for ( i in img ) {
		// 	this.img[i] = {dom: {}, x: 0, y: 0};
		// 	this.img[i].dom = new Image();

 	// 		this.img[i].dom.onload = function(){
 	// 			j++;
 	// 			if ( j == l ) {
 	// 				that.show();
 	// 			}
 	// 		};

 	// 		this.img[i].dom.src = img[i];
		// }

		this.show();
	},

	show : function(){
		// 显示牌，及其他人的牌
		this.reshow();

		var that = this;
		// 监听点击
		this.canvas.canvas.addEventListener('click', function(e){
			var x = e.layerX;
			var y = e.layerY;

			if ( y >= that._y ) {
				var i = -1;

				// 点牌区域
				if ( that.poker_list.list.length == 1 && (x - that._x) <= that._s/2 ) {
					i = 0;
				} else {
					var i = (x - that._x )/that._gap;
					i = Math.ceil(i) - 1;

					if ( that.poker_list.list.length < i && 
						that.poker_list.list.length >=  Math.ceil((x - that._x + that._s/2 )/that._gap) - 1) {
						i --;
					} 
				}

				if ( i > -1 ) {
					var j = that.poker_list.select.indexOf(i);
					if ( j > -1 ) {
						that.poker_list.select.splice(j, 1);
					}else{
						if (!that.cpCheck(i) ) return;

						that.poker_list.select.push(i);
					}
					that.reshow();
				}
				
			} else if (that.isInPath(x, y, that.img.cp)) {
				// 其他按钮部份
				that.cp();
			}else if (that.isInPath(x, y, that.img.bc)) {
				// 其他按钮部份
				that.bc();
			}
		});
	},

    isInPath: function(x, y, o){
		var r = this._w / 2;
		this.canvas.beginPath();
	    this.canvas.rect(o.x, o.y, o.dom.width, o.dom.height);
	    return this.canvas.isPointInPath(x, y);
	},


	// 显示我方牌
	p1: function (){
		var x = this._x;
		var y = this._y;

		this._gap = (this._w - this._x*2) / (this.poker_list.list.length+1);

		for ( i in this.poker_list.list) {
			i = parseInt(i);
			var poker = this.poker_list.list[i];
			if ( this.poker_list.select.indexOf(i) > -1 ) {
				y = this._y - this._s/4;
			} else {
				y = this._y;
			}

			this.canvas.drawPokerCard(x, y, this._s, poker[1], poker[0]);
			x+= this._gap;
		}
	},

	reshow: function (){
		this.canvas.clearRect(0,0, this._w, this._h);  
		// 显示 桌面
		this.canvas.drawImage(this.img.dt.dom, 0, 0, this.canvas.canvas.width, this.canvas.canvas.height);

		this.p1();

		this.btnshow();

		this.showp();
		this.showp1();
		this.showp2();
	},

	// 按钮显示 
	btnshow: function(){
		var img = this.img;
		var gap = this._s/4 + 2;

		img.cp.x = this._w/2 + gap;
		img.cp.y = this._y - gap - img.cp.dom.height;
		this.canvas.drawImage(img.cp.dom, img.cp.x, img.cp.y);

		img.bc.x = this._w/2 - gap - img.bc.dom.width;
		img.bc.y = this._y - gap - img.bc.dom.height;
		this.canvas.drawImage(img.bc.dom, img.bc.x, img.bc.y);
	},

	showp: function(){
		var ov = this.ov;

		var img = ov.p.type == 1 ? this.img.dz : this.img.nm;
		img.dom.width = this.canvas.canvas.height/5;
		img.dom.height = this.canvas.canvas.height/5;

		img.x = 5;
		img.y = this.canvas.canvas.height/2 - img.dom.height/2;
		this.canvas.drawImage(img.dom, img.x, img.y, img.dom.width, img.dom.height);
	},

	showp1: function(){
		var ov = this.ov;

		var img = ov.p.p1.type == 1 ? this.img.dz : this.img.nm;
		img.dom.width = this.canvas.canvas.height/5;
		img.dom.height = this.canvas.canvas.height/5;

		var ph = img.dom.width*0.7; // 牌高
		var pw = ph*3/4; // 牌宽

		img.x = 5;
		this.canvas.drawImage(img.dom, img.x, img.x, img.dom.width, img.dom.height);

		var nu = ov.p.p1.nu;
		if ( nu >= 5 ) nu = 5;
		var x = img.x;
		for ( var i = 0; i < nu; i++ ) {
			this.canvas.drawPokerBack(img.dom.width + img.x*2, x, ph,'#fff','#67a0d7');
			x+= 2;
		}
		
		this.getCanvasSty('pnu');
		this.canvas.fillText(ov.p.p1.nu, img.dom.width + img.x*2 + pw/2 - 10, x + ph/2);

		// 上次出的牌
		var pp = ov.p.p1.pp;
		x = img.dom.width + img.x*3 + pw;
		y = img.dom.height + img.x - ph;
		var _ph = this._s * 0.7;
		for ( i in pp ) {
			var poker = pp[i];
			this.canvas.drawPokerCard(x, y, _ph, poker[1], poker[0]);
			x += _ph*3/10;
		}
	},

	showp2: function(){
		var ov = this.ov;

		var img = ov.p.p2.type == 1 ? this.img.dz : this.img.nm;
		img.dom.width = this.canvas.canvas.height/5;
		img.dom.height = this.canvas.canvas.height/5;

		var ph = img.dom.width*0.7; // 牌高
		var pw = ph*3/4; // 牌宽

		img.x = 5;
		var x = img.x;
		this.canvas.drawImage(img.dom, this._w - x - img.dom.width, x, img.dom.width, img.dom.height);

		var nu = ov.p.p2.nu;
		if ( nu >= 5 ) nu = 5;
		
		for ( var i = 0; i < nu; i++ ) {
			this.canvas.drawPokerBack(this._w - x*2 - img.dom.width - pw, x, ph,'#fff','#67a0d7');
			x+= 2;
		}
		
		this.getCanvasSty('pnu');
		var tw = this.canvas.measureText(ov.p.p2.nu).width;
		this.canvas.fillText(ov.p.p2.nu, this._w - x*2 - img.dom.width - pw/2 - tw/2, x + ph/2);
	

		// 上次出的牌
		var pp = ov.p.p2.pp;
		var _ph = this._s * 0.7;
		x = this._w - ( img.dom.width + img.x*3 + pw + (_ph*3/10 * pp.length + _ph*3/4*3/5) );
		y = img.dom.height + img.x - ph;
		for ( i in pp ) {
			var poker = pp[i];
			this.canvas.drawPokerCard(x, y, _ph, poker[1], poker[0]);
			x += _ph*3/10;
		}
	},

	getCanvasSty: function(t){
		switch(t) {
			case 'pnu':
				// 剩余牌张数
				var gradient = this.canvas.createLinearGradient(0,0, 20,0);
				gradient.addColorStop("0","magenta");
				gradient.addColorStop("0.5","blue");
				gradient.addColorStop("1.0","black");
				// 用渐变填色
				this.canvas.fillStyle=gradient;
				this.canvas.font="28px Georgia";
				break;
		}
		
	},


	// 出牌操作
	cp : function(){
		if ( this.poker_list.select.length == 0 ) return;

	},

	// 牌的类型: 1、顺 2、对 3、三 4、炸 5、三带一 6、三带一对 7、四带两
	ptype: function(se){
		var list = this.poker_list.list;
		var l = se.length;
		switch ( l ) {
			case 2:
			case 3:
				switch ( Math.abs(this.pCompare( list[se[0]], list[se[1]] ) ) ) {
					case 1:
						return 1;

					case 0:
						return 2;
				}
			case 4:
				switch ( Math.abs(this.pCompare( list[se[0]], list[se[1]] ) ) ) {
					case 1:
						// 顺
						return 1;

					case 0:
						switch ( Math.abs(this.pCompare( list[se[2]], list[se[3]] ) ) ) {
							case 0:
								return 4;

							default:
								return 5;

						}
				}
				break;	

			case 5:
				switch ( Math.abs(this.pCompare( list[se[0]], list[se[1]] ) ) ) {
					case 1:
						// 顺
						return 1;

					case 0:
						switch ( Math.abs(this.pCompare( list[se[3]], list[se[4]] ) ) ) {
							case 0:
								return 6;
						}
				}
				break;

			case 6:
				switch ( Math.abs(this.pCompare( list[se[0]], list[se[1]] ) ) ) {
					case 1:
						// 顺
						return 1;

					case 0:
						switch ( Math.abs(this.pCompare( list[se[3]], list[se[4]] ) ) ) {
							case 0:
								return 7;
						}
				}
				break;	
		}

		return 0;
	},

	// 两张对比 
	pCompare: function(pk, _pk){
		var nu = {
			'2'	: 15, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8' : 8, '9': 9, '10' : 10,
			'J': 11, 'Q': 12, 'K': 13, 'A': 14, 'O': 20
		}

		if ( nu[pk[0]] == 20 && nu[_pk[0]] == 20 ) {
			if ( nu[_pk[1]] == 'h' ) {
				// 大王
				return 1;
			} else {
				return -1;
			}
		}

		return nu[pk[0]] - nu[_pk[0]];
	},


	cpCheck: function(i){
		// 上家出牌
		var prList = [];
		var se = this.poker_list.select;
		var list = this.poker_list.list;

		switch( se.length ) {
			case 0:
				// 检查
				if ( prList.length == 0 ) {
					return true;
				}else {

				}
			case 1:
				if ( list[se[0]][0] == 'O' && list[i][0] != 'O' ) return false;

				if ( (list[se[0]][0] == '2' && list[i][0] != '2') ||
				(list[se[0]][0] != '2' && list[i][0] == '2') ) return false;

				if ( Math.abs(this.pCompare( list[se[0]], list[i] )) > 1 ) return false;
				break;

			// case 2:
			// case 3:
			// case 4:
			// case 5:
			default:
				switch ( this.ptype(se) ) {
					case 1:
						// 顺
						// 有，2、3、4、5
						if ( list[i][0] == '2') return false;

						var ge = se.length;
						var v = Math.abs(this.pCompare(list[se[0]], list[i]));
						if ( v != ge && v != 1 ) return false;
						break;

					case 2:
						// 对
						if ( se.length == 2 && this.pCompare(list[se[0]], list[i]) !== 0 ) return false;
						break;

					case 4:
						// 炸
						return false;

					case 5:
						// 三带一
						// 还可以三带二
						if ( this.pCompare(list[se[3]], list[i]) !== 0 ) return false;
						break;	

					case 6:
						// 三带一对
						return false;	
					case 7:
						// 四带两
						if ( this.pCompare(list[se[4]], list[i]) !== 0 ) return false;
						break;	
				}
				break;
		}

		return true;
	},

	// 不出牌
	bc: function(){
		this.poker_list.select = [];
		this.reshow();
	}
};