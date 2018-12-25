<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20180718230509 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE tunnels (id INT AUTO_INCREMENT NOT NULL, sourceport SMALLINT NOT NULL, destport SMALLINT NOT NULL, ip VARCHAR(16) NOT NULL, started TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, rol_id INT NOT NULL, name VARCHAR(32) NOT NULL, username VARCHAR(16) NOT NULL, password VARCHAR(64) NOT NULL, hash VARCHAR(128) NOT NULL, isactive TINYINT(1) NOT NULL, INDEX IDX_1483A5E94BAB96C (rol_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_tunnels (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, tunnel_id INT NOT NULL, description VARCHAR(64) NOT NULL, INDEX IDX_350AEDC4A76ED395 (user_id), INDEX IDX_350AEDC4FFA3ECB5 (tunnel_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE users ADD CONSTRAINT FK_1483A5E94BAB96C FOREIGN KEY (rol_id) REFERENCES roles (id)');
        $this->addSql('ALTER TABLE user_tunnels ADD CONSTRAINT FK_350AEDC4A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE user_tunnels ADD CONSTRAINT FK_350AEDC4FFA3ECB5 FOREIGN KEY (tunnel_id) REFERENCES tunnels (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_tunnels DROP FOREIGN KEY FK_350AEDC4FFA3ECB5');
        $this->addSql('ALTER TABLE user_tunnels DROP FOREIGN KEY FK_350AEDC4A76ED395');
        $this->addSql('DROP TABLE tunnels');
        $this->addSql('DROP TABLE users');
        $this->addSql('DROP TABLE user_tunnels');
    }
}
