#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

ARG DOTNETCORE_VESRION=3.1
ARG DEBIAN_VERSION=10.2

FROM debian:10.2

# [Optional] Install the Azure CLI
ARG INSTALL_AZURE_CLI="false"

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# This Dockerfile adds a non-root user with sudo access. Use the "remoteUser"
# property in devcontainer.json to use it. On Linux, the container user's GID/UIDs
# will be updated to match your local UID/GID (when using the dockerFile property).
# See https://aka.ms/vscode-remote/containers/non-root-user for details.
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN apt-get update \
  && apt-get install wget -y \
  && apt-get install gnupg -y \
  && apt-get install git -y \
  && apt install python-pip -y \
  && pip install mssql-cli


RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg \
  && mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/ \
  && wget -q https://packages.microsoft.com/config/debian/10/prod.list \
  && mv prod.list /etc/apt/sources.list.d/microsoft-prod.list \
  && chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg \
  && chown root:root /etc/apt/sources.list.d/microsoft-prod.list

RUN apt-get update -y \
  && apt-get install apt-transport-https -y \
  && apt-get install vim -y\
  && apt-get update -y \

  # FRONT END COMMAND
  # udpate container
  RUN apt-get update -y

# install wget to get nodejs package
RUN apt-get install -y wget

# install nodejs 10.x
RUN wget -qO- https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

# got to Front workspace
WORKDIR /app_gtb/front

# copy package.json and install all node modules
RUN npm install --silent

# got to Front workspace
WORKDIR /app_gtb/back

# copy package.json and install all node modules
RUN npm install --silent

# ENV PATH /root/.dotnet/tools/:/app_gtb/front/node_modules/.bin:/app_gtb/Back/node_modules/.bin:$PATH

WORKDIR /app_gtb

RUN apt install python-pip -y && pip install mssql-cli

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=dialog

