<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ServiceRepository")
 * @ORM\Table(name="services")
 */
class Service
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=32)
     */
    private $name;

    /**
     * @ORM\Column(type="smallint")
     */
    private $port;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Rol", inversedBy="services")
     */
    private $roles;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserTunnels", mappedBy="service", orphanRemoval=true)
     */
    private $userTunnels;

    public function __construct()
    {
        $this->roles = new ArrayCollection();
        $this->userTunnels = new ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPort(): ?int
    {
        return $this->port;
    }

    public function setPort(int $port): self
    {
        $this->port = $port;

        return $this;
    }

    /**
     * @return Collection|Rol[]
     */
    public function getRoles(): Collection
    {
        return $this->roles;
    }

    public function addRole(Rol $role): self
    {
        if (!$this->roles->contains($role)) {
            $this->roles[] = $role;
        }

        return $this;
    }

	public function __toString() {
		return '{"id":'.$this->id.',"name":"'.$this->name.'","port":"'.$this->port.'"}';
	}

    public function removeRole(Rol $role): self
    {
        if ($this->roles->contains($role)) {
            $this->roles->removeElement($role);
        }

        return $this;
    }

    /**
     * @return Collection|UserTunnels[]
     */
    public function getUserTunnels(): Collection
    {
        return $this->userTunnels;
    }

    public function addUserTunnel(UserTunnels $userTunnel): self
    {
        if (!$this->userTunnels->contains($userTunnel)) {
            $this->userTunnels[] = $userTunnel;
            $userTunnel->setService($this);
        }

        return $this;
    }

    public function removeUserTunnel(UserTunnels $userTunnel): self
    {
        if ($this->userTunnels->contains($userTunnel)) {
            $this->userTunnels->removeElement($userTunnel);
            // set the owning side to null (unless already changed)
            if ($userTunnel->getService() === $this) {
                $userTunnel->setService(null);
            }
        }

        return $this;
    }


	/** Gets available user services and returns an associative array formatted for bootstrap-table
	*/
	public static function getServices($user=null) {
		if ($user!=null)	$portlist=$user->getRol()->getServices();
		else 					$portlist=$this->getDoctrine()->getRepository(Service::class)->findAll();
		$data=array("total"=>count($portlist),"rows"=>array());
		foreach($portlist as $port) {
			$row=array("id"=>$port->getId(), "port"=>$port->getPort(), "name"=>$port->getName());
			$data["rows"][]=$row;
		}
		return $data;
	}
}
