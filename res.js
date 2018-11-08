var res = {
	img: {},
	
	init: function (o, c, v) {
		// 载入图片资源 
		var img = {cp: 'cp.png', bc: 'bc.png', dt: 'dt.png', nm: 'nm.png', dz: 'dz.png'};
		var j = 0;
		var l = Object.keys(img).length;
		for ( i in img ) {
			this.img[i] = {dom: {}, x: 0, y: 0, w: 0, h: 0};
			this.img[i].dom = new Image();

 			this.img[i].dom.onload = function(){
 				j++;
 				if ( j == l ) {
 					$('.lds-facebook').hide();
 					o.init(c, v);
 				}
 			};

 			this.img[i].dom.src = 'res/'+ img[i];
		}
	},
};