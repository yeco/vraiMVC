	var View = function(viewName, options){

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
	};