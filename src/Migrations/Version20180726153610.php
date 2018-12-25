<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20180726153610 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_tunnels ADD computer_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_tunnels ADD CONSTRAINT FK_350AEDC4A426D518 FOREIGN KEY (computer_id) REFERENCES computer (id)');
        $this->addSql('CREATE INDEX IDX_350AEDC4A426D518 ON user_tunnels (computer_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_tunnels DROP FOREIGN KEY FK_350AEDC4A426D518');
        $this->addSql('DROP INDEX IDX_350AEDC4A426D518 ON user_tunnels');
        $this->addSql('ALTER TABLE user_tunnels DROP computer_id');
    }
}
