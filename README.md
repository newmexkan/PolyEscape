# Notre Application

PolyEscape est une application cross-platform (iOS, Android, Windows Phone) d'Escape Game ludique


# Installer l'environnement


## Prérequis

Il faut (si ce n'est déjà fait) installer la dernière version de nodeJS et avoir accès à la commance npm.

```bash
$ npm install -g ionic cordova
```


## Installation

```bash
$ cd PolyEscape
$ npm install
```


# Lancer l'application

## Ionic
Dans le dossier PolyEscape :

Pour lancer l'application dans une fenêtre du navigateur par défaut

```bash
$ ionic serve
```

Rajouter à l'adresse URL /ionic-lab pour avoir un apercu des différentes versions (iOS, Android, Windows Phone).
Attention, certaines fonctionnalités utilisent des composants/éléments du téléphone physique (caméra, notifications, ...). Utiliser le navigateur n'est donc pas optimal puisque certaines fonctionnalités ne fonctionneront pas

Ainsi, pour lancer sur un emulateur/téléphone physique :

```bash
$ ionic cordova platform add [android|ios|windows]
$ ionic cordova run [android|ios|windows]
```
