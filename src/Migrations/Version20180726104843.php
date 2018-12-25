<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20180726104843 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_tunnels ADD service_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_tunnels ADD CONSTRAINT FK_350AEDC4ED5CA9E6 FOREIGN KEY (service_id) REFERENCES services (id)');
        $this->addSql('CREATE INDEX IDX_350AEDC4ED5CA9E6 ON user_tunnels (service_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_tunnels DROP FOREIGN KEY FK_350AEDC4ED5CA9E6');
        $this->addSql('DROP INDEX IDX_350AEDC4ED5CA9E6 ON user_tunnels');
        $this->addSql('ALTER TABLE user_tunnels DROP service_id');
    }
}
