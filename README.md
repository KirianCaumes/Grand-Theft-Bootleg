# Grand Theft Bootleg

> "Un bootleg, parfois traduit disque pirate, est un disque qui peut contenir l'enregistrement d'un concert fait depuis le public par un spectateur […] et cela sans aucune autorisation." -Wikipédia

La musique et ses faces cachées immergées. Et si nous les émergions ?

Pour cela, l'idée est de créer une plateforme collaborative sous forme d'une application web. Son objectif serait celui d’un annuaire permettant de référencer différentes ressources contenant des bootlegs.

## Run dev

Run Visual Studio Code
File > Open Workspace > GTB.code-workspace (We need to do this beacuse of Deno Extension 😕)
Install "ms-vscode-remote.remote-containers" extension
Open Visual Code in Container : click green icon on bottom left screen, and choose "Open in Container"
Wait for container to setup, and that's it

### Front

#### Install 

```sh
cd ./front
npm i #Only first name
```

#### Run

Go to debuger (Play Icon with a bug) and choose "🦊 Firefox" or "🌈 Chrome"

### Back

#### Install 

Nothing to do

#### Run
 
Go to debuger (Play Icon with a bug) and choose "🦕 Deno"