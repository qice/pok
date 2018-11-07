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

	init : function (canvas, list) {
		var that = this;
		this._w = canvas.canvas.offsetWidth;
		this._h = canvas.canvas.offsetHeight;
		this._s = this._h/4;
		this._y = this._h - this._s - this._x;

		this.canvas = canvas;
		this.poker_list.list = list;

		// 载入图片资源 
		var img = {cp: 'cp.png', bc: 'bc.png'};
		var j = 0;
		var l = Object.keys(img).length;
		for ( i in img ) {
			this.img[i] = {dom: {}, x: 0, y: 0};
			this.img[i].dom = new Image();

 			this.img[i].dom.onload = function(){
 				j++;
 				if ( j == l ) {
 					that.show();
 				}
 			};

 			this.img[i].dom.src = img[i];
		}
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

		this.p1();

		this.btnshow();
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