FROM ubuntu:18.04

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# This Dockerfile adds a non-root user with sudo access. Use the "remoteUser"
# property in devcontainer.json to use it. On Linux, the container user's GID/UIDs
# will be updated to match your local UID/GID (when using the dockerFile property).
# See https://aka.ms/vscode-remote/containers/non-root-user for details.
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN apt-get clean
RUN apt-get update
RUN apt-get install gnupg -y \
    && apt-get install git -y \
    && apt-get install python-pip -y \
    && apt-get install apt-transport-https -y \
    && apt-get install vim -y \
    && apt-get install -y wget \
    && apt-get install curl -y \
    && apt-get install wget -y \
    && apt-get install unzip -y

# install nodejs 2.x
RUN wget -qO- https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

# install deno
RUN curl -fsSL https://deno.land/x/install/install.sh | sh -s v1.4.5
ENV DENO_INSTALL="/root/.deno"
ENV PATH="${DENO_INSTALL}/bin:${PATH}"

#Add deno dep
RUN deno install --allow-read --allow-run --allow-write -f --unstable https://deno.land/x/denon/denon.ts 

# ENV PATH /root/.dotnet/tools/:/app_gtb/front/node_modules/.bin:/app_gtb/Back/node_modules/.bin:$PATH

WORKDIR /app_gtb

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=dialog