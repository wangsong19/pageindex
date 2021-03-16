/* 用于管理当前显示页面的分页索引
 * *样式使用bootstrap4的分页样式
 * ******************************/
(function() {
	"use strict"

	var PageIndex = {
		limit: 20,			// 展示页面条目数(默认20)
		all: 0,				// 所查询的总条目数
		pageNum: 0,			// 当前分页页数(根据总条目数算出)
		showPageSize: 10,   // 索引条显示长度
		_showPageSizeLimit: 10, // 最大显示长度
		curp: 0,			// 当前指向的索引
		queryFunc: null,	// 每次点击之后的查询函数
		indexes:  [],		// 索引节点
		node: null,			// 对应的node

		_color: "white",		// 选中框字体颜色
		_bgColor: "lightblue",	// 选中框背景颜色

		// 生成一个分页索引对象
		// len: 总数据长度
		// limit: 每页数据条目数
		// bindID: 要绑定到的节点
		// queryFunc: 点击索引会调用的查询函数
		New: function(len, limit, bindID, queryFunc) {
			if (!len || !limit || !bindID) return;
			if (!queryFunc || typeof queryFunc != "function") return;
			if (!bindID.startsWith("#")) {bindID = "#" + bindID;}

			let _this = Object.assign({}, PageIndex);
			// !!! indexes引用问题,这里清理(保证当前页面不会出现其他索引)
			if (_this.indexes.length > 0) _this.indexes = [];
			_this.queryFunc = queryFunc;
			_this.all = len;
			_this.limit = limit;
			let pageNum = len/limit;
			_this.pageNum = `${pageNum}`.indexOf(".") >= 0 ? parseInt(pageNum)+1 : pageNum;
			_this.showPageSize = _this.pageNum > _this.showPageSize ? 
										_this.showPageSize : _this.pageNum;

			let node = document.createElement("ul");
			node.classList.add("pagination");
			node.classList.add("justify-content-center");
			// left
			let left = _this._createIndex("&laquo;");
			left.onclick = (e) => {_this._previous();};
			node.appendChild(left);
			// mid (先将所有节点创建出来)
			for (let i=0; i<_this.pageNum; i++) {
				let index = _this._createIndex(i+1);
				index.onclick = (e) => {_this._to(e)};
				node.appendChild(index);
				_this.indexes.push(index);
			}
			// right
			let right = _this._createIndex("&raquo;");
			right.onclick = (e) => {_this._next();};
			node.appendChild(right);
			// 绑定到父节点
			let parentNode = document.querySelector(bindID);
			if (parentNode) {
				parentNode.innerHTML = "";
				parentNode.appendChild(node);
			}
			// 正确显示索引
			_this._setFlag();

			return _this;
		},

		// 返回当前索引
		curIndex: function() {
			return parseInt(this.indexes[this.curp].innerHTML);
		}, 

		// 创建索引后首次的默认调用
		first: function() {
			this._query();
		},

		// 设置显示样式
		setColor: function(color, bgColor) {
			if (color) this._color = color;
			if (bgColor) this._bgColor = bgColor;
		},

		// 创建分页点
		_createIndex: function(innerHTML) {
			let index = document.createElement("li");
			let _in = document.createElement("span");
			index.classList.add("page-item");
			_in.classList.add("page-link");
			_in.innerHTML = innerHTML;
			index.appendChild(_in);
			return index;
		},

		// 设置显示目录索引的最大长度
		_setShowPageSizeLimit: function(max) {
			this._showPageSizeLimit = max;
		},

		// 根据curp/showPageSize显示索引条
		// (int(this.showPageSize/2)-1)为中心点
		_setFlag: function() {
			for (let i=0; i<this.indexes.length; i++) {
				if (i==this.curp) {
					this.indexes[i].children[0].style.backgroundColor = this._bgColor;
					this.indexes[i].children[0].style.color = this._color;
				} else {
					this.indexes[i].children[0].style.backgroundColor = "white";
					this.indexes[i].children[0].style.color = "#6C757D";
				}
			}
			let start, end = 0;
			let mid = parseInt(this.showPageSize/2);
			if (this.curp < mid) {
				start = 0;
			} else if (this.curp > this.pageNum - mid) {
				start = this.pageNum - this.showPageSize;
			} else {
				start = this.curp - mid;
			}
			end = start + this.showPageSize;
			for (let i=0; i<this.pageNum; i++) {
				if (i >= start && i < end) {
					this.indexes[i].style.display = "block";
				} else {
					this.indexes[i].style.display = "none";
				}
			}
		},

		// previous事件
		_previous: function() {
			this.curp -= 1;
			if (this.curp < 0) this.curp = 0;
			this._setFlag();
			return this._query()
		},

		// next事件
		_next: function() {
			this.curp += 1;
			if (this.curp > this.pageNum) this.curp = this.pageNum;
			this._setFlag();
			return this._query();
		},

		// 点击index标号事件
		_to: function(e) {
			let i = parseInt(e.target.innerHTML); // span innerHTML
			this.curp = i-1;
			this._setFlag();
			return this._query()
		},

		// 查询
		_query: function() {
			return this.queryFunc(this.curp*this.limit, this.limit);
		},
	};

	// Environment detection
	if (typeof module === "object" && module && typeof module.exports === "object") {
		module.exports = Drawer;
	} else {
		window["PageIndex"] = PageIndex;
	}
})()
