define(["jquery",'qlik','ng!$q'],
        function ($, qlik, $q) {
            'use strict';
			
			var _layout,app = qlik.currApp(),_this = this;
			var fontFamilyArray = [
				"Helvetica, Arial, sans-serif", 
				"\"QlikView Sans\", sans-serif",
				"Courier New, monospace",
				"Snell Roundhand, cursive"
			];
			
			function getPositionDimension(d,m){
				for(var c=0;c<d.length;c++){
					if(d[c].qFallbackTitle === m){
						return c;
					}
				}
				return -1;
			}

			return {
				definition: {
					type: "items",
					component: "accordion",
					items: {
						dimensions: {
							uses: "dimensions"
						},
						customSection: {
							component: "expandable-items",
							label: "Configuration Marquee",
							items: {
								typemarqueelist: {
									type: "string",
									component: "dropdown",
									label: "Orientation Marquee",
									ref: "myTypeMarqueeList",
									options: [{
										value: "l",
										label: "Left"
									}, {
										value: "r",
										label: "Right"
									}],
									defaultValue: "l"
								},	
								speedmarquee: {
									type: "items",
									label: "Speed Marque",
									items: {
										speedmarqueevalue: {
											ref: "speedmarqueevalue",
											label: "Speed Marque",
											type: "integer",
											defaultValue: 5
										}										
									}
								},									
								colormenu: {
									type: "items",
									label: "Color Marquee",
									items: {
										MyColorPickerTextActive: {
											label: "Color Text",
											ref: "myColorMarqueeText",
											type: "string",
											show: true,
											defaultValue: "#e4433c",
											component: "color-picker"
										},
										MyColorPickerMenuActive: {
											label:"Color Background",
											component: "color-picker",
											ref: "myColorMarqueeBackground",
											type: "string",
											defaultValue: "#ffffff"
										},
									}
								},
								fontmenu: {
									type: "items",
									label: "Font Marquee",
									items: {
										fontfamily: {
											type: "string",
											component: "dropdown",
											label: "Font Family",
											ref: "fontfamilymarquee",
											options: [
												{
													label: "Helvetica, Arial, sans-serif",
													value: "0"
												},
												{
													label: "\"QlikView Sans\", sans-serif",
													value: "1"
												},
												{
													label: "Courier New, monospace",
													value: "2"
												},
												{
													label: "Snell Roundhand, cursive",
													value: "3"
												}												
											],
											defaultValue: 0
										},
										fontsize: {
											ref: "fontsizemarquee",
											label: "Font Size (px)",
											type: "integer",
											defaultValue: 13
										}
									}
								}							
							}
						}
											

					}
				},
				initialProperties: {
					qHyperCubeDef: {
						qDimensions: [],
						qMeasures: [],
						qInitialDataFetch: [
							{
								qWidth: 10,
								qHeight: 100
							}
						]
					}
				},		
				paint: function ($element, layout) {
					var _directionText, _colorText, _colorBackgroud;
					_layout = layout;
					$element.empty();
					try{
						var hc = layout.qHyperCube;
						var miMatrix = hc.qDataPages[0].qMatrix,  miMatrix2=[];
						var _dimension = hc.qDimensionInfo;
						if (hc.qDimensionInfo.length == 1) {
							var _mopt = layout.menuIdListOption;
							if(_layout.myTypeMarqueeList==="l"){
								_directionText="Left";
							}else{
								_directionText="Right"
							}
							if(typeof _layout.myColorMarqueeBackground === 'undefined'){
								_colorBackgroud = "#ffffff";
							}if(typeof _layout.myColorMarqueeBackground === 'string'){
								_colorBackgroud = _layout.myColorMarqueeBackground;
							}if(typeof _layout.myColorMarqueeBackground === 'object'){
								_colorBackgroud = _layout.myColorMarqueeBackground.color;
							} 
							if(typeof _layout.myColorMarqueeText === 'undefined'){
								_colorText = "#e4433c";
							}if(typeof _layout.myColorMarqueeText === 'string'){
								_colorText = _layout.myColorMarqueeText;
							}if(typeof _layout.myColorMarqueeText === 'object'){
								_colorText = _layout.myColorMarqueeText.color;
							}	
							var menu = document.createElement('CENTER');
							document.body.appendChild(menu);
							var _marquee1 = document.createElement('MARQUEE');						
							_marquee1.setAttribute('SCROLLAMOUNT', _layout.speedmarqueevalue);
							_marquee1.setAttribute('DIRECTION', _directionText);
							_marquee1.setAttribute('WIDTH', '100%');
							_marquee1.setAttribute('BGCOLOR', _colorBackgroud);
							var _font1 = document.createElement('p');
							_font1.setAttribute('style','font-family:' + fontFamilyArray[_layout.fontfamilymarquee] + ';color:' + _colorText + ' ;font-size:' + _layout.fontsizemarquee + 'px');
							var _posTarget=getPositionDimension(_dimension,'OLLIN_M_TEXT');	
							miMatrix.sort(function(obj1, obj2) {
									return obj1[0].qElemNumber - obj2[0].qElemNumber;
							});							
							var _miTexto="";	
							var _salto = "<br>"
							for (var f = 0; f < miMatrix.length; f++) {
								if((f+1) == miMatrix.length)
									_salto = "";
								_miTexto+=miMatrix[f][(_posTarget)].qText + _salto;
							}
							_font1.innerHTML=_miTexto
							_marquee1.appendChild(_font1);
							menu.appendChild(_marquee1);
							$element.append(menu.outerHTML)							
						} else {
							$element.append('El numero de dimensiones debe ser 1');
						}						
					}catch(e){
						$element.append('Error en la estructura de la marquesina');
					}

				}
			};
        });
		
