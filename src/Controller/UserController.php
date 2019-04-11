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

class UserController extends Controller {
	/** 
	 * @Route("/list/users", name="l_users")
	 */
	public function listRolesAction() {
		$users=$this->getDoctrine()->getRepository(User::class)->findAll();
		return $this->json(User::arrayUsers($users)["all"]);
	}
}
