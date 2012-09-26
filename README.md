Yii CGridView: apply text filters on type
=========================================

Apply Yii's CGridView (or any grid view) text filters as you type.

Example:
~~~
<?php
	// ... 
	$this->widget('ext.widgets.grid.GridViewLiveTextFilters',array(
		'grid_id'=>'user-grid'
	));
	// ...
~~~

Author: Sergii Gamaiunov <hello@webkadabra.com>
http://webkadabra.com