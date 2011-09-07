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
				
	};