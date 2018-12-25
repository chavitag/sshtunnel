<?php
namespace App\Exceptions;

use \Exception;

class FacadeException extends Exception {
	function __construct($message="",$code=0) {
		parent::__construct($message,$code);
	}
}
