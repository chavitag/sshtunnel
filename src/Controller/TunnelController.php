<?php
/** Main Controller.
		Actions:
			/   						-	Main Page
			/list/tunnels.json	-	Gets the list of tunnels what a user can use
			/save/tunnel
			/delete/tunnel
			/change/tunnel
*/

namespace App\Controller;

use App\Exceptions\FacadeException;
use App\Exceptions\NetworkException;
use App\Entity\Tunnel;
use App\Entity\UserTunnels;
use App\Entity\Computer;
use App\Entity\Service;
use App\Entity\Rol;
use App\Utils\JSON;
use App\Utils\Socket;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;

class TunnelController extends FacadeController {
	/**
	* @Route("/", name="index")
	*/
	public function index(Request $request) {
		$user=$this->getUser();
		$this->update();
		$tunnels=Tunnel::getTunnels($user);
		$tunnels["rows"]=$this->sortTunnels($tunnels["rows"],$request);

		return $this->render('index.html.twig',
			array(
				"user"=>$user,
				"services"=>Service::getServices($user),
				"tunnels"=>$tunnels,
				"computers"=>Computer::getComputers($user),
			)
		);
	}

	/**
	*	@Route("/list/tunnels.json",name="l_tunnels")
	*/
	public function listTunnelsAction(Request $request=null) {
		$data=Tunnel::getTunnels($this->getUser());
		$data["rows"]=$this->sortTunnels($data["rows"],$request);
		return $this->json($data);
	}

	private function sortTunnels($data,$request) {
	// Order by criteria....

		$params=$this->getOrder();
		$field=null;
		$order=null;
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

		return $this->dataSort($data,$field,$order);
	}
	
	/** 
	* @Route("/save/tunnel", name="s_tunnel")
	*/
	public function saveTunnelAction(Request $request) {
		try {
			$tunnel=(new Tunnel())->initTunnel($this->getUser(),json_decode($request->request->get("params"),true),$this->getDoctrine());
			if ($tunnel==null) throw new \Exception("El túnel ya existe");
			$entityManager = $this->getDoctrine()->getManager();
			$entityManager->persist($tunnel);
			$entityManager->flush();
		} catch (\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
		return $this->listTunnelsAction();
	}

	/** 
	* @Route("/delete/tunnel", name="d_tunnel")
	*/
	public function delTunnelAction(Request $request) {
		try {
			$user=$this->getUser();
			$usertunnels=$user->getTunnels();
			$list=json_decode($request->request->get("params"));
			$entityManager = $this->getDoctrine()->getManager();
			foreach($usertunnels as $u_tunnel) {
				$t=$u_tunnel->getTunnel();
				$id=$t->getId();
				if (in_array($id,$list)) {
					if (!$u_tunnel->isRunning()) {
						$user->removeTunnel($u_tunnel);
						$t->removeUser($u_tunnel);
						$l=$t->getUsers();
						if (count($l) > 0)	$entityManager->persist($t);
						else 						$entityManager->remove($t);
						$entityManager->remove($u_tunnel);
					} else throw new \Exception("No se pueden borrar túneles activos");
				}
				$entityManager->persist($user);
			}
			$entityManager->flush();
			return $this->listTunnelsAction();
		} catch(\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
	}

	/** 
	* @Route("/change/tunnel", name="c_tunnel")
	*/
	public function changeTunnelAction(Request $request) {
		try {
			$doctrine=$this->getDoctrine();
			$entityManager=$doctrine->getManager();
			$tunnelid=$request->request->get("id");
			$tunnelstatus=$request->request->get("status");
			$data=$this->info();
			$tun=UserTunnels::getInstance($doctrine,$this->getUser(),$tunnelid);
			$tun->setRunning($tunnelstatus=="true");

			// Check tunnel status, don't delete opened tunnels
			$tunnel=$tun->getTunnel();
			$entityManager->persist($tun);

			if (!$tun->isRunning()) {
				$users=$tunnel->getUsers();
				foreach($users as $user) {
					$tun=UserTunnels::getInstance($doctrine,$user->getUser(),$tunnelid);
					if (($tun!=null)&&($tun->isRunning())) {
						$entityManager->flush();
						return $this->json(array("ok"=>"false","msg"=>"Another user is running this tunnel","code"=>0));
					}
				}
			}
			$tunnel->setStarted($tunnelstatus=="true");
			$entityManager->persist($tunnel);
			$entityManager->flush();
			return $this->update(array("command"=>"change_tunnel_status","id"=>intval($tunnelid),"status"=>($tunnelstatus=="true")),false);
		} catch(\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
	}
}
