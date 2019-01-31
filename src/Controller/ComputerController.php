<?php
/** ComputerController.
		Actions:
			/list/computers.json
			/list/computer/roles.json
			/update/computer/roles
			/save/computer
			/delete/computer
*/

namespace App\Controller;

use App\Entity\Computer;
use App\Entity\Rol;
use App\Utils\Socket;
use App\Utils\JSON;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;

class ComputerController extends FacadeController {

	/**
	*	@Route("/list/computers.json",name="l_computers")
	*/
	public function listComputersAction(Request $request=null) {
		$data=Computer::getComputers($this->getUser());
		$order=null;
		$field=null;

		// Order by criteria....
		$params=$this->getOrder();
		
		if ($request!=null) {
			$field=$request->get("field");
			$order=$request->get("order");
		}

		if (($order==null)&&($params[1]!=null)) $order=$params[1];
		if (($field==null)&&($params[0]!=null)) $field=$params[0];
		if ($field==null) $field="description";
		if ($order==null) $order="asc";

		$params=array($field,$order);
		$this->setOrder($params);

		$data["rows"]=$this->dataSort($data["rows"],$field,$order);
		return $this->json($data);
	}

	/** 
	 * @Route("/list/computer/roles.json", name="l_computer_roles")
	 */
	public function listComputerRolesAction(Request $request) {
		$user=$this->getUser();
		$entityManager = $this->getDoctrine()->getManager();
		$computer=$entityManager->find("App\Entity\Computer",$request->get("id"));
		$allroles=$this->getDoctrine()->getRepository(Rol::class)->findAll();
		return $this->json(Rol::arrayRoles($allroles,$computer->getRoles())["all"]);
	}

	/**
	* @Route("/update/computer/roles", name="u_computer_roles")
	*/
	public function updateComputerRoles(Request $request) {
		$entityManager = $this->getDoctrine()->getManager();
		$computerEntity = $entityManager->getRepository(Computer::class);
		$rolEntity = $entityManager->getRepository(Rol::class);
		$computer=$computerEntity->find($request->get("id"));
		$allroles = $rolEntity->findAll();

		$roleIds=json_decode($request->get("roles"));

		foreach($computer->getRoles() as $rol) {
			if (!in_array($rol->getId(),$roleIds)) {
				$computer->removeRole($rol);
				$rol->removeComputer($computer);
			}
		}
		foreach($roleIds as $id) {
			$rol=$rolEntity->find($id);
			$computer->addRole($rol);
			$rol->addComputer($computer);
			$entityManager->persist($rol);
		}
		$entityManager->persist($computer);
		$entityManager->flush();
		return $this->json(Rol::arrayRoles($allroles,$computer->getRoles())["all"]);
	}

