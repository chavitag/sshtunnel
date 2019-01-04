<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ComputerRepository")
 */
class Computer
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $domainname;

    /**
     * @ORM\Column(type="string", length=15)
     */
    private $ip;

    /**
     * @ORM\Column(type="string", length=128, nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=17, nullable=true)
     */
    private $mac;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Rol", inversedBy="computers")
     */
    private $roles;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserTunnels", mappedBy="computer", orphanRemoval=true)
     */
    private $tunnels;

	 private $status;

	 private $startTime;

    public function __construct()
    {
        $this->status = false;
		  $this->startTime = 0;
        $this->roles = new ArrayCollection();
        $this->tunnels = new ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    public function getDomainname(): ?string
    {
        return $this->domainname;
    }

    public function setDomainname(string $domainname): self
    {
        $this->domainname = $domainname;

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getMac(): ?string
    {
        return $this->mac;
    }

    public function setMac(?string $mac): self
    {
        $this->mac = $mac;

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

    public function removeRole(Rol $role): self
    {
        if ($this->roles->contains($role)) {
            $this->roles->removeElement($role);
        }

        return $this;
    }

	/** return true (Computer is running) / false (Computer is off)
	*/
	public function getStatus() {
		return $this->status;
	}

	public function setStatus($status) {
		$this->status=$status;
	}

	public function setStartTime($time) {
		$this->startTime=$time;
	}

	public function getStartTime() {
		return $this->startTime;
	}


    /**
     * @return Collection|UserTunnels[]
     */
    public function getTunnels(): Collection
    {
        return $this->tunnels;
    }

    public function addTunnel(UserTunnels $tunnel): self
    {
        if (!$this->tunnels->contains($tunnel)) {
            $this->tunnels[] = $tunnel;
            $tunnel->setComputer($this);
        }

        return $this;
    }

    public function removeTunnel(UserTunnels $tunnel): self
    {
        if ($this->tunnels->contains($tunnel)) {
            $this->tunnels->removeElement($tunnel);
            // set the owning side to null (unless already changed)
            if ($tunnel->getComputer() === $this) {
                $tunnel->setComputer(null);
            }
        }

        return $this;
    }

	/** Gets available user computers, and returns an associative array formatted for bootstrap-table
	*/
	public static function getComputers($user) {
		if ($user==null)	throw new \Exception("Sesión no iniciada");
		$computers=$user->getRol()->getComputers();
		$data=array("total"=>count($computers),"rows"=>array());
		foreach($computers as $c) {
			$row=array("id"=>$c->getId(),"domain"=>$c->getDomainname(),"ip"=>$c->getIp(),"description"=>$c->getDescription(),"mac"=>$c->getMac(),"running"=>$c->getStatus(),"startTime"=>$c->getStartTime());
			$data["rows"][]=$row;
		}
		return $data;
	}

	public static function getInstance($doctrine,$id) {
		try {
			return $doctrine->getRepository(Computer::class)->find($id);
		} catch(Exception $e) {
			throw new \Exception($e->getMessage());
		}
	}
}
