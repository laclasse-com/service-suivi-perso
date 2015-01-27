# service-suivi-perso

[![Build Status](https://travis-ci.org/laclasse-com/service-suivi-perso.png?branch=master)](https://travis-ci.org/laclasse-com/service-suivi-perso) [![Coverage Status](https://coveralls.io/repos/laclasse-com/service-suivi-perso/badge.png?branch=master)](https://coveralls.io/r/laclasse-com/service-suivi-perso?branch=develop) [![Code Climate](https://codeclimate.com/github/laclasse-com/service-suivi-perso.png)](https://codeclimate.com/github/laclasse-com/service-suivi-perso)

## Présentation 

Application de micro-blogging autour de l'élève, aussi appelé *carnet de suivi*.
Le mini-blog se présent en une seule page, avec des onglets. 
Le nombre et la dénomination des onglets est libre, ce qui fait que cette application est complètement maléable et paramétrable pour l'usage que l'on veut en faire : suivi pédagogique, de projet, par matière, espace d'écahnge avec l'élève, lses parents, ....

Le système de droit d'acces est simple et facilement paramétrable. Les droits Lecture/ecriture/Admin sont définis et transférable à tout utilisateurs rattaché au carnet de suivi.

Il est possible de définir une URL publique du carnet, qui donne accès à celui-ci en lecture seule. 
La définition de cette url 

## Règles fonctionelles
 - Par défaut les carnets n'ont pas d'url publique.
 - Une url publique est associée à un carnet et un seul.
 - L'url publique est caduqe : sa suppression entraine l'invisibilité du carnet par le public (personnes non authentifiées sur le site)

## Licence Afero GPL v3

See LICENSE file for more informations.
