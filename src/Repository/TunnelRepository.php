<?php

namespace App\Repository;

use App\Entity\Tunnel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Tunnel|null find($id, $lockMode = null, $lockVersion = null)
 * @method Tunnel|null findOneBy(array $criteria, array $orderBy = null)
 * @method Tunnel[]    findAll()
 * @method Tunnel[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TunnelRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Tunnel::class);
    }

//    /**
//     * @return Tunnel[] Returns an array of Tunnel objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Tunnel
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
