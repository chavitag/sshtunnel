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
	public function listComputersAction() {
		$data=Computer::getComputers($this->getUser());
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
		return $this->verifyComputerAction();
	}

	/** 
	* @Route("/delete/computer", name="d_computer")
	*/
	public function delComputerAction(Request $request) {
		try {
			$entityManager = $this->getDoctrine()->getManager();

			$list=json_decode($request->request->get("params"));
			foreach($list as $idcomputer) {
				$computer=$entityManager->find("App\Entity\Computer",$idcomputer);
				$entityManager->remove($computer);
			}
			$entityManager->flush();
			return $this->verifyComputerAction();
		} catch(ForeignKeyConstraintViolationException $e) {
			return $this->json(array("ok"=>"false","msg"=>"Existen registros relacionados","code"=>$e->getCode()));
		} catch(\Exception $e) {
			//throw new \Exception($e->getMessage());
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
	}

	/** 
	* @Route("/change/switchcomputer", name="sw_computer")
	*/
	public function switchComputerAction(Request $request) {
		$socket=null;
		try {
			if ($request!=null) {
				// Verificar si queremos encenderlo....
				$computerid=$request->request->get("id");
				$data=array();
				if ($computerid!=null) {
					$computerstatus=$request->request->get("status");
					$data["ok"]="true";
					$data["action"]=array();
					$data["action"]["command"]="change_computer_status";
					$data["action"]["id"]=intval($computerid);
					$data["action"]["status"]=($computerstatus=="true");

					$entityManager = $this->getDoctrine()->getManager();
					$computer=$entityManager->find("App\Entity\Computer",$computerid);

					//$data["computers"][]=JSON::encode($computer,array("users","roles","tunnels"));
					$data["tunnels"]=array();
					$data["computers"][0]["id"]=$computerid;
					$data["computers"][0]["ip"]=$computer->getIp();
					$data["computers"][0]["domainname"]=$computer->getDomainname();
					$data["computers"][0]["description"]=$computer->getDescription();
					$data["computers"][0]["mac"]=$computer->getMac();
					$data["computers"][0]["status"]=null;
					$data["computers"][0]["startTime"]=0;

					$socket=new Socket(FacadeController::$config["COMMIP"],FacadeController::$config["COMMPORT"]);
					$socket->send(json_encode($data));
					$info=$socket->receive(65535);

					$data=json_decode($info);
					if ($data->ok) {
						$doctrine=$this->getDoctrine();
						foreach($data->computers as $c) {
							$computer=Computer::getInstance($doctrine,$c->id);
							$computer->setStatus($c->status);
							$computer->setStartTime($c->startTime);
						}
					}
					return $this->listComputersAction();
				}
			}
			throw new Exception("Equipo descoñecido");
		} catch(Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		} finally {
			if ($socket!=null) $socket->close();
		}
	}

	/** 
	* @Route("/status/checkcomputer", name="ck_computer")
	*/
	public function checkComputerAction(Request $request) {
		$socket=null;
		try {
			$doctrine=$this->getDoctrine();
			$data=$this->info(false);
			if ($request!=null) {
				// Verificar si queremos encenderlo....
				$computerid=$request->request->get("id");
				if ($computerid!=null) {
					$computerstatus=$request->request->get("status");
					$data["action"]=array();
					$data["action"]["command"]="change_computer_status";
					$data["action"]["id"]=intval($computerid);
					$data["action"]["status"]=($computerstatus=="true");
				}

				$computer=$request->request->get("computer");
				if ($computer!=null) {
					preg_match('/\s\[(.*)\]$/',$computer,$match);
					$host=$doctrine->getRepository(Computer::class)->findOneBy(array("ip"=>$match[1]));
					$data["computers"]=array($host);
					$socket=new Socket(FacadeController::$config["COMMIP"],FacadeController::$config["COMMPORT"]);
					$socket->send(JSON::encode($data,array("users","roles","tunnels")));
					$info=$socket->receive(65535);

					$data=json_decode($info);

					$status=null;
					if ($data->ok) {
						$status=array("total"=>1,"rows"=>array(array("id"=>$host->getId(),"domain"=>$host->getDomainname(),"ip"=>$host->getIp(),"description"=>$host->getDescription(),"mac"=>$host->getMac(),"running"=>$data->computers[0]->status,"startTime"=>$data->computers[0]->startTime)));
						return $this->json($status);
					} 
					throw new Exception("Non se atopa $computer");
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
	* Route("/change/computer", name="c_computer")
	* Route("/status/computers", name="st_computer")
	*/
	/*public function verifyComputerAction(Request $request=null) {
		$socket=null;
		try {
			$data=$this->info(true);
			if ($request!=null) {
				$computerid=$request->request->get("id");
				if ($computerid!=null) {
					$computerstatus=$request->request->get("status");
					$data["action"]=array();
					$data["action"]["command"]="change_computer_status";
					$data["action"]["id"]=intval($computerid);
					$data["action"]["status"]=($computerstatus=="true");
				}
			}

			$socket=new Socket(FacadeController::$config["COMMIP"],FacadeController::$config["COMMPORT"]);
			$socket->send(JSON::encode($data,array("users","roles","tunnels")));
			$info=$socket->receive(65535);
			$data=json_decode($info);

			if ($data->ok) {
				$doctrine=$this->getDoctrine();
				foreach($data->computers as $c) {
					$computer=Computer::getInstance($doctrine,$c->id);
					$computer->setStatus($c->status);
					$computer->setStartTime($c->startTime);
				}
			}
			return $this->listComputersAction();
		} catch(\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		} finally {
			if ($socket!=null) $socket->close();
		}
	}*/

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
