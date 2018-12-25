<?php
namespace App\Entity;

use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\PropertyAccess\PropertyAccess;


class DataEntity {
	public function setAttributesFromRequest(ParameterBag $request,$info="params") {
		$data=$request->get($info);
		if ($data==null) return;
		$this->setAttributes($data);
	}

	public function setAttributes($data) {
		$data=json_decode($data);
		$propertyAccessor = PropertyAccess::createPropertyAccessor();
		foreach($data as $param) {
			$propertyAccessor->setValue($this,$param->name,$param->value);
		}
	}
}
