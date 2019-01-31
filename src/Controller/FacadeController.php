<?php

namespace App\Controller;

use App\Exceptions\FacadeException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use App\Entity\UserTunnels;
use App\Entity\Tunnel;
use App\Entity\Computer;
use App\Utils\JSON;
use App\Utils\Socket;

/*SSHGATEWAY="sshtunnel.iesrodeira.com"
COMMIP="10.0.3.91"
COMMPORT="63000" */

class FacadeController extends Controller {
	private $apikey;
	private $actioncommand="do";
	private $controllers=array();
	private $rol=null;
	public static $config;

	/** Constructor
	*/
	public function __construct() {
		// Facade Configuration - Facade returns clean JSON, not Response object
		//
		$this->setApikey("api-key-tunnel");
		$this->addFacade("default","infoService");		// By default returns all tunnel list
		$this->addFacade("infoservice","infoService");
		FacadeController::$config=parse_ini_file("../src/Config.ini");
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
		$data=$this->info(false,true);
		return JSON::makeResponse(JSON::encode($data,array("users","roles","tunnels"))); //,array("users","rol")));
	}


	/**---------------------------------------------------
	-------------> Auxiliar Functions
	----------------------------------------------------**/

	protected function sortfunction($sortby,$orderby) {
		return function($objectA,$objectB) use ($sortby,$orderby) {
			$ret=$this->compareTo($objectA,$objectB,$sortby);
			if ($orderby=="desc") $ret=-$ret;
			return $ret;
		};
	}

	protected function dataSort($info,$sortby,$orderby) {
		if (usort($info,$this->sortfunction($sortby,$orderby))) return $info;
		return null;
	}

	protected function getOrder() {
		$this->session = new Session();
		$order=$this->session->get(get_class($this)."_order",null);
		return $order;
	}

	protected function setOrder(array $order) {
		$this->session = new Session();
		$this->session->set(get_class($this)."_order",$order);
	}

	protected function compareTo($dataA,$dataB,$field) {
		if ($dataA[$field] > $dataB[$field]) return 1;
		else if ($dataA[$field]<  $dataB[$field]) return -1;
		return 0;
	}

	protected function info($computers=false,$all=true) {
		$doctrine=$this->getDoctrine();
		$data=array("ok"=>true);
		if ($all) {
			$data["tunnels"]=$doctrine->getRepository(Tunnel::class)->findAll();
			if ($computers) $data["computers"]=$doctrine->getRepository(Computer::class)->findAll();
		} else {
			$user=$this->getUser();
			$usertunnels=$user->getTunnels();
			foreach($usertunnels as $ut) {
				$data["tunnels"][]=$ut->getTunnel();
			}
			if ($computers) $data["computers"]=$user->getRol()->getComputers();
		}
		return $data;
	}

	protected function update($action=null,$computers=false,$all=false) {
			$socket=null;
			$doctrine=$this->getDoctrine();
			$entityManager=$doctrine->getManager();
			

			try {
				$data=$this->info($computers,$all);
				if (($action!=null)&&($action!="")) $data["action"]=$action;
				$socket=new Socket(FacadeController::$config["COMMIP"],FacadeController::$config["COMMPORT"]);
				$socket->send(JSON::encode($data,array("users","roles","tunnels")));
				$result=$socket->receive(655360);
				$data=json_decode($result);
				if ($data===NULL) throw new \Exception("Error decodificando respuesta [$result]");
				$socket->close();
				if ($data->ok) {
					if ($this->getUser()!=null) {
						foreach($data->tunnels as $t) {
							$tun=UserTunnels::getInstance($doctrine,$this->getUser(),$t->id);
							if ($tun!=null) {
								if (!$t->started) $tun->setRunning($t->started);
								$tun->getTunnel()->setMonitor($t->monitor);
								$entityManager->persist($tun);
							}
						}
					}
					if ($computers) {
						foreach($data->computers as $c) {
							$com=Computer::getInstance($doctrine,$c->id);
							$com->setStatus($c->status);
							//$entityManager->persist($com);
						}
					}
					$entityManager->flush();
				} else throw new \Exception($data->msg);
			} finally {
				if ($socket!=null) $socket->close();
			}
			return $this->listTunnelsAction();
	}
}
