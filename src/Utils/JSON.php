<?php
namespace App\Utils;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class JSON {
	public static function makeResponse($json) {
		$response=new Response('Content',Response::HTTP_OK,array('content-type' => 'application/json'));
		$response->setContent($json);
		return $response;
	}

	public static function encode($data,$exclude=null) {
		$normalizer = new ObjectNormalizer();
		if ($exclude !== null) $normalizer->setIgnoredAttributes($exclude);
		$encoder = new JsonEncoder();
		$serializer = new Serializer(array($normalizer), array($encoder));
		return $serializer->serialize($data, 'json'); 
	}
}

