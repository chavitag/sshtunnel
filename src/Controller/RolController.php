<?php
/** RolController.
		Actions:
			/list/roles.json
			/save/rol
			/delete/rol
*/

namespace App\Controller;

use App\Entity\Rol;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;

class RolController extends Controller {
	/** 
	 * @Route("/list/roles.json", name="l_roles")
	 */
	public function listRolesAction() {
		$roles=$this->getDoctrine()->getRepository(Rol::class)->findAll();
		return $this->json(Rol::arrayRoles($roles)["all"]);
	}


	/** 
	* @Route("/save/rol", name="s_rol")
	*/
	public function saveRoleAction(Request $request) {
		try {
			$role=new Rol();
			$params=json_decode($request->request->get("params"),true);
			$entityManager = $this->getDoctrine()->getManager();
			$role->setName($params["name"]);
			$role->setRol($params["rol"]);
			$entityManager->persist($role);
			$entityManager->flush();
		} catch (\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
		return $this->listRolesAction();
	}


	/** 
	* @Route("/delete/rol", name="d_rol")
	*/
	public function delRoleAction(Request $request) {
		try {
			$user=$this->getUser();
			$entityManager = $this->getDoctrine()->getManager();

			$list=json_decode($request->request->get("params"));
			foreach($list as $idrol) {
				$rol=$entityManager->find("App\Entity\Rol",$idrol);
				if ($rol->getRol()=="ADMIN") throw new \Exception("No se puede eliminar el rol ADMIN");
				$entityManager->remove($rol);
			}
			$entityManager->flush();
			return $this->listRolesAction();
		} catch(ForeignKeyConstraintViolationException $e) {
			return $this->json(array("ok"=>"false","msg"=>"Existen registros relacionados","code"=>$e->getCode()));
		} catch(\Exception $e) {
			//throw new \Exception($e->getMessage());
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
	}

}
