<?php
/** RolController.
		Actions:
			/list/roles.json
			/save/rol
			/delete/rol
*/

namespace App\Controller;

use App\Entity\User;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserController extends Controller {
	/** 
	 * @Route("/list/users", name="l_users")
	 */
	public function listUsersAction() {
		$users=$this->getDoctrine()->getRepository(User::class)->findAll();
		return $this->json(User::arrayUsers($users)["all"]);
	}

	/**
	* @Route("/save/user",name="s_users")
	*/
	public function saveUserAction(Request $request,UserPasswordEncoderInterface $passwordEncoder) {
		try {
			$user=$this->makeUser($request,$passwordEncoder);
			$entityManager = $this->getDoctrine()->getManager();
			$entityManager->persist($user);
			$entityManager->flush();
		} catch (\Exception $e) {
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
		return $this->listUsersAction();
	}

	/** 
	* @Route("/delete/user", name="d_user")
	*/
	public function delUserAction(Request $request) {
		try {
			$user=$this->getUser();
			$entityManager = $this->getDoctrine()->getManager();

			$list=json_decode($request->request->get("params"));
			foreach($list as $iduser) {
				if ($iduser==$user->getId()) throw new \Exception("Non te podes eliminar a ti mesmo");
				$user=$entityManager->find("App\Entity\User",$iduser);
				$entityManager->remove($user);
			}
			$entityManager->flush();
			return $this->listUsersAction();
		} catch(ForeignKeyConstraintViolationException $e) {
			return $this->json(array("ok"=>"false","msg"=>"Existen rexistros relacionados","code"=>$e->getCode()));
		} catch(\Exception $e) {
			//throw new \Exception($e->getMessage());
			return $this->json(array("ok"=>"false","msg"=>$e->getMessage(),"code"=>$e->getCode()));
		}
	}

	/** Create a new Computer Object by submitted data
	*/
	private function makeUser(Request $request,UserPasswordEncoderInterface $passwordEncoder) {
		$actual_user=$this->getUser();
		$data=json_decode($request->request->get("params"),true);
		$newpass=$data["password"];
		$nick=$data["username"];
		$name=$data["name"];
		$password=null;
		if (!isset($data["isactive"])) $data["isactive"]="off"; 
		if ($name=="") throw new \Exception("Debes indicar un nome"); 
		if ($nick=="") throw new \Exception("Debes indicar un usuario");


		if ($actual_user->getRol()->getRol()!="ADMIN") {
			if ($newpass!="") $actual_user->setPassword($newpass);
			$actual_user->setName($name);
		} else {
			$entityManager = $this->getDoctrine()->getManager();
			if ($data["id"]!="") {
				$actual_user=$entityManager->find("App\Entity\User",$data["id"]);
				if ($actual_user==null) throw new \Exception("Usuario no existente");
			} else {
				$actual_user=new User();
				$actual_user->setUsername($nick);
			}
			if ($newpass!="") $actual_user->setPassword($newpass);
			$actual_user->setName($name);
			$actual_user->setIsActive($data["isactive"]=="on");
			$rol=$entityManager->find("App\Entity\Rol",$data["roles"]);
			if ($rol==null) throw new \Exception("Debes indicar un rol");
			$actual_user->setRol($rol);
		}
		if ($newpass!="") {
			$password = $passwordEncoder->encodePassword($actual_user, $newpass);
			$actual_user->setPassword($password);
		}
		$actual_user->setHash(md5($actual_user->getPassword()));
		return $actual_user;
	}
}
