<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20180726104152 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_tunnels ADD servicename_id INT NOT NULL, DROP servicename');
        $this->addSql('ALTER TABLE user_tunnels ADD CONSTRAINT FK_350AEDC4B6E37E63 FOREIGN KEY (servicename_id) REFERENCES services (id)');
        $this->addSql('CREATE INDEX IDX_350AEDC4B6E37E63 ON user_tunnels (servicename_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_tunnels DROP FOREIGN KEY FK_350AEDC4B6E37E63');
        $this->addSql('DROP INDEX IDX_350AEDC4B6E37E63 ON user_tunnels');
        $this->addSql('ALTER TABLE user_tunnels ADD servicename VARCHAR(32) NOT NULL COLLATE utf8mb4_unicode_ci, DROP servicename_id');
    }
}
