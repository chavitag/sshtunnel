<?php

namespace App\Controller;

use App\Form\UserForm;
use App\Entity\User;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;


class LoginController extends Controller {
	/**
	* @Route("/login", name="login")
	*/
	public function login(Request $request, AuthenticationUtils $authenticationUtils) {
		$error = $authenticationUtils->getLastAuthenticationError();	// Login Error
		$lastUsername = $authenticationUtils->getLastUsername();			// Last username 

		return $this->render('login/login.html.twig', array(
			'last_username' => $lastUsername,
			'error'         => $error,
		));
	}

	/** User Registration
	*
	* @Route("/register", name="user_registration")
	*/
	public function register(Request $request, UserPasswordEncoderInterface $passwordEncoder)	{

        // 1) build the form
        $user = new User();
        $form = $this->createForm(UserForm::class, $user);

        // 2) handle the submit (will only happen on POST)
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            // 3) Encode the password (you could also do this via Doctrine listener)
            $password = $passwordEncoder->encodePassword($user, $user->getPassword());
            $user->setPassword($password);
				$user->setHash(md5($user->getPassword()));

            // 4) save the User!
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($user);
            $entityManager->flush();

            // ... do any other work - like sending them an email, etc
            // maybe set a "flash" success message for the user

            return $this->redirectToRoute('index');
        }
				
        return $this->render(
            'registration/register.html.twig',
            array('form' => $form->createView())
        );
    }

	/** Returns twig template for twigjs....
	*
	* @Route("/templates/{folder}/{filename}", name="templates")
	*/
	public function getTemplate(Request $request,$folder,$filename="") {
		$user=$this->getUser();
		if ($user==null) return $this->json(array("ok"=>"false","msg"=>"La sesión ha finalizado","code"=>0));
		$appPath = $this->container->getParameter('kernel.root_dir');
		if ($filename=="")	$filename=$appPath."/../templates/$folder";
		else 						$filename=$appPath."/../templates/$folder/$filename";
		$template=file_get_contents($filename);
		if ($template!==false) {
			$response=new Response('Content',Response::HTTP_OK,array('content-type' => 'text/html'));
			$response->setContent($template);
			$response->headers->set('Content-Type', 'text/plain');
			$response->prepare($request);
		} else {
			$response=$this->json(array("ok"=>"false","msg"=>"No se encuentra $folder/$filename","code"=>0));
		}
		return $response;
   }
}
