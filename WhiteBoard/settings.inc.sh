#!/bin/bash

# Adresse mail du rapport
REPORTEMAIL="axel.moussard@gmail.com"
# Nom du projet
PROJECTNAME="WhiteBoard"

#
## Gestion des switches de CLI
#
while getopts ":rdt:" opt; do
  case $opt in
    r)
      echo -e "\033[1mDRY-RUN Désactivé.\033[0m" >&2
      DRYRUN=0
      ;;
    t)
      TARGET=$OPTARG
      ;;
    d)
      echo -e "\033[1mLes suppressions seront incluses dans la synchronisation.\033[0m" >&2
      DELETE=1
      ;;
    \?)
      echo -e "\033[1mInvalid option: -${OPTARG}.\033[0m" >&2
      exit 1
      ;;
  esac
done

# Fichier de log (par défaut avec dry_run)
LOGFILE="/Users/amoussard/Projects/WhiteBoard/logs/rsync_${TARGET}_"
if ((${DRYRUN} == 1)); then
    LOGFILE="${LOGFILE}dry_run_"
fi
LOGFILE="${LOGFILE}$(date +%F_%H%M%S).log"

#
## Réglages propres à l'environnement de destination
#
case ${TARGET} in
    'dev')
        DESTINATION_PATH="/home/amoussard/projects/WhiteBoard/wwwroot"
        DESTINATION_USER="amoussard"
        DESTINATION_HOST="107.170.57.34"
        SOURCE="/Users/amoussard/Projects/WhiteBoard"
        PASS="h^he4ve"
        PORT=""
        ;;
    \?)
        echo -e "\033[1mCible Invalide : ${TARGET}.\033[0m" >&2
        exit 1
        ;;
esac


#
## Réglages propres à l'environnement source
#
CMDPORT="";
if [ ! -z $PORT ]; then
    CMDPORT=" -p $PORT"
fi

# Exclusions
EXCLUDE='
    --exclude=.git
    --exclude=.gitignore
    --exclude=.htaccess
    --exclude=.idea
    --exclude=dump*.sql
    --exclude=composer.*
    --exclude=*.sh
    --exclude=logs
    --exclude=node_modules
'

SETTINGSLOADED=1
