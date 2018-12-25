<?php

namespace App\Entity;

use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\Table(name="users")
 */
class User implements UserInterface, \Serializable
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
     * @ORM\Column(type="string", length=16)
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $password;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Rol", inversedBy="users")
     * @ORM\JoinColumn(nullable=false)
     */
    private $rol;

    /**
     * @ORM\Column(type="string", length=128)
     */
    private $hash;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserTunnels", mappedBy="user", orphanRemoval=true)
     */
    private $tunnels;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isactive;

    public function __construct()
    {
        $this->tunnels = new ArrayCollection();
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

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getRol(): ?Rol
    {
        return $this->rol;
    }

    public function setRol(?Rol $rol): self
    {
        $this->rol = $rol;

        return $this;
    }

    public function getHash(): ?string
    {
        return $this->hash;
    }

    public function setHash(string $hash): self
    {
        $this->hash = $hash;

        return $this;
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
            $tunnel->setUser($this);
        }

        return $this;
    }

    public function removeTunnel(UserTunnels $tunnel): self
    {
        if ($this->tunnels->contains($tunnel)) {
            $this->tunnels->removeElement($tunnel);
            // set the owning side to null (unless already changed)
            if ($tunnel->getUser() === $this) {
                $tunnel->setUser(null);
            }
        }

        return $this;
    }

    public function getIsactive(): ?bool
    {
        return $this->isactive;
    }

    public function setIsactive(bool $isactive): self
    {
        $this->isactive = $isactive;

        return $this;
    }

	// Implements interfaces and abstract classes
	//
    public function getSalt()
    {
        // you *may* need a real salt depending on your encoder
        // see section on salt below
        return null;
    }

    public function getRoles()
    {
		$listroles=array("ROLE_USER");
		$rol=$this->getRol()->getRol();
		switch($rol) {
			case "ADMIN": 
				$listroles[]="ROLE_ADMIN";
				break;
		}
		return $listroles;
    }

    public function eraseCredentials()
    {
	    return null;
    }

	/** @see \Serializable::serialize() */
    public function serialize()
    {
        return serialize(array(
            $this->id,
            $this->username,
            $this->password,
            // see section on salt below
            // $this->salt,
        ));
    }

    /** @see \Serializable::unserialize() */
    public function unserialize($serialized)
    {
        list (
            $this->id,
            $this->username,
            $this->password,
            // see section on salt below
            // $this->salt
        ) = unserialize($serialized, array('allowed_classes' => false));
    }
}
