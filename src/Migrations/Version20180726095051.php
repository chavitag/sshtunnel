<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20180726095051 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE computer (id INT AUTO_INCREMENT NOT NULL, domainname VARCHAR(64) NOT NULL, ip VARCHAR(11) NOT NULL, description VARCHAR(128) DEFAULT NULL, mac VARCHAR(17) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE computer_rol (computer_id INT NOT NULL, rol_id INT NOT NULL, INDEX IDX_7649E927A426D518 (computer_id), INDEX IDX_7649E9274BAB96C (rol_id), PRIMARY KEY(computer_id, rol_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE computer_rol ADD CONSTRAINT FK_7649E927A426D518 FOREIGN KEY (computer_id) REFERENCES computer (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE computer_rol ADD CONSTRAINT FK_7649E9274BAB96C FOREIGN KEY (rol_id) REFERENCES roles (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE computer_rol DROP FOREIGN KEY FK_7649E927A426D518');
        $this->addSql('DROP TABLE computer');
        $this->addSql('DROP TABLE computer_rol');
    }
}
