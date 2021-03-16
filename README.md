# pageindex
JS 分页索引工具
js page index for query!

# dependence
use bootstrap style(!important)

# use
1.import to html
```html
<script src="./js/pageindex.js"></script>
```
2.create pageindex and provide for params:
	a.all record length
	b.default page size
	c.bind node in html
	d.query function with offset and limit(click callback)
```js
let pageIndex = PageIndex.New(100, 20, testNode, (offset=0, limit=20)=>{ // do something.. })
```
