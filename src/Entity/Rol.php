<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RolRepository")
 * @ORM\Table(name="roles")
 */
class Rol
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
     * @ORM\Column(type="string", length=8)
     */
    private $rol;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Service", mappedBy="roles")
     */
    private $services;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\User", mappedBy="rol")
     */
    private $users;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Computer", mappedBy="roles")
     * @ORM\OrderBy({"ip" = "ASC"})
     */
    private $computers;

    public function __construct()
    {
        $this->services = new ArrayCollection();
        $this->users = new ArrayCollection();
        $this->computers = new ArrayCollection();
    }

 	 public function __get($property) {
            if (property_exists($this, $property)) {
                return $this->$property;
            }
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

    public function getRol(): ?string
    {
        return $this->rol;
    }

    public function setRol(string $rol): self
    {
        $this->rol = $rol;

        return $this;
    }

    /**
     * @return Collection|Service[]
     */
    public function getServices(): Collection
    {
        return $this->services;
    }

    public function addService(Service $service): self
    {
        if (!$this->services->contains($service)) {
            $this->services[] = $service;
            $service->addRole($this);
        }

        return $this;
    }

    public function removeService(Service $service): self
    {
        if ($this->services->contains($service)) {
            $this->services->removeElement($service);
            $service->removeRole($this);
        }

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->setRol($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            // set the owning side to null (unless already changed)
            if ($user->getRol() === $this) {
                $user->setRol(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Computer[]
     */
    public function getComputers(): Collection
    {
        return $this->computers;
    }

    public function addComputer(Computer $computer): self
    {
        if (!$this->computers->contains($computer)) {
            $this->computers[] = $computer;
            $computer->addRole($this);
        }

        return $this;
    }

    public function removeComputer(Computer $computer): self
    {
        if ($this->computers->contains($computer)) {
            $this->computers->removeElement($computer);
            $computer->removeRole($this);
        }

        return $this;
    }

	public static function arrayRoles($roles,$selected=null) {
		$init=false;
		if ($selected!=null) $datas=array("total"=>count($selected),"rows"=>array());
		else 						$datas=array("total"=>0,"rows"=>array());
		$data=array("total"=>count($roles),"rows"=>array());
		foreach($roles as $idx=>$r) {
			$sel="false";
			if ($selected!=null) {
				foreach($selected as $rs) {
					if ($rs->id ==  $r->id) {
						$sel="true";
						if ($init) break;
					}
					if (!$init) $datas["rows"][]=array("id"=>$rs->id,"name"=>$rs->name,"rol"=>$rs->rol);
				}
				$init=true;
			}
			$row=array("id"=>$r->id,"name"=>$r->name,"rol"=>$r->rol,"selected"=>$sel);
			/*if ($r->rol == "ADMIN") {
				$row["selected"]="true";
				$row["disabled"]="true";
			}*/
			$data["rows"][]=$row;
		}
		return array("all"=>$data,"selected"=>$datas);
	}
}
