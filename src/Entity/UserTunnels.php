<?php

namespace App\Entity;

use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserTunnelsRepository")
 * @UniqueEntity(fields = {"user", "tunnel"},message="El túnel ya existe")
 */
class UserTunnels
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="tunnels", fetch="EAGER")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Tunnel", inversedBy="users", fetch="EAGER")
     * @ORM\JoinColumn(nullable=false)
     */
    private $tunnel;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $description;

    /**
     * @ORM\Column(type="boolean",options={"default":false})
     */
    private $running;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Service", inversedBy="userTunnels",fetch="EAGER")
     * @ORM\JoinColumn(nullable=false)
     */
    private $service;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Computer", inversedBy="tunnels",fetch="EAGER")
     * @ORM\JoinColumn(nullable=false)
     */
    private $computer;

    public function getId()
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getTunnel(): ?Tunnel
    {
        return $this->tunnel;
    }

    public function setTunnel(?Tunnel $tunnel): self
    {
        $this->tunnel = $tunnel;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getRunning(): ?bool
    {
        return $this->running;
    }

    public function setRunning(bool $running): self
    {
        $this->running = $running;

        return $this;
    }

    public function getService(): ?Service
    {
        return $this->service;
    }

    public function setService(?Service $service): self
    {
        $this->service = $service;

        return $this;
    }

    public function getComputer(): ?Computer
    {
        return $this->computer;
    }

    public function setComputer(?Computer $computer): self
    {
        $this->computer = $computer;

        return $this;
    }


	public static function getInstance($doctrine,$user,$id) {
		try {
			return $doctrine->getRepository(UserTunnels::class)->findOneBy(array("user"=>$user->getId(),"tunnel"=>$id));
		} catch(Exception $e) {
			throw new \Exception($e->getMessage());
		}
	}
}
