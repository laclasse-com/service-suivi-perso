SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `suivi` DEFAULT CHARACTER SET utf8 ;
USE `suivi` ;

-- -----------------------------------------------------
-- Table `suivi`.`carnets`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `suivi`.`carnets` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT ,
  `uid_elv` VARCHAR(8) NOT NULL COMMENT 'élève concerné' ,
  `uid_adm` VARCHAR(8) NOT NULL COMMENT 'uid du créateur du carnet de suivi' ,
  `uai` VARCHAR(8) NOT NULL COMMENT 'Code UAI etablissement' ,
  `cls_id` BIGINT(20) NOT NULL COMMENT 'Classe de l\'élève' ,
  `evignal` TINYINT(1) NOT NULL DEFAULT false ,
  `url_publique` VARCHAR(2000) NULL DEFAULT NULL COMMENT 'url publique de consultation en lecture seule du carnet' ,
  `date_creation` TIMESTAMP NULL DEFAULT NULL ,
  `droits_pre` INT(11) NULL DEFAULT '0' COMMENT 'droits read / write\npour le profil PersRelEleve ( parent et tuteurs).\nIl s\'agit ici uniquement des parents de l\'élève concerné par le carnet' ,
  `droits_elv` INT(11) NULL DEFAULT '0' COMMENT 'Droits attribués à l\'élève concerné par le carnet (read et ou write)\n ' ,
  `droits_pen` INT(11) NULL DEFAULT '0' COMMENT 'Droits pour les PersEducNat de l\'établissement autres que ceux qui sont en relation avec l\'élève (profs de sa classe)\n' ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `uid_UNIQUE` (`uid_elv` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `suivi`.`onglets`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `suivi`.`onglets` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT ,
  `nom` VARCHAR(45) NOT NULL ,
  `uid_own` VARCHAR(8) NOT NULL COMMENT 'uid de l\'utilisateur ayant créé cet onglet' ,
  `date_creation` TIMESTAMP NULL DEFAULT NULL ,
  `url_publique` VARCHAR(2000) NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `url_publique_idx` (`url_publique` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1
COMMENT = 'Table des onglets des carnets de suivi. Ces onglets permettent de regrouper les saisies.';


-- -----------------------------------------------------
-- Table `suivi`.`carnets_onglets`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `suivi`.`carnets_onglets` (
  `carnets_id` BIGINT(20) NOT NULL ,
  `onglets_id` BIGINT(20) NOT NULL ,
  `ordre` INT(11) NULL DEFAULT '1' COMMENT 'ordre de présentation des onglets, de gauche à droite.' ,
  PRIMARY KEY (`carnets_id`, `onglets_id`) ,
  INDEX `fk_carnets_has_onglets_onglets1_idx` (`onglets_id` ASC) ,
  INDEX `fk_carnets_has_onglets_carnets1_idx` (`carnets_id` ASC) ,
  CONSTRAINT `fk_carnets_has_onglets_carnets1`
    FOREIGN KEY (`carnets_id` )
    REFERENCES `suivi`.`carnets` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_carnets_has_onglets_onglets1`
    FOREIGN KEY (`onglets_id` )
    REFERENCES `suivi`.`onglets` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `suivi`.`droits_specifiques`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `suivi`.`droits_specifiques` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT ,
  `uid` VARCHAR(8) NOT NULL ,
  `read` INT(11) NULL DEFAULT 0 ,
  `write` INT(11) NULL DEFAULT 0 ,
  `carnets_id` BIGINT(20) NOT NULL ,
  `date_creation` TIMESTAMP NULL DEFAULT NULL ,
  `full_name` VARCHAR(200) NOT NULL ,
  `profil` VARCHAR(45) NOT NULL ,
  `admin` INT(11) NULL DEFAULT 0 ,
  `hopital` TINYINT(1) NOT NULL DEFAULT false ,
  `evignal` TINYINT(1) NOT NULL DEFAULT false ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_droits_specifiques_carnets1_idx` (`carnets_id` ASC) ,
  CONSTRAINT `fk_droits_specifiques_carnets1`
    FOREIGN KEY (`carnets_id` )
    REFERENCES `suivi`.`carnets` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = 'table des droits spécifiques pour tous les utilisateurs à qui l\'on donne accès à un carnet, en dehors de ce qui est prévu par défaut.';


-- -----------------------------------------------------
-- Table `suivi`.`saisies`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `suivi`.`saisies` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT ,
  `uid` VARCHAR(8) NOT NULL ,
  `date_creation` TIMESTAMP NULL DEFAULT NULL ,
  `contenu` TEXT NULL DEFAULT NULL ,
  `carnets_id` BIGINT(20) NOT NULL ,
  `date_modification` DATETIME NULL DEFAULT NULL ,
  `infos_owner` VARCHAR(250) NOT NULL ,
  `avatar` VARCHAR(200) NOT NULL ,
  `avatar_color` VARCHAR(200) NOT NULL ,
  `back_color` VARCHAR(200) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_entrees_carnets_idx` (`carnets_id` ASC) ,
  CONSTRAINT `fk_entrees_carnets`
    FOREIGN KEY (`carnets_id` )
    REFERENCES `suivi`.`carnets` (`id` )
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `suivi`.`entrees_onglets`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `suivi`.`entrees_onglets` (
  `saisies_id` BIGINT(20) NOT NULL ,
  `onglets_id` BIGINT(20) NOT NULL ,
  PRIMARY KEY (`saisies_id`, `onglets_id`) ,
  INDEX `fk_entrees_has_onglets_onglets1_idx` (`onglets_id` ASC) ,
  INDEX `fk_entrees_has_onglets_entrees1_idx` (`saisies_id` ASC) ,
  CONSTRAINT `fk_entrees_has_onglets_entrees1`
    FOREIGN KEY (`saisies_id` )
    REFERENCES `suivi`.`saisies` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_entrees_has_onglets_onglets1`
    FOREIGN KEY (`onglets_id` )
    REFERENCES `suivi`.`onglets` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `suivi`.`docs`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `suivi`.`docs` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT ,
  `nom` VARCHAR(250) NOT NULL ,
  `url` VARCHAR(2000) NOT NULL ,
  `saisies_id` BIGINT(20) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_docs_saisies1_idx` (`saisies_id` ASC) ,
  CONSTRAINT `fk_docs_saisies1`
    FOREIGN KEY (`saisies_id` )
    REFERENCES `suivi`.`saisies` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

USE `suivi` ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
