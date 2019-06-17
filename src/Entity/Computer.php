<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;


/**
 * @ORM\Entity(repositoryClass="App\Repository\ComputerRepository")
 * UniqueEntity(fields="ip", message="A IP xa existe.")
 * UniqueEntity(fields="mac", message="A MAC xa existe.")
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
     * @ORM\Column(type="string", length=15, unique=true)
     */
    private $ip;

    /**
     * @ORM\Column(type="string", length=128, nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=17, nullable=true, unique=true)
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

	 private $session;

	 private $startTime;

	 private $scan;

	 private $lastscan;

	 private $locked;

    public function __construct()
    {
//$this->session = new Session();
//$this->session->start();
		$this->scan = false;
		$this->lastscan=0;
		$this->status = false;
		$this->roles = new ArrayCollection();
		$this->tunnels = new ArrayCollection();
		$this->locked=false;
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
		  if ($this->mac==null) return "";
        return $this->mac;
    }

    public function setMac(?string $mac): self
    {
		  if ($mac=="") $this->mac=null;
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
		$this->session = new Session();
		$this->status = $this->session->get("status_".$this->id,0);
		return $this->status;
	}

	public function setStatus($status) {
		$this->session = new Session();
		$this->session->set("status_".$this->id,$status);
		$this->status=$status;
	}

	public function setStartTime($time) {
		$this->session = new Session();
		$this->session->set("start_".$this->id,$time);
		$this->startTime=$time;
	}

	public function getStartTime() {
		$this->session = new Session();
		$this->startTime=$this->session->get("start_".$this->id,0);
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

	public function setScan($onoff) {
		if ($onoff==true) $this->scan=true;
		else              $this->scan=false;
	}

	public function getScan() {
		return $this->scan;
	}

	public function getLastscan() {
		if (!defined($this->lastscan)) $this->lastscan=0;
		return $this->lastscan;
	}

	public function setLastscan($time) {
		$this->lastscan=$time;
	}

	public function setLocked($lock) {
		$this->locked=$lock;
	}

	public function getLocked() {
		return $this->locked;
	}

	/** Gets available user computers, and returns an associative array formatted for bootstrap-table
	*/
	public static function getComputers($user) {
		if ($user==null)	throw new \Exception("Sesión no iniciada",-1);
		$computers=$user->getRol()->getComputers();
		$data=array("total"=>count($computers),"rows"=>array());
		foreach($computers as $c) {
			$row=array("id"=>$c->getId(),"domain"=>$c->getDomainname(),"ip"=>$c->getIp(),"description"=>$c->getDescription(),"mac"=>$c->getMac(),"status"=>$c->getStatus(),"startTime"=>$c->getStartTime(),"scan"=>false,"locked"=>$c->locked,"lastScan"=>$c->getLastScan());
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
