<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20180719183829 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE tunnels CHANGE sourceport sourceport SMALLINT UNSIGNED NOT NULL, CHANGE destport destport SMALLINT UNSIGNED NOT NULL');
        $this->addSql('DROP INDEX user_id ON user_tunnels');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE tunnels CHANGE sourceport sourceport SMALLINT NOT NULL, CHANGE destport destport SMALLINT NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX user_id ON user_tunnels (user_id, tunnel_id)');
    }
}
