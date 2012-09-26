<?php
/**
 * Apply GridView text filters as you type
 *
 * Example:
 * <code>
 * ...
 * $this->widget('ext.widgets.grid.GridViewLiveTextFilters',array(
 * 	'grid_id'=>'user-grid'
 * ));
 * </code>
 * 
 * @author Sergii Gamaiunov <hello@webkadabra.com>
 */
class GridViewLiveTextFilters extends CWidget
{
	public $grid_id;
	public $scriptUrl=null;
	public function run()
	{
		$cs = Yii::app()->getClientScript();
	
		if($this->scriptUrl===null)
			$this->scriptUrl=CHtml::asset(Yii::getPathOfAlias('ext.widgets.grid.assets.gridViewLiveTypeFilters').'.js');
		Yii::app()->getClientScript()->registerScriptFile($this->scriptUrl);
		
		$id=$this->getId();

		$cs->registerScript(__CLASS__.'#'.$id, "jQuery('#".$this->grid_id."').yiiGridViewLiveTypeFilters();", CClientScript::POS_LOAD);
	}
}