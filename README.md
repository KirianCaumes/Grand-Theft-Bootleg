# Grand Theft Bootleg

> "A bootleg, sometimes translated pirate disc, is a disc which can contain the recording of a concert made since the public by a spectator […] and that without any authorization." -Wikipedia

Music and its hidden sides submerged. What if we emerge them?

For this, the idea is to create a collaborative platform in the form of a web application. Its objective would be that of a directory making it possible to reference different resources containing bootlegs. 

School Project built with #NextJs, #Deno and #MongoDB

See video presentation:

[![Video](https://img.youtube.com/vi/hoqKFBN7nb0/0.jpg)](https://www.youtube.com/watch?v=hoqKFBN7nb0)

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

#### Test

```sh
cd ./back
DENO_ENV="test" deno test -c tsconfig.json --allow-net --allow-read --allow-env --allow-write --allow-plugin --unstable tests/
DENO_ENV="test" deno test -c tsconfig.json --coverage --allow-net --allow-read --allow-env --allow-write --allow-plugin --unstable tests/ #Coverage
```
