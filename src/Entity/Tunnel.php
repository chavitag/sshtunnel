<?php

namespace App\Entity;

use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\PropertyAccess\Exception\NoSuchPropertyException;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use App\Controller\FacadeController;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TunnelRepository")
 * @ORM\Table(name="tunnels")
 */
class Tunnel {

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="smallint",options={"unsigned":true})
     */
    private $sourceport;

    /**
     * @ORM\Column(type="smallint",options={"unsigned":true})
     */
    private $destport;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $ip;

    /**
     * @ORM\Column(type="boolean")
     */
    private $started;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserTunnels", mappedBy="tunnel", orphanRemoval=true, cascade="persist")
     */
    private $users;

	private $monitor;

    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    public function getSourceport(): ?int
    {
        return $this->sourceport;
    }

    public function setSourceport(int $sourceport): self
    {
        $this->sourceport = $sourceport;

        return $this;
    }

    public function getDestport(): ?int
    {
        return $this->destport;
    }

    public function setDestport(int $destport): self
    {
        $this->destport = $destport;

        return $this;
    }

    public function getIp(): ?string
    {
        return $this->ip;
    }

    public function setIp(string $ip): self
    {
        $this->ip = $ip;

        return $this;
    }

    public function getStarted(): ?bool
    {
        return $this->started;
    }

    public function setStarted(bool $started): self
    {
        $this->started = $started;

        return $this;
    }

	public function setMonitor($monitor) {
		$this->monitor=$monitor;
	}

	public function getMonitor() {
		return $this->monitor;
	}

    /**
     * @return Collection|UserTunnels[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(UserTunnels $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->setTunnel($this);
        }

        return $this;
    }

    public function removeUser(UserTunnels $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            // set the owning side to null (unless already changed)
            if ($user->getTunnel() === $this) {
                $user->setTunnel(null);
            }
        }
        return $this;
    }

	public function setAttributes(array $params) {
		$propertyAccessor = PropertyAccess::createPropertyAccessor();
		foreach($params as $k=>$v) {
			try {
				// Chapuza para unificar os nomes das táboas de ordenadores e do select
				// computers --> ip
				// computers-row-id --> ip-row-id
				if ($k=="computers") $propertyAccessor->setValue($this,"ip",$v);
				else 						$propertyAccessor->setValue($this, $k,$v);
			} catch (NoSuchPropertyException $e) { } 
		}
	}

	// Comparable
	public function compareTo(Tunnel $tunnel) {
		if (($tunnel->getDestport() == $this->destport) && ($tunnel->getIp() == $this->ip)) return 0;
		if ($tunnel->getDestport() == $this->destport) {
			if ($tunnel->getIp() > $this->ip) return -1;
			return 1;
		}
		if ($tunnel->getDestport() > $this->destport) return -1;
		return 1;
	}


	/** Gets User tunnels and returns an asssociative array formated for bootstrap-table
			do=get_tunnels
	*/
	public static function getTunnels($user) {
		if ($user==null)	throw new \Exception("Sesión no iniciada",-1);
		$tunnels=$user->getTunnels();  // Usertunnels
		$data=array("total"=>count($tunnels),"rows"=>array());
		foreach($tunnels as $tr) {
			$t=$tr->getTunnel();
			$c=$tr->getComputer();
			$s=$tr->getService();
			$data["rows"][]=array(	"id"=>$t->getId(),
											"description"=>$tr->getDescription(),
											"destination"=>$c->getDomainname()." [".$c->getIp()."]",
											"dport"=>$s->getName()." [".$s->getPort()."]",
											"url"=>FacadeController::$config["SSHGATEWAY"].":".$t->getSourceport(),
											"status"=>$tr->isRunning());
		}
		return $data;
	}

	/** Create a new Tunnel Object by submitted data
	*/
	public function initTunnel($user,$data,$doctrine) {
		//$entityManager = $this->getDoctrine()->getManager();
		$entityManager=$doctrine->getManager();
		if (!isset($data["description"]) || ($data["description"]==null)) throw new \Exception("La descripción no puede ser nula");

		$ports=array();

		$this->setAttributes($data);
		$this->setStarted(false);
		if ($this->getIp()=="") throw new \Exception("Debes especificar un equipo de destino");

		$usertunnel=new UserTunnels();
		$usertunnel->setUser($user);
		$usertunnel->setDescription($data["description"]);
		$usertunnel->setRunning(false);
	
		$usertunnel->setComputer($entityManager->getReference(Computer::class,$data["computers-row-id"]));
		$usertunnel->setService($entityManager->getReference(Service::class,$data["destport-row-id"]));

		$this->addUser($usertunnel);
		$user->addTunnel($usertunnel);

		$listatunnels=$doctrine->getRepository(Tunnel::class)->findAll();
		foreach($listatunnels as $t) {
			if ($this->compareTo($t) == 0) {
				$users=$t->getUsers(); 
				foreach($users as $u) {
					if ($u->getUser()->getId()==$user->getId()) return null;
				}
				$t->addUser($usertunnel);
				return $t;
			}
			$p=$t->getSourceport();
			$ports[$p]=true;
		}
		for($pnum=64000; $pnum<65536; $pnum++) {
			if (!isset($ports[$pnum])||($ports[$p]!==true)) break;
		}
		if ($pnum<65536) {
			$this->setSourceport($pnum);
			return $this;
		}
		throw new \Exception("No se encuentra puerto libre",100);
	}

}
