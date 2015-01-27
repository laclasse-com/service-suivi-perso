# service-suivi-perso

[![Build Status](https://travis-ci.org/laclasse-com/service-suivi-perso.png?branch=master)](https://travis-ci.org/laclasse-com/service-suivi-perso) [![Coverage Status](https://coveralls.io/repos/laclasse-com/service-suivi-perso/badge.png?branch=master)](https://coveralls.io/r/laclasse-com/service-suivi-perso?branch=develop) [![Code Climate](https://codeclimate.com/github/laclasse-com/service-suivi-perso.png)](https://codeclimate.com/github/laclasse-com/service-suivi-perso)

## Présentation 

Application de micro-blogging autour de l'élève, aussi appelé *carnet de suivi*.
Le mini-blog se présente en une seule page, avec des onglets. 
Le nombre et la dénomination des onglets est libre, ce qui fait que cette application est complètement maléable et paramétrable pour l'usage que l'on veut en faire : suivi pédagogique, de projet, par matière, espace d'écahnge avec l'élève, ses parents, ....

Chaque onglet contient les contributions des utilisateurs autorisés à écrire sur le carnet, dans un ordre anté-chronoligique par défaut.

Il est possible d'assoicier des documents issus de son espace de stockage en ligne.

Le système de droits d'accès est simple et facilement paramétrable. Les droits Lecture/ecriture/Admin sont définis et transférable à tout utilisateur rattaché au carnet de suivi.
L'adminstrateur du carnet (admin de l'ENT ou créateur du carnet) peut déléguer des droits d'accès à tout personne rattachée à son établissement (l'élève concerné, ses parents, ses profs ou tout autre personnel de l'établissement).

Il est possible de définir une URL publique du carnet, qui donne accès à celui-ci en lecture seule. 
La définition de cette url entrîne le choix des onglets que l'on souhaite montrer.

## Règles fonctionelles

 - On ne peut définir qu'un et un seul carnet par élève
 - Chaque utilisateur peut modifier et supprimer ses propres contributions.
 - L'administrateur peut modifier et supprimer les contributions de tous.
 - L'administrateur peut ajouter ou supprimer des utilisateurs dans le périmètre de son établissement.
 - Les droits sont imbriqués lire < écrire < admin (celui qui a "écrire" a forcément "lire")
 - Par défaut les carnets n'ont pas d'url publique.
 - Une url publique est associée à un carnet et un seul.
 - L'url publique est caduque : sa suppression entraine l'invisibilité du carnet par le public (personnes non authentifiées sur le site)

## Licence Afero GPL v3

See LICENSE file for more informations.
