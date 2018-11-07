var v = {
	_w: 360,
	_h: 240,

	_y: 154,	// 牌的坐标
	_x: 6,		// 牌的边距

	_s: 80,		// 牌的大小
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

			if ( false && y >= that._y ) {
				var i = -1;

				// 点牌区域
				if ( that.poker_list.list.length == 1 && (x - that._x) <= that._s/2 ) {
					i = 0;
				} else {
					var i = (x - that._x )/(that._s/that._gap);
					i = Math.ceil(i) - 1;

					if ( that.poker_list.list.length < i && 
						that.poker_list.list.length >=  Math.ceil((x - that._x + that._s/2 )/(that._s/that._gap)) - 1) {
						i --;
					} 
				}

				if ( i > -1 ) {
					if (!that.cpCheck() ) return;

					var j = that.poker_list.select.indexOf(i);
					if ( j > -1 ) {
						that.poker_list.select.splice(j, 1);
					}else{
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

		for ( i in this.poker_list.list) {
			i = parseInt(i);
			var poker = this.poker_list.list[i];
			if ( this.poker_list.select.indexOf(i) > -1 ) {
				y = this._y - this._s/2;
			} else {
				y = this._y;
			}

			var o = this.canvas.drawPokerCard(x, y, this._s, poker[1], poker[0]);
			x+= this._s/this._gap;

			o.addEventListener('click', function(e){
				console.debug(111)
			});
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
		var gap = 30;

		img.cp.x = this._w/2 + gap;
		img.cp.y = this._y - this._s - img.cp.dom.height;
		this.canvas.drawImage(img.cp.dom, img.cp.x, img.cp.y);

		img.bc.x = this._w/2 - gap - img.bc.dom.width;
		img.bc.y = this._y - this._s - img.bc.dom.height;
		this.canvas.drawImage(img.bc.dom, img.bc.x, img.bc.y);
	},


	// 出牌操作
	cp : function(){
		if ( this.poker_list.select.length == 0 ) return;

	},


	cpCheck: function(){

		return true;
	},

	// 不出牌
	bc: function(){
		this.poker_list.select = [];
		this.reshow();
	}
};