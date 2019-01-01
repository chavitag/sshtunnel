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
		return $this->listComputersAction();
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
			return $this->listComputersAction();
		} catch(ForeignKeyConstraintViolationException $e) {
			return $this->json(array("ok"=>"false","msg"=>"Existen registros relacionados","code"=>$e->getCode()));
		} catch(\Exception $e) {
			//throw new \Exception($e->getMessage());
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
	}

	/** 
	* @Route("/change/computer", name="c_computer")
	*/
	public function switchComputerAction(Request $request) {
		$socket=null;
		try {
			$computerid=$request->request->get("id");
			$computerstatus=$request->request->get("status");
			$data=$this->info(true);
			$data["action"]=array();
			$data["action"]["command"]="change_computer_status";
			$data["action"]["id"]=intval($computerid);
			$data["action"]["status"]=($computerstatus=="true");

			$socket=new Socket(SSHGATEWAY,SSHGATEWAY_PORT);
			$socket->send(JSON::encode($data,array("users","roles","tunnels")));
			$data=json_decode($socket->receive());

			if ($data->ok) {
				foreach($data->computers as $c) {
					$computer=Computer::getInstance($c->id);
					$computer->setStatus($c->status);
				}
			}
			return $this->listComputersAction();
		} catch(\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
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
