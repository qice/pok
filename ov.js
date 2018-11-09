var ov = {
	canvas : '',
	v: '',
	img : '',

	p:{
		id: 1,
		room: 1,
		name: '小一',
		poker_list: {
			list: [
				['3', 'h'], ['3', 's'], ['4', 's'], ['4', 'd'],['5', 's'], 
				['6', 'd'], ['7', 'd'], ['8', 'd'], ['9', 'd'], ['10','d'], 
				['J', 'd'], ['Q', 'd'], ['K', 'd'], ['K', 'h'],
				['A', 'd'], ['A', 'h'], ['A', 's'], ['2', 's'], ['O', 's'], ['O', 'h'], 
			],
			select: [],
			out: [],
		},
		pp: [],
		status: 2,	// 1、出牌  2、必须出
		type: 0,	// 类型：1、地方 2、农民
		p1: {
			id: 3,
			name: '小三',
			pp: [],	// 上次出的牌
			nu: 17,
			status: 0
		},		// 上手
		p2: {
			id: 2,
			name: '小二',
			pp: [],
			nu: 17,
			status: 0
		},		// 下手
	},

	init: function (canvas, v) {
		this.canvas = canvas;
		this.v = v;
		this.img = res.img;


		v.init(canvas, this);
	},

	p1cp: function () {
		var p1 = this.p.p1;
		var p2 = this.p.p2;

		p1.pp = [['5', 'd'], ['5', 'h']];

		var r = true;
		var p = this.p;
		if ( p2.pp.length > 0 ) {
			if ( v.cpCheck( p1.pp ) != v.cpCheck(p2.pp) 
				|| p1.pp[0] <= p2.pp[0]) {
				r = false;
			} 
		} else if ( p.pp.length > 0 ) {
			if ( v.cpCheck( p1.pp ) != v.cpCheck(p.pp) 
				|| p1.pp[0] <= p.pp[0]) {
				r = false;
			}
		}

		if ( !r ) {
			p1.pp = [];

			if ( p2.pp.length == 0 ) {
				// 都没人要
				this.p.status = 2;
			}

			console.debug('p1 过！');
		} else {
			p1.nu - 2;
			this.p.status = 1;
			console.debug('p1 出牌');
		}
		
		p1.status = 0;
		
		this.p.pp = [];
		this.v.reshow();
	},

	p2cp: function () {
		var  p = this.p;
		var p1 = this.p.p1;
		var p2 = this.p.p2;

		p2.pp = [['4', 'd'], ['4', 'h']];

		var r = true;
		if ( p.pp.length > 0 ) {
			if ( v.cpCheck( p2.pp ) != v.cpCheck(p.pp) 
				|| p2.pp[0] <= p.pp[0]) {
				r = false;
			} 
		} else if ( p1.pp.length > 0 ) {
			if ( v.cpCheck( p2.pp ) != v.cpCheck(p1.pp) 
				|| p2.pp[0] <= p1.pp[0]) {
				r = false;
			}
		}

		if ( !r ) {
			p2.pp = [];
			console.debug('p2 过');
		} else {
			console.debug('p2 出牌');
			p2.nu - 2;
		}

		p2.status = 0;
		p1.status = 1;
		p1.pp = [];
		this.v.reshow();
	},
};


// 本地测试
setInterval(function(){
	var p  = ov.p;
	var p1 = ov.p.p1;
	var p2 = ov.p.p2;

	if ( p1.status ) {
		

		ov.p1cp();
	}else if ( p2.status ) {
		ov.p2cp();
	}
}, 1000);

var url = 'ws://';
function ws(url){
	var ws = new WebSocket(url);
	ws.onopen = function () {
		console.log('连接成功');
	};

	ws.onmessage = function(evt) {
		//console.log(evt);
		var msg = evt.data;
		if ( msg.indexOf('{"type":"ping"}') > -1 ) {
            wss.ws.send(JSON.stringify({type: 'pong'}));
            return;
		}

		console.log(msg);
		var data = [];
		try {
			data = eval('('+ msg +')');
			

		}catch(err){
			
		}
	};

	ws.onclose = function(){
        console.log('连接断开');
	};

	//this.ws = ws;
}(url);


/*
ov.p.poker_list.select = new Proxy(ov.p.poker_list._select, {
	set: function (obj, prop, value) {
		if ( prop == 'length' ) return true;


		console.debug(obj);
		console.debug(prop);
		console.debug(value);

		obj.push(value);

		return true;
    },

    deleteProperty: function(oTarget, sKey, o){
    	console.debug('>>'+ oTarget);
		console.debug('>>'+ sKey);
		console.debug('>>'+ o);

		var j = ov.p.poker_list._select.indexOf(oTarget);
		ov.p.poker_list._select.splice(j, 1);
		return true;
    }
});
*/


/*
var arrayMethods = Object.create(Array.prototype);
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(function(item){
	Object.defineProperty(arrayMethods,item,{
	    value:function mutator(o, v, b){
            //缓存原生方法，之后调用
            console.log(o);
            console.log(v);
            console.log(b);
            console.log(this);
	    	
	  //   	var original = arrayProto[item]	
	  //   	var args = Array.from(arguments)
			// original.apply(this,args)
            // 

            //ov.p.poker_list.select = [7]
            return 7;
	    },

	    enumerable: true,
        writable: true,
        configurable: true
	})
});

ov.p.poker_list.select.__proto__ = arrayMethods;
*/

/*
var handler = {
	get: function(){
    	return [];
    },

    set : function(v){

    }
};

var ORP = ['p'];
//ORP.forEach(function (prop) {
	Object.defineProperty(ov.p.poker_list, 'select', handler);
//});

Array.prototype.push = function(v){
	var o = [];
	var l = this.length;
	if ( l > 0 ) {
		for( i = 0; i < this.length; i++ ) {
			o[i] = this[i];
		}
		o[i+1] = v;
	} else {
		o = [v];
	}
	handler.set(o);
};
*/