<?php
/** ServiceController.
		Actions:
			/list/services.json
			/list/service/roles.json
			/update/service/roles
			/save/service
			/delete/service
*/

namespace App\Controller;

use App\Entity\Service;
use App\Entity\Rol;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;

class ServiceController extends Controller {

	/** 
	 * @Route("/list/services.json", name="l_services")
	 */
	public function listServicesAction() {
		$user=$this->getUser();
		$portlist=Service::getServices($user);
		return $this->json($portlist);
	}

	/** 
	 * @Route("/list/service/roles.json", name="l_service_roles")
	 */
	public function listServiceRolesAction(Request $request) {
		$user=$this->getUser();
		$entityManager = $this->getDoctrine()->getManager();
		$service=$entityManager->find("App\Entity\Service",$request->get("id"));
		$allroles=$this->getDoctrine()->getRepository(Rol::class)->findAll();
		return $this->json(Rol::arrayRoles($allroles,$service->getRoles())["all"]);
	}

	/**
	* @Route("/update/service/roles", name="u_service_roles")
	*/
	public function updateServiceRoles(Request $request) {
		$entityManager = $this->getDoctrine()->getManager();
		$serviceEntity = $entityManager->getRepository(Service::class);
		$rolEntity = $entityManager->getRepository(Rol::class);
		$service=$serviceEntity->find($request->get("id"));
		$allroles = $rolEntity->findAll();

		$roleIds=json_decode($request->get("roles"));

		foreach($service->getRoles() as $rol) {
			if (!in_array($rol->getId(),$roleIds)) {
				$service->removeRole($rol);
				$rol->removeService($service);
			}
		}
		foreach($roleIds as $id) {
			$rol=$rolEntity->find($id);
			$service->addRole($rol);
			$rol->addService($service);
			$entityManager->persist($rol);
		}
		$entityManager->persist($service);
		$entityManager->flush();
		return $this->json(Rol::arrayRoles($allroles,$service->getRoles())["all"]);
	}

	/** 
	* @Route("/save/service", name="s_service")
	*/
	public function saveServiceAction(Request $request) {
		try {
			$service=new Service();
			$params=json_decode($request->request->get("params"),true);
			$entityManager = $this->getDoctrine()->getManager();
			$service->setName($params["name"]);
			$service->setPort($params["port"]);
			$rol=$this->getUser()->getRol();
			$service->addRole($rol);
			$rol->addService($service);
			$entityManager->persist($service);
			$entityManager->flush();
		} catch (\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
		return $this->listServicesAction();
	}

	/** 
	* @Route("/delete/service", name="d_service")
	*/
	public function delServiceAction(Request $request) {
		try {
			$entityManager = $this->getDoctrine()->getManager();

			$list=json_decode($request->request->get("params"));
			foreach($list as $idcomputer) {
				$service=$entityManager->find("App\Entity\Service",$idcomputer);
				$entityManager->remove($service);
			}
			$entityManager->flush();
			return $this->listServicesAction();
		} catch(ForeignKeyConstraintViolationException $e) {
			return $this->json(array("ok"=>"false","msg"=>"Existen registros relacionados","code"=>$e->getCode()));
		} catch(\Exception $e) {
			//throw new \Exception($e->getMessage());
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
	}
}
