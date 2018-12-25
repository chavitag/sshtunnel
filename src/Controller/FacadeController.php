<?php

namespace App\Controller;

use App\Exceptions\FacadeException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Tunnel;
use App\Entity\Computer;
use App\Utils\JSON;

define("SSHGATEWAY","127.0.0.1");
define("SSHGATEWAY_PORT",1777);

class FacadeController extends Controller {
	private $apikey;
	private $actioncommand="do";
	private $controllers=array();
	private $rol=null;

	/** Constructor
	*/
	public function __construct() {
		// Facade Configuration - Facade returns clean JSON, not Response object
		//
		$this->setApikey("api-key-tunnel");
		$this->addFacade("default","infoService");		// By default returns all tunnel list
		$this->addFacade("infoservice","infoService");
	}

	/**
	*	Service for web-service calls, not web app
	*
	* @Route("/service", name="service")
	*/
	public function runFacade(Request $request) {
		try {
			$user=$this->getUser();
			if ($user === null) {	// Not logged. Is necessary an API KEY
				$apikey=$request->get("apikey");
				if (!isset($apikey) || (md5($apikey)!=$this->apikey)) throw new FacadeException("Bad Api Key",2);
			} else $this->rol=$user->getRol();
			$cmd=$request->get($this->actioncommand);
			if ($cmd === null) $cmd="default";
			if (!isset($this->controllers[$cmd])) throw new FacadeException("No Controller",1);
			return call_user_func(array($this,$this->controllers[$cmd]), $request);
		} catch(\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
	}

	public function getApikey() {
		return $this->apikey;
	}

	public function setApikey($key) {
		$this->apikey=md5($key);
	}

	public function addFacade(string $command,string $facade) {
		$this->controllers[$command]=$facade;
	}

	public function setActionCommand(string $cmd) {
		$this->actioncommand=$cmd;
	}

	public function getActionCommand():string {
		return $this->actioncommand;
	}

	/**-------------------------------------------------
		---------->	Service Functions
		-------------------------------------------------*/

	/** Return ALL Tunnels and Computers JSON List
	*		do=infoservice
	*/
	protected function infoService(Request $request=null) {
		$data=$this->info();
		return JSON::makeResponse(JSON::encode($data,array("users","roles","tunnels"))); //,array("users","rol")));
	}


	/**---------------------------------------------------
	-------------> Auxiliar Functions
	----------------------------------------------------**/
	protected function info() {
		$doctrine=$this->getDoctrine();
		$data=array("ok"=>true,"tunnels"=>null,"computers"=>null);
		$data["tunnels"]=$doctrine->getRepository(Tunnel::class)->findAll();
		$data["computers"]=$doctrine->getRepository(Computer::class)->findAll();
		return $data;
	}
}