	/** 
	* @Route("/save/computer", name="s_computer")
	*/
	public function saveComputerAction(Request $request) {
		try {
			$computer=$this->makeComputer($request);
			$entityManager = $this->getDoctrine()->getManager();
			$entityManager->persist($computer);
			$entityManager->flush();
		} catch (\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
		return $this->listComputersAction();
	}

	/** 
	* @Route("/delete/computer", name="d_computer")
	*/
	public function delComputerAction(Request $request) {
		try {
			$command=array("ok"=>true);
			$command["action"]=array("command"=>"delete_computers","ids"=>array());
			$computers=array();

			$entityManager = $this->getDoctrine()->getManager();

			$list=json_decode($request->request->get("params"));
			foreach($list as $idcomputer) {
				$computer=$entityManager->find("App\Entity\Computer",$idcomputer);
				$command["action"]["ids"][]=$computer->getId();
				$computers[]=$computer;
				$entityManager->remove($computer);
			}
			$this->computerCommand($computers,$command);

			$entityManager->flush();
			return $this->listComputersAction();
		} catch(ForeignKeyConstraintViolationException $e) {
			return $this->json(array("ok"=>"false","msg"=>"Existen registros relacionados","code"=>$e->getCode()));
		} catch(\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
	}

	/** 
	* @Route("/change/switchcomputer", name="sw_computer")
	*/
	public function switchComputerAction(Request $request) {
		//$socket=null;
		try {
			if ($request!=null) {
				// Verificar si queremos encenderlo....
				$computerid=$request->request->get("id");
				$data=array();
				if ($computerid!=null) {
					$computerstatus=$request->request->get("status");

					$command=array("ok"=>true);
					$command["action"]=array("command"=>"change_computer_status","id"=>intval($computerid),"status"=>($computerstatus=="true"));
					
					$entityManager = $this->getDoctrine()->getManager();
					$computer=$entityManager->find("App\Entity\Computer",$computerid);
					if ($computer!=null) $this->computerCommand(array($computer),$command);

					return $this->listComputersAction();
				}
			}
			throw new Exception("Equipo descoñecido");
		} catch(\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
	}

	/** 
	* @Route("/status/checkcomputer", name="ck_computer")
	*/
	public function checkComputerAction(Request $request) {
		$socket=null;
		try {
			$doctrine=$this->getDoctrine();
			$data=array("ok"=>true);

			if ($request!=null) {
				$computer=$request->request->get("computer");
				if ($computer!=null) {
					preg_match('/\s\[(.*)\]$/',$computer,$match);
					$host=$doctrine->getRepository(Computer::class)->findOneBy(array("ip"=>$match[1]));
					$host->setScan(true);
					$data["computers"]=array($host);
					$socket=new Socket(FacadeController::$config["COMMIP"],FacadeController::$config["COMMPORT"]);
					$socket->send(JSON::encode($data,array("users","roles","tunnels")));
					$info=$socket->receive(65535);
					$socket->close();

					$data=json_decode($info);

					$status=null;
					if ($data->ok) {
						$idx=0;
						while($idx<count($data->computers)) {
							if ($data->computers[$idx]->id == $host->getId()) {
								$status=array("total"=>1,"rows"=>array(array("id"=>$host->getId(),"domain"=>$host->getDomainname(),"ip"=>$host->getIp(),"description"=>$host->getDescription(),"mac"=>$host->getMac(),"running"=>$data->computers[$idx]->status,"startTime"=>$data->computers[$idx]->startTime)));
								return $this->json($status);
							}
							$idx++;
						}
					} 
					throw new \Exception("Non se atopa $computer");
				}
			} 
			throw new Exception("Equipo descoñecido");
		} catch(\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		} finally {
			if ($socket!=null) $socket->close();
		}
	}

	/** 
	* @Route("/status/computers", name="st_computer")
	*/
	public function verifyComputerAction(Request $request=null) {
		if ($request->get("onlysort")==true) return $this->listComputersAction($request);
		$socket=null;
		try {
			$data=$this->info(true);
			foreach($data["computers"] as $computer) {
				$computer->setScan(true);
			}

			$info=JSON::encode($data,array("users","roles","tunnels"));
			$socket=new Socket(FacadeController::$config["COMMIP"],FacadeController::$config["COMMPORT"]);
			$socket->send($info);
			$info=$socket->receive(65535);
			$data=json_decode($info);

			if ($data->ok) {
				$doctrine=$this->getDoctrine();
				foreach($data->computers as $c) {
					$computer=Computer::getInstance($doctrine,$c->id);
					if ($computer!=null) {
						$computer->setStatus($c->status);
						$computer->setStartTime($c->startTime); 
						$computer->setScan(false);
						$computer->setLastScan($c->lastscan);
					} else throw new \Exception("O Equipo ".$c->ip." (".$c->id.") non existe ");
				}
			}
			return $this->listComputersAction($request);
		} catch(\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		} finally {
			if ($socket!=null) $socket->close();
		}
	}

	/**
			$command=array("command"=>"change_computer_status","id"=>$computer->id,"status"=>true)
	*/
	private function computerCommand($computers,$command) {
		$socket=null;
		try {
			$command["tunnels"]=array();
			$command["computers"]=array();
			foreach($computers as $idx=>$computer) {
				$command["computers"][$idx]["id"]=$computer->getId();
				$command["computers"][$idx]["ip"]=$computer->getIp();
				$command["computers"][$idx]["domainname"]=$computer->getDomainname();
				$command["computers"][$idx]["description"]=$computer->getDescription();
				$command["computers"][$idx]["mac"]=$computer->getMac();
				$command["computers"][$idx]["status"]=null;
				$command["computers"][$idx]["startTime"]=0;
				$command["computers"][$idx]["scan"]=0;
				$command["computers"][$idx]["lastscan"]=0;
			}

			$socket=new Socket(FacadeController::$config["COMMIP"],FacadeController::$config["COMMPORT"]);
			$socket->send(json_encode($command));
			$info=$socket->receive(65535);
			$socket->close();

			$data=json_decode($info);
			if ($data->ok) {
				$doctrine=$this->getDoctrine();
				foreach($data->computers as $c) {
					$computer=Computer::getInstance($doctrine,$c->id);
					if ($computer!=null) {
						$computer->setStatus($c->status);
						$computer->setStartTime($c->startTime);
					} else throw new \Exception("O Equipo ".$c->ip." (".$c->id.") non existe ");
				}
			} else throw new \Exception($data->msg);
		} finally {
			if ($socket!=null) $socket->close();
		}
	}


	/** Create a new Computer Object by submitted data
	*/
	private function makeComputer(Request $request) {
		$rol=$this->getUser()->getRol();
		$data=json_decode($request->request->get("params"),true);
		$entityManager = $this->getDoctrine()->getManager();
	
		if (!isset($data["description"]) || ($data["description"]==null)) throw new \Exception("La descripción no puede ser nula");
		if ($data["id"]!="") {
			$computer=$entityManager->find("App\Entity\Computer",$data["id"]);
			if ($computer==null) throw new \Exception("No se encuentra el equipo");
		} else {
			$computer=new Computer();
			$computer->addRole($rol);
			$rol->addComputer($computer);
		}
		$computer->setDescription($data["description"]);
		$computer->setDomainname($data["domainname"]);
		if (isset($data["ip"])) $computer->setIp($data["ip"]);
		$computer->setMac($data["mac"]);
		return $computer;
	}
}
