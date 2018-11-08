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
				['A', 's'], ['2', 's'], ['3', 's'], ['4', 's'], ['5', 's'], 
				['6', 'd'], ['7', 'd'], ['8', 'd'], ['9', 'd'], ['10','d'], 
				['J', 'd'], ['Q', 'd'], ['K', 'd'], ['O', 's'], ['O', 'h'], 
				['A', 'd'], ['A', 'h']
			],
			select: [],
			out: []
		},
		status: 0,
		type: 0,	// 类型：1、地方 2、农民
		p1: {
			id: 3,
			name: '小三',
			pp: [['A', 'd'], ['A', 'h']],	// 上次出的牌
			nu: 8
		},		// 上手
		p2: {
			id: 2,
			name: '小二',
			pp: [['6', 'd'], ['7', 'd'], ['8', 'd'], ['9', 'd'], ['10','d']],
			nu: 1
		},		// 下手
	},

	init: function (canvas, v) {
		this.canvas = canvas;
		this.v = v;
		this.img = res.img;


		v.init(canvas, this);
	},
};