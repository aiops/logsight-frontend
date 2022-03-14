#!/bin/sh
# Copyright 2021-2022 logsight.ai

set -e

check_license() {
  if [[ "$ACCEPT_LOGSIGHT_LICENSE" != *"accept-license"* ]]; then
    printf "Logsight license not accepted. You need to accept the EULA when using this image.\n"
    printf "Please set the environment variable ACCEPT_LOGSIGHT_LICENSE='accept-license'\n"
    printf "For example: docker run -e ACCEPT_LOGSIGHT_LICENSE=accept-license logsight/logsight-frontend\n\n"
    # TODO: Add print with link to license text
    exit 1
  fi
}

check_license
envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js 
exec nginx -g 'daemon off;'
