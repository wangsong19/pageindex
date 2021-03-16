# pageindex
JS 分页索引工具
(js page index for query!)

# dependence
use bootstrap style(!important)

# use
1.import to html
```html
<script src="./js/pageindex.js"></script>
```
2.create pageindex and provide for params:
	+ all record length
	+ default page size
	+ bind node ID in html
	+ query function with offset and limit(click callback)
```js
let pageIndex = PageIndex.New(100, 20, "testID", (offset=0, limit=20)=>{ // do something.. })
```
