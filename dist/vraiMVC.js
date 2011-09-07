/*!
 * vraiMVC Library v0.1
 *
 * Copyright 2011, Jasson Cascante
 * Probably licensed under the MIT.
 * Date: 
 */
(function(){
	
	window.Vrai = {};
var Model = function(modelName, options){
		var that = this;
		this.modelName = modelName;

		Vrai.Model[modelName] = function(options){
			this.modelProtoReference = that;
			this.objid = Math.round(Math.random()*100000000);
			this.init = function(){
												
				for(var key in Vrai.Model[modelName].defaults){
					this[key] = options.hasOwnProperty(key) ? options[key] : Vrai.Model[modelName].defaults[key];
				}
				
				Vrai.Model[that.modelName].views[this.objid] = [];
				Vrai.Model[that.modelName].collection.push(this);

			};
			this.set = function(params){
				for(var key in params){
                                    this[key] = params[key];
                                }
				this.notify();
			};
			this.get = function(property){
				return this[property];
			};
			this.remove = function(){
				for(var key in Vrai.Model[that.modelName].views[this.objid]){
					Vrai.Model[that.modelName].views[this.objid][key].remove();
				}
				delete Vrai.Model[that.modelName].views[this.objid];
				var removeIndex;
				for(var i=0;i<Vrai.Model[that.modelName].collection.length;i++){
					if(Vrai.Model[that.modelName].collection[i].objid === this.objid){
						removeIndex = i;
						break;
					}				
				}
				Vrai.Model[that.modelName].collection.splice(removeIndex, 1);
			};
			this.notify = function(){
				for(var key in Vrai.Model[that.modelName].views[this.objid]){
					Vrai.Model[that.modelName].views[this.objid][key]._render();
				}
			};
			this.init();
		};
		Vrai.Model[modelName].collection = [];
		Vrai.Model[modelName].views = {};
		Vrai.Model[modelName].defaults = (function(){
			var def = {};
			for(var key in options){
				def[key] = options[key];
			}
			return def;
		})();
		return Vrai.Model[modelName];
				
	};	var View = function(viewName, options){

		Vrai.View[viewName] = function(data){
			var that = this;	
			this.model = data;
			this.init = function(){
				for(var key in options){
					this[key] = options[key];
				}
				var modRef = this.model.modelProtoReference;
				Vrai.Model[modRef.modelName].views[this.model.objid].push(this);
				this.el = document.createElement(options.tag);
				this.container.appendChild(this.el);
				return this;

			};
			this._render = function(){
				this.el.innerHTML = this.template.render(this.model);
				options.hasOwnProperty('events') && options.events.call(that);
				options.hasOwnProperty('render') && options.render.call(that);
				return this;
			};
			this.remove = function(){
				this.el.parentNode.removeChild(this.el);
			};
			this.init()._render();
		};
		return Vrai.View[viewName];
	};	Vrai.Model = Model;
	Vrai.View = View;
})();
